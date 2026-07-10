"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

export type ScrubCanvasHandle = {
  /** progress 0..1 along the frame sequence */
  setProgress: (p: number) => void;
};

type Props = {
  frames: string[];
  className?: string;
  /** frames decoded eagerly (spread across the sequence) for instant feedback */
  eagerCount?: number;
  ariaLabel?: string;
  /** start streaming immediately instead of waiting to approach the viewport */
  priority?: boolean;
};

/** decoded bitmaps kept around the playhead; beyond this they are released */
const WINDOW_AHEAD = 22;
const WINDOW_BEHIND = 12;
const EVICT_SLACK = 18;
const MAX_CONCURRENT_DECODES = 3;

/**
 * Scroll-scrubbed frame sequence renderer.
 *
 * Pipeline: fetch frames as compressed Blobs (cheap to keep for the whole
 * session) → decode a sliding window around the playhead into GPU-resident
 * ImageBitmaps → blit from a continuous rAF loop that only runs while the
 * canvas is on screen. drawImage(bitmap) never re-decodes, so scrubbing has
 * no main-thread decode hitches — the "frozen frame" jank of <img>-based
 * scrubbers.
 */
const ScrubCanvas = forwardRef<ScrubCanvasHandle, Props>(function ScrubCanvas(
  { frames, className, eagerCount = 6, ariaLabel, priority = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      progressRef.current = Math.min(1, Math.max(0, p));
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const count = frames.length;
    const blobs: (Blob | null)[] = new Array(count).fill(null);
    const bitmaps = new Map<number, ImageBitmap>();
    const decoding = new Set<number>();
    let disposed = false;
    let streaming = false;
    let running = false;
    let rafId = 0;
    let lastDrawn = -1;

    /* ---------- drawing ---------- */

    const draw = (index: number) => {
      const bmp = bitmaps.get(index);
      if (!bmp) return;
      const { width: cw, height: ch } = canvas;
      if (cw === 0 || ch === 0) return;
      const scale = Math.max(cw / bmp.width, ch / bmp.height);
      const dw = bmp.width * scale;
      const dh = bmp.height * scale;
      ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      lastDrawn = index;
    };

    const nearestBitmap = (target: number): number => {
      if (bitmaps.has(target)) return target;
      for (let d = 1; d < count; d++) {
        if (bitmaps.has(target - d)) return target - d;
        if (bitmaps.has(target + d)) return target + d;
      }
      return -1;
    };

    /* ---------- decode scheduling ---------- */

    const decode = (i: number) => {
      if (disposed || bitmaps.has(i) || decoding.has(i)) return;
      const blob = blobs[i];
      if (!blob || decoding.size >= MAX_CONCURRENT_DECODES) return;
      decoding.add(i);
      createImageBitmap(blob)
        .then((bmp) => {
          decoding.delete(i);
          if (disposed) {
            bmp.close();
            return;
          }
          bitmaps.set(i, bmp);
          // first available frame → paint immediately even before the loop runs
          if (lastDrawn === -1) draw(nearestBitmap(targetIndex()));
        })
        .catch(() => decoding.delete(i));
    };

    const targetIndex = () =>
      Math.round(progressRef.current * (count - 1));

    /** keep the decode window filled and release bitmaps far behind/ahead */
    const manageWindow = () => {
      const t = targetIndex();
      // decode closest-first around the playhead
      for (let d = 0; d <= WINDOW_AHEAD; d++) {
        if (decoding.size >= MAX_CONCURRENT_DECODES) break;
        const fwd = t + d;
        if (fwd < count) decode(fwd);
        const back = t - d;
        if (d > 0 && d <= WINDOW_BEHIND && back >= 0) decode(back);
      }
      // evict far-away bitmaps (never the eager anchors)
      if (bitmaps.size > WINDOW_AHEAD + WINDOW_BEHIND + EVICT_SLACK) {
        for (const [i, bmp] of bitmaps) {
          if (eagerSet.has(i)) continue;
          if (i < t - WINDOW_BEHIND - EVICT_SLACK || i > t + WINDOW_AHEAD + EVICT_SLACK) {
            bmp.close();
            bitmaps.delete(i);
          }
        }
      }
    };

    /* ---------- render loop (runs only while on screen) ---------- */

    const tick = () => {
      if (!running || disposed) return;
      manageWindow();
      const best = nearestBitmap(targetIndex());
      if (best >= 0 && best !== lastDrawn) draw(best);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (running || disposed) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    /* ---------- fetching ---------- */

    const eagerSet = new Set<number>([0]);
    for (let k = 1; k < eagerCount; k++) {
      eagerSet.add(Math.round((k / (eagerCount - 1)) * (count - 1)));
    }

    const fetchFrame = async (i: number) => {
      if (disposed || blobs[i]) return;
      try {
        const res = await fetch(frames[i]);
        if (!res.ok) return;
        blobs[i] = await res.blob();
        // eager anchors decode as soon as they arrive
        if (eagerSet.has(i)) decode(i);
      } catch {
        /* transient network failure — nearest-frame fallback covers it */
      }
    };

    const stream = async () => {
      if (streaming || disposed) return;
      streaming = true;
      await Promise.all([...eagerSet].map(fetchFrame));
      const queue = frames.map((_, i) => i).filter((i) => !blobs[i]);
      const workers = new Array(4).fill(0).map(async () => {
        while (queue.length && !disposed) {
          const i = queue.shift();
          if (i !== undefined) await fetchFrame(i);
        }
      });
      await Promise.all(workers);
    };

    /* ---------- sizing ---------- */

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      // frames are 1280w — higher canvas density only adds blit cost
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastDrawn = -1; // force redraw at new size
        draw(nearestBitmap(targetIndex()));
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    /* ---------- lifecycle ---------- */

    const reduced = prefersReducedMotion();
    let io: IntersectionObserver | null = null;

    if (reduced) {
      // static poster only — no timeline ever scrubs this canvas
      fetchFrame(0).then(() => decode(0));
    } else {
      // render loop + streaming follow visibility
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            stream();
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: priority ? "300% 0px" : "150% 0px" }
      );
      io.observe(canvas);
      if (priority) stream();
    }

    return () => {
      disposed = true;
      stopLoop();
      ro.disconnect();
      io?.disconnect();
      bitmaps.forEach((bmp) => bmp.close());
      bitmaps.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frames, priority]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
    />
  );
});

export default ScrubCanvas;
