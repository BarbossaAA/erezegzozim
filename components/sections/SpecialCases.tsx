"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const CASES = [
  {
    title: "מערכת שאין לה תחליף",
    steps: [
      ["הסיפור", "רכב אספנות עם צנרת רקובה — והחלק לא מיוצר כבר עשרות שנים."],
      ["הדרך", "שרטוט, מידות, כיפוף למידה, ריתוך והתאמה לפי המקור."],
      ["התוצאה", "נשמע כמו שנשמע אז — וחוקי לכביש."],
    ],
  },
  {
    title: "גבוה מדי בשביל מדף",
    steps: [
      ["הסיפור", "רכב שטח מוגבה שהאגזוז שלו פוגש כל מהמורה במסלול."],
      ["הדרך", "מסלול חדש עם מרווח גחון, זוויות נכונות ותושבות מחוזקות."],
      ["התוצאה", "יורד לשטח בשקט — ועובר טסט."],
    ],
  },
];

/** Two made-to-measure stories, told plainly. */
export default function SpecialCases() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sc-head, .sc-case",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          scrollTrigger: { trigger: section, start: "top 75%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="sc section-tight" aria-label="סיפורי עבודה">
      <div className="container">
        <div className="sc-head">
          <p className="kicker">מהשטח</p>
          <h2 className="h-display">שתי עבודות שמספרות הכל.</h2>
        </div>
        <div className="sc-grid">
          {CASES.map((c) => (
            <article key={c.title} className="sc-case">
              <h3>{c.title}</h3>
              <dl>
                {c.steps.map(([k, v]) => (
                  <div key={k} className="sc-step">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
