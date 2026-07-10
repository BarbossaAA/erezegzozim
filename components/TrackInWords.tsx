"use client";

import { useMemo } from "react";

/**
 * Splits text into word spans for GSAP track-in animation.
 * Parent animates `.word` children inside a `.track-in` scope.
 * Spaces stay OUTSIDE the inline-block word spans so they aren't trimmed.
 */
export default function TrackInWords({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const words = useMemo(() => text.split(" "), [text]);
  return (
    <Tag className={`track-in ${className ?? ""}`} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true">
          <span className="word">{w}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
