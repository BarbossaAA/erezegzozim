"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import { SITE } from "@/lib/site";

const TRUST = [
  "אבחון לפני החלפה",
  "הסבר ברור",
  "התאמה לרכב",
  "עבודה בטוחה לכביש",
  "בדיקה חוזרת",
  "אחריות לפי סוג עבודה",
];

/** 11. Trust — the real shop, the real person. */
export default function Trust() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".trust-head, .trust-photos, .trust-card",
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.9,
          scrollTrigger: { trigger: section, start: "top 72%" },
        }
      );
      // icon line-draw
      gsap.utils.toArray<SVGPathElement>(".trust-icon path").forEach((p) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: p, start: "top 85%" },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="trust section"
      aria-label="למה ארז אגזוזים"
    >
      <div className="container">
        <div className="trust-head">
          <p className="kicker">המוסך, באמת</p>
          <h2 className="h-display">לפני שמחליפים — מבינים.</h2>
          <p className="h-sub">
            המטרה היא לא להחליף כמה שיותר. המטרה היא לפתור נכון — ברכב של כל
            יום, וגם ברכבים שלא פוגשים בכל מוסך. זה המוסך, וזה {SITE.owner} —
            מי שבודק, מסביר ומבצע.
          </p>
        </div>

        <div className="trust-photos">
          <figure className="trust-photo trust-photo-main">
            <img
              src="/media/real-facade.webp"
              alt={`חזית המוסך של ${SITE.name} — ${SITE.owner} בפתח הסככה`}
              loading="lazy"
            />
            <figcaption>
              {SITE.owner} · {SITE.name} · {SITE.address}, {SITE.city}
            </figcaption>
          </figure>
          <figure className="trust-photo">
            <img
              src="/media/real-entrance.webp"
              alt="כניסת המוסך עם רמפות הרמה ושלט השירותים — אבחון ותיקון בעיות זיהום אוויר, אגזוזים וממירים קטליטיים"
              loading="lazy"
            />
            <figcaption>אבחון זיהום אוויר · אגזוזים · ממירים קטליטיים</figcaption>
          </figure>
        </div>

        <ul className="trust-grid">
          {TRUST.map((t) => (
            <li key={t} className="trust-card">
              <svg
                className="trust-icon"
                viewBox="0 0 32 32"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M6 17 L13 24 L26 9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
