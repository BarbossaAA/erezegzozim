"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Looping background video.
 * Default: lazy — loads + plays only near the viewport, pauses away.
 * `eager`: starts loading and playing immediately (hero use).
 * Under reduced motion only the poster shows.
 */
export default function AutoVideo({
  src,
  poster,
  className,
  eager = false,
}: {
  src: string;
  poster: string;
  className?: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (prefersReducedMotion()) {
      video.removeAttribute("src");
      video.load();
      return;
    }

    // React does not always emit the muted ATTRIBUTE in SSR HTML, and Chrome
    // decides autoplay eligibility from it — force the property before play()
    video.muted = true;
    video.defaultMuted = true;

    if (eager) {
      if (!video.src) video.src = src;
      video.play().catch(() => {});
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
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
  }, [src, eager]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={eager}
      preload={eager ? "auto" : "none"}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
