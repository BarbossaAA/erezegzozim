"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Lazy looping background video: loads + plays only when near the viewport,
 * pauses when away. Falls back to the poster under reduced motion.
 */
export default function AutoVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) return; // poster only

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "35% 0px" }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
