"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const CASES = [
  {
    title: "רעש מתכתי בהאצה",
    problem: "דפיקות מתחת לרכב בזמן האצה.",
    diagnosis: "תושבת אגזוז שבורה וחיבור רופף.",
    solution: "החלפת תושבת, יישור וחיזוק המערכת.",
    result: "נסיעה יציבה ושקטה יותר.",
  },
  {
    title: "ריח גזים אחרי התנעה",
    problem: "ריח חריף נכנס לאזור תא הנוסעים.",
    diagnosis: "נזילה באזור הצינור הגמיש.",
    solution: "החלפת צינור גמיש ובדיקת אטימה.",
    result: "מערכת אטומה וחזרה לשימוש תקין.",
  },
  {
    title: "רעש עמוק מדי מאחור",
    problem: "האגזוז נשמע חזק מהרגיל גם בנסיעה רגועה.",
    diagnosis: "דוד אחורי פגום.",
    solution: "החלפת דוד אחורי בהתאמה לרכב.",
    result: "רמת רעש מאוזנת ונעימה יותר.",
  },
  {
    title: "מערכת שאין לה תחליף",
    problem: "רכב אספנות עם צנרת רקובה — והחלק לא מיוצר כבר עשרות שנים.",
    diagnosis: "אין חלק מדף. יש שרטוט, מידות ורצון שהצליל יישאר מקורי.",
    solution: "בנייה מחדש של המערכת: כיפוף למידה, ריתוך והתאמה לפי המקור.",
    result: "נשמע כמו שנשמע אז — וחוקי לכביש.",
  },
  {
    title: "גבוה מדי בשביל מדף",
    problem: "רכב שטח מוגבה שהאגזוז שלו פוגש כל מהמורה במסלול.",
    diagnosis: "מסלול צנרת מקורי שלא נבנה לגובה הזה.",
    solution: "התוויית מסלול חדש עם מרווח גחון, זוויות נכונות ותושבות מחוזקות.",
    result: "יורד לשטח בשקט — ועובר טסט.",
  },
];

const FLOW = ["הסימפטום", "האבחון", "התיקון", "התוצאה"] as const;

/** 12. Case Stories — horizontal scroll cards with symptom→result flow. */
export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      // RTL: content flows right→left, so the track moves in +x
      const tween = gsap.to(track, {
        x: () => distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance() + 200}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
      stRef.current = tween.scrollTrigger ?? null;

      gsap.utils.toArray<SVGPathElement>(".case-flow-line").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.fromTo(
          p,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            duration: 1.6,
            delay: i * 0.35,
            ease: "power2.out",
            scrollTrigger: { trigger: section, start: "top 60%" },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="cases"
      aria-label="מקרים מהמוסך"
    >
      <div className="cases-head container">
        <p className="kicker">מהשטח</p>
        <h2 className="h-display">מקרים שאנחנו פוגשים כל יום.</h2>
      </div>

      <div className="cases-track" ref={trackRef}>
        {CASES.map((c, idx) => (
          <article key={c.title} className="case-card">
            <span className="case-index" aria-hidden="true">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <h3 className="case-title">{c.title}</h3>

            <svg
              className="case-flow-svg"
              viewBox="0 0 12 300"
              preserveAspectRatio="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                className="case-flow-line"
                d="M 6 0 L 6 300"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>

            <dl className="case-flow">
              {(
                [c.problem, c.diagnosis, c.solution, c.result] as const
              ).map((value, i) => (
                <div key={FLOW[i]} className="case-step">
                  <dt>{FLOW[i]}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
        <div className="case-card case-card-cta">
          <h3 className="case-title">גם הרכב שלכם מספר סיפור.</h3>
          <p>שלחו סרטון קצר של הרעש — ונחזור עם כיוון ראשוני.</p>
          <a
            href="#booking"
            className="btn btn-primary"
            onFocus={() => {
              // the CTA sits at the far end of the scrubbed track — when focus
              // arrives by keyboard, jump the scroll to where it is visible
              const st = stRef.current;
              if (st && Math.abs(window.scrollY - st.end) > 4) {
                window.scrollTo({ top: st.end, behavior: "auto" });
              }
            }}
          >
            קבעו בדיקת אגזוז
          </a>
        </div>
      </div>
    </section>
  );
}
