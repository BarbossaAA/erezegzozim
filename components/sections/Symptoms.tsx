"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

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
    symptom: "ריח גזים בתא הנוסעים",
    diagnosis: "נזילת פליטה",
    detail: "נזילה לפני תא הנוסעים מוצאת דרך פנימה. זו תקלה שמטפלים בה מיד.",
  },
  {
    symptom: "דפיקה מתחת לרכב",
    diagnosis: "התקנה לא מיושרת",
    detail: "מערכת שלא יושרה נכון נוגעת בנקודות מגע — ודופקת בכל מהמורה.",
  },
  {
    symptom: "שריקה בזמן נסיעה",
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
    symptom: "אגזוז נמוך או נוגע ברצפה",
    diagnosis: "צנרת חלודה",
    detail: "חלודה מחלישה נקודות עיגון, המערכת שוקעת — ומתחילה לגרד את הכביש.",
  },
];

/** 6. Symptoms → Diagnosis — interactive two-column panel with SVG connector. */
export default function Symptoms() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const drawConnector = useCallback((index: number) => {
    const stage = stageRef.current;
    const line = lineRef.current;
    const list = listRef.current;
    const panel = panelRef.current;
    if (!stage || !line || !list || !panel) return;
    const card = list.querySelectorAll<HTMLElement>(".sym-card")[index];
    if (!card) return;

    const s = stage.getBoundingClientRect();
    const c = card.getBoundingClientRect();
    const p = panel.getBoundingClientRect();

    // from card's left edge (RTL) to panel's right edge
    const x1 = c.left - s.left;
    const y1 = c.top - s.top + c.height / 2;
    const x2 = p.right - s.left;
    const y2 = p.top - s.top + p.height / 2;
    const mx = (x1 + x2) / 2;
    line.setAttribute("d", `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);

    if (!prefersReducedMotion()) {
      const len = line.getTotalLength();
      gsap.fromTo(
        line,
        { strokeDasharray: len, strokeDashoffset: len, opacity: 1 },
        { strokeDashoffset: 0, duration: 0.7, ease: "power2.out", overwrite: "auto" }
      );
    } else {
      line.style.opacity = "1";
    }
  }, []);

  const select = (i: number) => {
    setActive(i);
    if (!prefersReducedMotion() && panelRef.current) {
      gsap.fromTo(
        panelRef.current.querySelector(".diag-body"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  // WAI-ARIA tabs keyboard model: arrows/Home/End move focus + selection
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
    listRef.current
      ?.querySelectorAll<HTMLButtonElement>(".sym-card")
      [next]?.focus();
  };

  useEffect(() => {
    drawConnector(active);
    const onResize = () => drawConnector(active);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [active, drawConnector]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sym-card",
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          stagger: 0.06,
          duration: 0.8,
          scrollTrigger: { trigger: section, start: "top 70%" },
          onComplete: () => drawConnector(0),
        }
      );
      gsap.fromTo(
        ".diag-panel",
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.9,
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, [drawConnector]);

  const pair = PAIRS[active];

  return (
    <section
      ref={sectionRef}
      className="symptoms section"
      aria-label="מהסימפטום לאבחון"
    >
      <div className="container">
        <p className="kicker">סימפטום ← אבחון</p>
        <h2 className="h-display">ספרו לנו מה אתם שומעים. אנחנו נבדוק איפה זה מתחיל.</h2>

        <div className="sym-stage" ref={stageRef}>
          <svg className="sym-connector" aria-hidden="true" focusable="false">
            <path ref={lineRef} className="sym-line" />
          </svg>

          <div
            className="sym-list"
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
                aria-controls="diag-panel"
                id={`sym-tab-${i}`}
                tabIndex={active === i ? 0 : -1}
                className={`sym-card ${active === i ? "is-active" : ""}`}
                onClick={() => select(i)}
              >
                <span className="sym-wave" aria-hidden="true" />
                {p.symptom}
              </button>
            ))}
          </div>

          <div
            className="diag-panel"
            ref={panelRef}
            role="tabpanel"
            id="diag-panel"
            aria-labelledby={`sym-tab-${active}`}
          >
            <p className="diag-kicker">האבחון המסתמן</p>
            <div className="diag-body">
              <h3 className="diag-title">{pair.diagnosis}</h3>
              <p className="diag-detail">{pair.detail}</p>
            </div>
            <p className="diag-footnote">
              אבחון סופי נעשה בבדיקה פיזית מתחת לרכב — לא בניחוש.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
