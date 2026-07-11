"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";
import { SITE } from "@/lib/site";

const PAIRS: { symptom: string; diagnosis: string; detail: string }[] = [
  {
    symptom: "רעש מתכתי בהאצה",
    diagnosis: "תושבת אגזוז שבורה",
    detail: "כשהתושבת נשברת, הצנרת מקבלת חופש תנועה ופוגשת את הרצפה בכל האצה.",
  },
  {
    symptom: "אגזוז מרעיש בסרק",
    diagnosis: "דוד פנימי שהתפרק",
    detail: "צמר או מחיצות שהתפרקו בתוך הדוד משנים את הצליל גם בסיבובי סרק.",
  },
  {
    symptom: "ריח גזים ברכב",
    diagnosis: "נזילת פליטה",
    detail: "נזילה לפני תא הנוסעים מוצאת דרך פנימה. זו תקלה שמטפלים בה מיד.",
  },
  {
    symptom: "דפיקה מתחת לרכב",
    diagnosis: "התקנה לא מיושרת",
    detail: "מערכת שלא יושרה נכון נוגעת בנקודות מגע — ודופקת בכל מהמורה.",
  },
  {
    symptom: "שריקה בנסיעה",
    diagnosis: "חיבור לא אטום",
    detail: "אוויר שנדחס דרך סדק צר מייצר שריקה שמתחזקת עם הסיבובים.",
  },
  {
    symptom: "רעידות אחרי התנעה",
    diagnosis: "צינור גמיש קרוע",
    detail: "הגמיש סופג את תנועת המנוע. כשהוא נקרע — הרעידה עוברת לשלדה.",
  },
  {
    symptom: "כישלון בטסט",
    diagnosis: "ממיר שדורש בדיקה",
    detail: "ערכי פליטה חריגים מתחילים כמעט תמיד בממיר או בחיישנים סביבו.",
  },
  {
    symptom: "אגזוז נמוך / נוגע",
    diagnosis: "צנרת חלודה",
    detail: "חלודה מחלישה נקודות עיגון, המערכת שוקעת — ומתחילה לגרד את הכביש.",
  },
];

/** "What do you hear?" — instant self-identification, straight to a next step. */
export default function SymptomFinder() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const select = (i: number) => {
    setActive(i);
    if (!prefersReducedMotion() && panelRef.current) {
      gsap.fromTo(
        panelRef.current.querySelector(".sf-body"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }
  };

  const onTablistKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") next = (active + 1) % PAIRS.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowRight")
      next = (active - 1 + PAIRS.length) % PAIRS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = PAIRS.length - 1;
    if (next === null) return;
    e.preventDefault();
    select(next);
    listRef.current?.querySelectorAll<HTMLButtonElement>(".sf-chip")[next]?.focus();
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sf-head, .sf-chips, .sf-panel",
        { opacity: 0, y: 30 },
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

  const pair = PAIRS[active];

  return (
    <section
      ref={sectionRef}
      id="symptoms"
      className="sf section-tight"
      aria-label="מה אתם שומעים?"
    >
      <div className="container">
        <div className="sf-head">
          <p className="kicker">אבחון מהיר</p>
          <h2 className="h-display">מה אתם שומעים?</h2>
        </div>

        <div className="sf-stage">
          <div
            className="sf-chips"
            ref={listRef}
            role="tablist"
            aria-label="סימפטומים נפוצים"
            aria-orientation="vertical"
            onKeyDown={onTablistKeyDown}
          >
            {PAIRS.map((p, i) => (
              <button
                key={p.symptom}
                role="tab"
                aria-selected={active === i}
                aria-controls="sf-panel"
                id={`sf-tab-${i}`}
                tabIndex={active === i ? 0 : -1}
                className={`sf-chip ${active === i ? "is-active" : ""}`}
                onClick={() => select(i)}
              >
                {p.symptom}
              </button>
            ))}
          </div>

          <div
            className="sf-panel"
            ref={panelRef}
            role="tabpanel"
            id="sf-panel"
            aria-labelledby={`sf-tab-${active}`}
          >
            <div className="sf-visual" aria-hidden="true">
              <AutoVideo
                src="/media/smoke.mp4"
                poster="/media/smoke-poster.webp"
                className="sf-video"
              />
            </div>
            <div className="sf-body">
              <p className="sf-kicker">האבחון המסתמן</p>
              <h3>{pair.diagnosis}</h3>
              <p className="sf-detail">{pair.detail}</p>
            </div>
            <div className="sf-actions">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                שלחו סרטון של הרעש
              </a>
              <a href={SITE.phoneMobileHref} className="btn btn-ghost">
                {SITE.phoneMobile}
              </a>
            </div>
            <p className="sf-footnote">אבחון סופי נעשה בבדיקה פיזית מתחת לרכב — לא בניחוש.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
