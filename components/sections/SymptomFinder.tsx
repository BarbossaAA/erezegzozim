"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";
import { SITE } from "@/lib/site";

const PAIRS: { symptom: string; diagnosis: string; detail: string }[] = [
  {
    symptom: "הרכב לא סוחב",
    diagnosis: "ממיר קטליטי סתום",
    detail: "יכול להיות ממיר קטליטי סתום.",
  },
  {
    symptom: "רעש צורם או לא רגיל",
    diagnosis: "שבר או סדק במערכת הפליטה",
    detail: "כנראה שבר או סדק במערכת הפליטה.",
  },
  {
    symptom: "נכשלתם בטסט על זיהום אוויר?",
    diagnosis: "מקורות אפשריים במערכת הפליטה",
    detail:
      "יכול להיות הרבה סיבות שקשורות למערכת הפליטה. תגיעו לבדיקה ללא עלות ונשמח לבדוק בשבילכם.",
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
      aria-label="מה הבעיה?"
    >
      <div className="container">
        <div className="sf-head">
          <p className="kicker">אבחון מהיר</p>
          <h2 className="h-display">מה הבעיה?</h2>
        </div>

        <div className="sf-stage">
          <div
            className="sf-chips"
            ref={listRef}
            role="tablist"
            aria-label="בעיות נפוצות"
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
              <p className="sf-kicker">סיבה אפשרית</p>
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
            <p className="sf-footnote">
              את האבחון הסופי אנחנו עושים בבדיקה פיזית מתחת לרכב — ללא עלות.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
