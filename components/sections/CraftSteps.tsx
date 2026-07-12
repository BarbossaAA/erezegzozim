"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const STEPS = [
  {
    title: "בדיקה",
    desc: "אנחנו שומעים את הרעש יחד אתכם ובודקים את המערכת מתחת לרכב.",
  },
  {
    title: "אבחון",
    desc: "מאתרים את מקור הבעיה עצמו, לא רק את הסימפטום שלה.",
  },
  {
    title: "הצעת פתרון",
    desc: "מסבירים בשקיפות מה דורש תיקון, מה כדאי להחליף ומה יכול לחכות.",
  },
  {
    title: "ביצוע",
    desc: "מבצעים את העבודה — ריתוך, החלפה או התאמה, לפי הצורך.",
  },
  {
    title: "בדיקה חוזרת",
    desc: "בודקים שוב את האטימות, היציבות ורמת הרעש לפני שהרכב חוזר אליכם.",
  },
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
            <h2 className="h-display">עבודה נקייה, מהחיתוך ועד האטימה.</h2>
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
