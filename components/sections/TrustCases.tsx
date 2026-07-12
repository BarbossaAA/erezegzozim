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

const CASES = [
  {
    title: "רעש מתכתי בהאצה",
    problem: "הלקוח הגיע עם דפיקות מתחת לרכב בכל האצה.",
    fix: "איתרנו תושבת שבורה, החלפנו אותה ויישרנו את המערכת.",
    result: "הרכב חזר לנסוע בשקט וביציבות.",
  },
  {
    title: "ריח גזים אחרי התנעה",
    problem: "ריח חריף נכנס לתא הנוסעים אחרי כל התנעה.",
    fix: "מצאנו נזילה בצינור הגמיש, החלפנו אותו ובדקנו את אטימות המערכת.",
    result: "הריח נעלם והמערכת חזרה לתקינות מלאה.",
  },
  {
    title: "רעש עמוק מדי מאחור",
    problem: "האגזוז נשמע חזק מהרגיל גם בנסיעה רגועה.",
    fix: "הדוד האחורי היה פגום, והחלפנו אותו בדוד שמתאים לרכב.",
    result: "האגזוז חזר להישמע שקט ונעים.",
  },
];

/** Trust + everyday case stories, condensed into one readable block. */
export default function TrustCases() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tc-head, .tc-photos, .tc-chip, .tc-case",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.06,
          duration: 0.75,
          scrollTrigger: { trigger: section, start: "top 75%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trust"
      className="tc section-tight"
      aria-label="למה ארז אגזוזים"
    >
      <div className="container">
        <div className="tc-head">
          <p className="kicker">המוסך מבפנים</p>
          <h2 className="h-display">לפני שמחליפים, מבינים מה הבעיה.</h2>
          <p className="h-sub">
            אנחנו לא כאן כדי להחליף כמה שיותר חלקים, אלא כדי לפתור את הבעיה
            נכון — ברכב היומיומי וגם ברכבים שלא רואים בכל מוסך. {SITE.owner}{" "}
            בודק את הרכב בעצמו, מסביר לכם מה הוא מצא ומבצע את העבודה מתחילתה
            ועד סופה.
          </p>
        </div>

        <div className="tc-photos">
          <figure className="tc-photo">
            <img
              src="/media/real-facade.webp"
              alt={`חזית המוסך של ${SITE.name} — ${SITE.owner} בפתח הסככה`}
              loading="lazy"
            />
            <figcaption>
              {SITE.owner} · {SITE.name} · {SITE.address}, {SITE.city}
            </figcaption>
          </figure>
          <ul className="tc-chips" aria-label="איך אנחנו עובדים">
            {TRUST.map((t) => (
              <li key={t} className="tc-chip">
                <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
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

        <h3 className="tc-cases-title">מקרים שאנחנו פוגשים כל יום</h3>
        <ul className="tc-cases">
          {CASES.map((c) => (
            <li key={c.title} className="tc-case">
              <h4>{c.title}</h4>
              <p className="tc-problem">{c.problem}</p>
              <p className="tc-fix">{c.fix}</p>
              <p className="tc-result">{c.result}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
