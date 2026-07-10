"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { letterbox } from "@/lib/letterboxBus";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const STEPS = [
  { title: "בדיקה", desc: "מקשיבים לרעש ובודקים את מסלול הפליטה." },
  { title: "אבחון", desc: "מפרידים בין הסימפטום לבין התקלה האמיתית." },
  { title: "פתרון", desc: "מסבירים מה צריך לתקן, מה כדאי להחליף ומה לא דחוף." },
  { title: "ביצוע", desc: "ריתוך, החלפה, חיזוק או התאמה לפי מצב הרכב." },
  { title: "בדיקה חוזרת", desc: "מוודאים אטימה, יציבות ורמת רעש תקינה." },
];

/** 9. Craft — welding footage, pinned process sequence. */
export default function Craft() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    let lbActive = false;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".craft-copy, .craft-step", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2200",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onToggle: (self) => {
            lbActive = self.isActive;
            if (self.isActive) letterbox.enter();
            else letterbox.leave();
          },
        },
      });

      tl.fromTo(
        ".craft-copy",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.09, ease: "power2.out" },
        0.02
      );

      STEPS.forEach((_, i) => {
        tl.fromTo(
          `.craft-step-${i}`,
          { opacity: 0.14, x: 30 },
          { opacity: 1, x: 0, duration: 0.08, ease: "power2.out" },
          0.16 + i * 0.16
        );
      });
    }, section);

    return () => {
      if (lbActive) letterbox.leave();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="craft"
      aria-label="תהליך העבודה — מבדיקה ועד בדיקה חוזרת"
    >
      <div className="craft-media" aria-hidden="true">
        <AutoVideo
          src="/media/weld.mp4"
          poster="/media/weld-poster.webp"
          className="craft-video"
        />
        <div className="craft-overlay" />
      </div>

      <div className="craft-inner container">
        <div className="craft-copy">
          <p className="kicker">העבודה עצמה</p>
          <h2 className="h-display">חיתוך נקי. התאמה מדויקת. אטימה נכונה.</h2>
        </div>

        <ol className="craft-steps">
          {STEPS.map((s, i) => (
            <li key={s.title} className={`craft-step craft-step-${i}`}>
              <span className="craft-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="craft-step-title">{s.title}</h3>
                <p className="craft-step-desc">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
