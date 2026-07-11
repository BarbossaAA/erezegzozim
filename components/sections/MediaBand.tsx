"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

type Props = {
  video: string;
  poster: string;
  kicker: string;
  title: string;
  sub: string;
  chips?: string[];
  /** put the video on the opposite side */
  flip?: boolean;
};

/** Video + copy band: ambient footage, short words, no scroll games. */
export default function MediaBand({
  video,
  poster,
  kicker,
  title,
  sub,
  chips,
  flip = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll(".mb-visual, .mb-copy"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.85,
          scrollTrigger: { trigger: section, start: "top 74%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`mb section-tight ${flip ? "mb-flip" : ""}`}
      aria-label={title}
    >
      <div className="container mb-grid">
        <div className="mb-visual">
          <AutoVideo src={video} poster={poster} className="mb-video" />
        </div>
        <div className="mb-copy">
          <p className="kicker">{kicker}</p>
          <h2 className="h-display">{title}</h2>
          <p className="h-sub">{sub}</p>
          {chips && (
            <ul className="mb-chips">
              {chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
