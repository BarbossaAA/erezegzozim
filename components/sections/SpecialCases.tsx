"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const CASES = [
  {
    title: "מערכת שאין לה תחליף",
    steps: [
      [
        "הסיפור",
        "רכב אספנות הגיע אלינו עם צנרת רקובה, והחלק המקורי כבר לא מיוצר עשרות שנים.",
      ],
      [
        "הדרך",
        "מדדנו, שרטטנו ובנינו את המערכת מחדש — כיפוף, ריתוך והתאמה לפי המקור.",
      ],
      [
        "התוצאה",
        "הרכב נשמע כמו ביום שיצא מהמפעל, וחוקי לחלוטין לנסיעה בכביש.",
      ],
    ],
  },
  {
    title: "גבוה מדי בשביל פתרון מדף",
    steps: [
      [
        "הסיפור",
        "רכב שטח מוגבה הגיע אלינו אחרי שהאגזוז שלו נפגע שוב ושוב במסלולים.",
      ],
      [
        "הדרך",
        "בנינו מסלול צנרת חדש עם מרווח גחון מלא, זוויות נכונות ותושבות מחוזקות.",
      ],
      [
        "התוצאה",
        "הרכב יורד לשטח בלי דאגות — ועובר את הטסט בלי בעיה.",
      ],
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
          <h2 className="h-display">שתי עבודות שממחישות איך אנחנו עובדים.</h2>
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
