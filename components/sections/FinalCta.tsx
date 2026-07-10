"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { SITE } from "@/lib/site";

/** 14. Final CTA — from the exhaust route to a clean road line. */
export default function FinalCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const roadRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const road = roadRef.current;
    if (!section || !road) return;
    if (prefersReducedMotion()) {
      gsap.set(road, { strokeDashoffset: 0 });
      return;
    }
    const len = road.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(road, { strokeDasharray: len, strokeDashoffset: len });
      gsap.to(road, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "center 45%",
          scrub: 0.8,
        },
      });
      gsap.fromTo(
        ".cta-inner > *",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 1,
          scrollTrigger: { trigger: section, start: "top 65%" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="final-cta"
      aria-label="קביעת בדיקה"
    >
      <div className="cta-bg" aria-hidden="true" />
      <svg
        className="cta-road"
        viewBox="0 0 1200 240"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={roadRef}
          d="M 1200 190 C 950 190 900 120 640 120 C 380 120 320 60 0 60"
          fill="none"
          stroke="rgba(227,154,59,0.55)"
          strokeWidth="2.5"
          strokeDasharray="1 0"
        />
      </svg>

      <div className="container cta-inner">
        <p className="kicker">השלב הבא</p>
        <h2 className="h-display">בואו נקשיב לרכב.</h2>
        <p className="h-sub">
          בדיקה קצרה יכולה לחסוך רעש, ריח, רעידות ותקלות שחוזרות שוב ושוב.
        </p>
        <div className="cta-actions">
          <a href={SITE.phoneMobileHref} className="btn btn-primary">
            קבעו בדיקת אגזוז
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            שלחו סרטון בוואטסאפ
          </a>
        </div>
        <p className="cta-contact">
          <a href={SITE.phoneMobileHref} dir="ltr">
            {SITE.phoneMobile}
          </a>
          {" · "}
          <a href={SITE.phoneLandHref} dir="ltr">
            {SITE.phoneLand}
          </a>
          {" · "}
          {SITE.address}, {SITE.city}
          {" · "}
          {SITE.hours}
        </p>
      </div>
    </section>
  );
}
