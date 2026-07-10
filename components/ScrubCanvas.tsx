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

/** decode depth in the scrub direction / against it */
const WINDOW_MAIN = 22;
const WINDOW_MINOR = 12;
/** eviction keeps [t-KEEP_SPAN, t+KEEP_SPAN] once MAX_KEPT is exceeded */
const KEEP_SPAN = 30;
const MAX_KEPT = 52;
const MAX_CONCURRENT_DECODES = 3;

/**
 * Scroll-scrubbed frame sequence renderer.
 *
 * Pipeline: fetch frames as compressed Blobs (playhead-nearest first) →
 * decode a direction-aware sliding window into GPU-resident ImageBitmaps →
 * blit from a rAF loop that only runs while the canvas is on screen.
 * drawImage(bitmap) never re-decodes, so scrubbing has no main-thread
 * decode hitches. Bitmaps outside the window — and everything except the
 * anchors when the section scrolls away — are released.
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
    const fetching = new Set<number>();
    const bitmaps = new Map<number, ImageBitmap>();
    const decoding = new Set<number>();
    let disposed = false;
    let streaming = false;
    let running = false;
    let rafId = 0;
    let lastDrawn = -1;
    let lastTarget = 0;
    let dir = 1; // scrub direction: +1 forward, -1 backward

    const eagerSet = new Set<number>([0]);
    for (let k = 1; k < eagerCount; k++) {
      eagerSet.add(Math.round((k / (eagerCount - 1)) * (count - 1)));
    }

    const targetIndex = () => Math.round(progressRef.current * (count - 1));

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

    /* ---------- decode scheduling (never drops work: re-kicked on every
       completion, blob arrival, and tick) ---------- */

    const wanted = (i: number) =>
      i >= 0 && i < count && !bitmaps.has(i) && !decoding.has(i) && !!blobs[i];

    const nextDecodeIndex = (): number => {
      const t = targetIndex();
      const ahead = dir >= 0 ? WINDOW_MAIN : WINDOW_MINOR;
      const behind = dir >= 0 ? WINDOW_MINOR : WINDOW_MAIN;
      const max = Math.max(ahead, behind);
      for (let d = 0; d <= max; d++) {
        // movement side gets the slot first at every distance
        const order = dir >= 0 ? [t + d, t - d] : [t - d, t + d];
        for (const i of order) {
          if (i === t + d && d > ahead) continue;
          if (i === t - d && d > behind) continue;
          if (wanted(i)) return i;
        }
      }
      for (const i of eagerSet) if (wanted(i)) return i;
      return -1;
    };

    const kick = () => {
      if (disposed) return;
      while (decoding.size < MAX_CONCURRENT_DECODES) {
        const i = nextDecodeIndex();
        if (i < 0) break;
        decoding.add(i);
        createImageBitmap(blobs[i] as Blob)
          .then((bmp) => {
            decoding.delete(i);
            if (disposed) {
              bmp.close();
              return;
            }
            bitmaps.set(i, bmp);
            // first available frame → paint before the loop's next tick
            if (lastDrawn === -1) draw(nearestBitmap(targetIndex()));
            kick();
          })
          .catch(() => {
            decoding.delete(i);
            kick();
          });
      }
    };

    const evict = (keepSpan: number, floor: number) => {
      if (bitmaps.size <= floor) return;
      const t = targetIndex();
      for (const [i, bmp] of bitmaps) {
        if (eagerSet.has(i) || i === lastDrawn) continue;
        if (i < t - keepSpan || i > t + keepSpan) {
          bmp.close();
          bitmaps.delete(i);
        }
      }
    };

    /* ---------- render loop (runs only while on screen) ---------- */

    const tick = () => {
      if (!running || disposed) return;
      const t = targetIndex();
      if (t !== lastTarget) {
        dir = t > lastTarget ? 1 : -1;
        lastTarget = t;
      }
      kick();
      evict(KEEP_SPAN, MAX_KEPT);
      const best = nearestBitmap(t);
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

    /* ---------- fetching: playhead-nearest first ---------- */

    const nextFetchIndex = (): number => {
      const t = targetIndex();
      let best = -1;
      let bestScore = Infinity;
      for (let i = 0; i < count; i++) {
        if (blobs[i] || fetching.has(i)) continue;
        const delta = i - t;
        const onMovementSide = dir >= 0 ? delta >= 0 : delta <= 0;
        const score = Math.abs(delta) * (onMovementSide ? 1 : 1.5);
        if (score < bestScore) {
          bestScore = score;
          best = i;
        }
      }
      return best;
    };

    const fetchFrame = async (i: number) => {
      if (disposed || blobs[i] || fetching.has(i)) return;
      fetching.add(i);
      try {
        const res = await fetch(frames[i]);
        if (res.ok) {
          blobs[i] = await res.blob();
          kick();
        }
      } catch {
        /* transient network failure — nearest-frame fallback covers it */
      } finally {
        fetching.delete(i);
      }
    };

    const stream = async () => {
      if (streaming || disposed) return;
      streaming = true;
      await Promise.all([...eagerSet].map(fetchFrame));
      const workers = new Array(4).fill(0).map(async () => {
        while (!disposed) {
          const i = nextFetchIndex();
          if (i < 0) break;
          await fetchFrame(i);
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
      fetchFrame(0).then(kick);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          // batched records: only the NEWEST reflects current visibility
          const entry = entries[entries.length - 1];
          if (entry.isIntersecting) {
            stream();
            startLoop();
          } else {
            stopLoop();
            // free decoded frames; blobs stay, so re-entry re-decodes fast
            evict(0, 0);
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
