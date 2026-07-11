"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

type Cta = { href: string; label: string; external?: boolean };

type Props = {
  video: string;
  poster: string;
  kicker?: string;
  title: string;
  sub: string;
  primary?: Cta;
  secondary?: Cta;
  chips?: string[];
  /** full viewport (home) vs shorter banner (inner pages) */
  tall?: boolean;
};

/**
 * Autoplaying cinematic hero: the film runs on its own, cinema bars open
 * once on load, and the copy slides in on a timed sequence — no scroll
 * required, nothing is gated behind scrubbing.
 */
export default function HeroVideo({
  video,
  poster,
  kicker,
  title,
  sub,
  primary,
  secondary,
  chips,
  tall = true,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const words = title.split(" ");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) {
      gsap.set(
        section.querySelectorAll(
          ".hv-bar, .hv-kicker, .hv-title .word, .hv-sub, .hv-ctas, .hv-chips, .hv-hint"
        ),
        { clearProps: "all", opacity: 1, yPercent: 0, y: 0 }
      );
      section.querySelectorAll<HTMLElement>(".hv-bar").forEach((b) => {
        b.style.display = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      // cinema bars open like a curtain — once, on load
      tl.to(".hv-bar-top", { yPercent: -101, duration: 1.5, ease: "power3.inOut" }, 0.35);
      tl.to(".hv-bar-bottom", { yPercent: 101, duration: 1.5, ease: "power3.inOut" }, 0.35);
      if (kicker) {
        tl.fromTo(".hv-kicker", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.9);
      }
      tl.fromTo(
        ".hv-title .word",
        { opacity: 0, yPercent: 60 },
        { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.07 },
        1.05
      );
      tl.fromTo(".hv-sub", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, 1.7);
      tl.fromTo(".hv-ctas", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, 2.05);
      tl.fromTo(".hv-chips", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 2.3);
      tl.fromTo(".hv-hint", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 2.7);
    }, section);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hero
      className={`hv ${tall ? "hv-tall" : "hv-short"}`}
      aria-label={title}
    >
      <div className="hv-media" aria-hidden="true">
        <AutoVideo src={video} poster={poster} className="hv-video" eager />
        <div className="hv-shade" />
      </div>

      <div className="hv-bar hv-bar-top" aria-hidden="true" />
      <div className="hv-bar hv-bar-bottom" aria-hidden="true" />

      <div className="hv-copy container">
        {kicker && <p className="hv-kicker kicker">{kicker}</p>}
        <h1 className="hv-title" aria-label={title}>
          {words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="word-wrap">
                <span className="word">{w}</span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p className="hv-sub">{sub}</p>
        {(primary || secondary) && (
          <div className="hv-ctas">
            {primary && (
              <a
                href={primary.href}
                className="btn btn-primary"
                {...(primary.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {primary.label}
              </a>
            )}
            {secondary && (
              <a
                href={secondary.href}
                className="btn btn-ghost"
                {...(secondary.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {secondary.label}
              </a>
            )}
          </div>
        )}
        {chips && chips.length > 0 && (
          <ul className="hv-chips" aria-label="פרטים מהירים">
            {chips.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
      </div>

      {tall && (
        <div className="hv-hint" aria-hidden="true">
          <span className="hint-lamp" />
        </div>
      )}
    </section>
  );
}
