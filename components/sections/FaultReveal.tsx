"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const FAULTS: { label: string; note: string }[] = [
  { label: "נזילה בצינור גמיש", note: "העשן בורח מחיבור הגמיש — נקודת הכשל הנפוצה ביותר." },
  { label: "תושבת שבורה", note: "המערכת נשענת על נקודה אחת פחות — ומתחילה לדפוק." },
  { label: "דוד פגום", note: "שינוי בצליל: עמוק, גס או מרשרש — סימן לדוד שנפתח מבפנים." },
  { label: "חיבור לא אטום", note: "אטם שהתעייף או אוגן עקום משחררים לחץ במקום הלא נכון." },
  { label: "ריתוך שנפתח", note: "תפר ישן שנסדק — מזהים לפי פס פיח דק לאורך התפר." },
  { label: "צנרת חלודה", note: "חלודה עובדת מבפנים החוצה. כשרואים אותה — היא כבר עמוקה." },
  { label: "ריח גזים", note: "גזים שנכנסים לתא הנוסעים מחייבים בדיקה מיידית." },
  { label: "רעידות מתחת לרכב", note: "רעידה בסרק מספרת על תלייה או גמיש שאיבדו גמישות." },
];

/** 5. Fault Detection — smoke reveal footage + lamp-reveal fault cards. */
export default function FaultReveal() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fault-copy",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".fault-card",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.07,
          duration: 0.9,
          scrollTrigger: { trigger: ".fault-grid", start: "top 80%" },
        }
      );
      // the leak point breathes
      gsap.to(".fault-leak", {
        scale: 1.35,
        opacity: 0.25,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="fault section"
      aria-label="איתור תקלות במערכת הפליטה"
    >
      <div className="fault-media" aria-hidden="true">
        <AutoVideo
          src="/media/smoke.mp4"
          poster="/media/smoke-poster.webp"
          className="fault-video"
        />
        <span className="fault-leak" />
        <div className="fault-overlay" />
      </div>

      <div className="container">
        <div className="fault-copy">
          <p className="kicker">אבחון עשן</p>
          <h2 className="h-display">רעש הוא סימפטום. העבודה היא למצוא את המקור.</h2>
          <p className="h-sub">
            מזרימים עשן אבחון במערכת סגורה — והנזילה מסגירה את עצמה. בלי ניחושים,
            בלי החלפות מיותרות.
          </p>
        </div>

        <ul className="fault-grid" aria-label="תקלות נפוצות">
          {FAULTS.map((f) => (
            <li key={f.label} className="fault-card">
              <span className="fault-label">{f.label}</span>
              <span className="fault-note">{f.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
