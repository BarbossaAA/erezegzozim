"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const STEPS = [
  { title: "בדיקה", desc: "מקשיבים לרעש ובודקים את מסלול הפליטה." },
  { title: "אבחון", desc: "מפרידים בין הסימפטום לבין התקלה האמיתית." },
  { title: "פתרון", desc: "מסבירים מה לתקן, מה להחליף ומה לא דחוף." },
  { title: "ביצוע", desc: "ריתוך, החלפה, חיזוק או התאמה לפי מצב הרכב." },
  { title: "בדיקה חוזרת", desc: "מוודאים אטימה, יציבות ורמת רעש תקינה." },
];

/** The five working steps, revealed once — welding footage alongside. */
export default function CraftSteps() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cs-copy, .cs-step, .cs-visual",
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          scrollTrigger: { trigger: section, start: "top 74%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="cs section-tight" aria-label="תהליך העבודה">
      <div className="container cs-grid">
        <div>
          <div className="cs-copy">
            <p className="kicker">העבודה עצמה</p>
            <h2 className="h-display">חיתוך נקי. התאמה מדויקת. אטימה נכונה.</h2>
          </div>
          <ol className="cs-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="cs-step">
                <span className="cs-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="cs-visual" aria-hidden="true">
          <AutoVideo
            src="/media/weld.mp4"
            poster="/media/weld-poster.webp"
            className="cs-video"
          />
        </div>
      </div>
    </section>
  );
}
