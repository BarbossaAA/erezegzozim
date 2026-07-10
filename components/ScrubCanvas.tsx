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
  /** frames loaded eagerly before the rest stream in */
  eagerCount?: number;
  ariaLabel?: string;
  /** start streaming immediately instead of waiting to approach the viewport */
  priority?: boolean;
};

/**
 * Canvas frame-sequence scrubber. Streaming starts only when the canvas
 * approaches the viewport (unless `priority`), frames are decoded off the
 * draw path, and under prefers-reduced-motion only the first frame loads.
 * Drawing always falls back to the nearest loaded frame so scrubbing never
 * blanks out while assets are still arriving.
 */
const ScrubCanvas = forwardRef<ScrubCanvasHandle, Props>(function ScrubCanvas(
  { frames, className, eagerCount = 6, ariaLabel, priority = false },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedRef = useRef<boolean[]>([]);
  const currentIndexRef = useRef(0);
  const rafRef = useRef(0);

  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !loadedRef.current[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width: cw, height: ch } = canvas;
    if (cw === 0 || ch === 0) return;
    // cover-fit
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  const nearestLoaded = (target: number): number => {
    if (loadedRef.current[target]) return target;
    for (let d = 1; d < frames.length; d++) {
      if (loadedRef.current[target - d]) return target - d;
      if (loadedRef.current[target + d]) return target + d;
    }
    return -1;
  };

  useImperativeHandle(ref, () => ({
    setProgress(p: number) {
      const target = Math.round(
        Math.min(1, Math.max(0, p)) * (frames.length - 1)
      );
      const index = nearestLoaded(target);
      if (index < 0 || index === currentIndexRef.current) return;
      currentIndexRef.current = index;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => draw(index));
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    imagesRef.current = new Array(frames.length).fill(null);
    loadedRef.current = new Array(frames.length).fill(false);
    let disposed = false;
    let streaming = false;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (disposed || imagesRef.current[i]) return resolve();
        const img = new Image();
        img.src = frames[i];
        const done = () => {
          if (disposed) return resolve();
          imagesRef.current[i] = img;
          loadedRef.current[i] = true;
          // if we're waiting on this frame (or first paint), draw it
          const target = currentIndexRef.current;
          if (i === target || !loadedRef.current[target]) draw(nearestLoaded(target));
          resolve();
        };
        // decode() waits for fetch + decode off the draw path
        img
          .decode()
          .then(done)
          .catch(() => {
            if (img.complete && img.naturalWidth > 0) done();
            else resolve();
          });
      });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      draw(nearestLoaded(currentIndexRef.current));
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const stream = async () => {
      if (streaming || disposed) return;
      streaming = true;
      // eager: frames spread across the sequence for instant scrub feedback
      const eager: number[] = [0];
      for (let k = 1; k < eagerCount; k++) {
        eager.push(Math.round((k / (eagerCount - 1)) * (frames.length - 1)));
      }
      await Promise.all(eager.map(load));
      // stream the rest with limited concurrency
      const queue = frames.map((_, i) => i).filter((i) => !loadedRef.current[i]);
      const workers = new Array(4).fill(0).map(async () => {
        while (queue.length && !disposed) {
          const i = queue.shift();
          if (i !== undefined) await load(i);
        }
      });
      await Promise.all(workers);
    };

    let io: IntersectionObserver | null = null;
    if (prefersReducedMotion()) {
      // static poster only — no timeline will ever scrub this canvas
      load(0);
    } else if (priority) {
      stream();
    } else {
      // begin streaming when the section approaches the viewport
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            stream();
            io?.disconnect();
            io = null;
          }
        },
        { rootMargin: "150% 0px" }
      );
      io.observe(canvas);
    }

    return () => {
      disposed = true;
      ro.disconnect();
      io?.disconnect();
      cancelAnimationFrame(rafRef.current);
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
