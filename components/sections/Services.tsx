"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const SERVICES: { title: string; desc: string; texture?: string }[] = [
  {
    title: "איתור דליפות פליטה",
    desc: "בדיקה יסודית של החיבורים, הצנרת, הריתוכים והדודים עד שמוצאים את מקור הדליפה.",
    texture: "/media/still-catalytic.webp",
  },
  {
    title: "תיקון והחלפת אגזוזים",
    desc: "טיפול ברעש חריג, בחיבורים רופפים ובאגזוזים פגומים.",
    texture: "/media/still-muffler.webp",
  },
  {
    title: "דוד אחורי / דוד מרכזי",
    desc: "החלפת דודים והתאמתם לסוג הרכב ולרמת הרעש הרצויה.",
    texture: "/media/still-muffler.webp",
  },
  {
    title: "צינור גמיש לרכב",
    desc: "טיפול ברעידות, דליפות ורעשי פליטה מאזור החיבור הגמיש.",
    texture: "/media/still-flex.webp",
  },
  {
    title: "ריתוך מערכת פליטה",
    desc: "ריתוך נקי ומדויק לחיזוק המערכת, לאטימה ולהתאמות.",
    texture: "/media/still-weld.webp",
  },
  {
    title: "בדיקת ממיר קטליטי",
    desc: "בדיקת תקינות הממיר וזרימת הגזים, ואיתור תקלות שמעלות את ערכי הפליטה.",
    texture: "/media/still-catalytic.webp",
  },
  {
    title: "פתרונות זיהום אוויר",
    desc: "איתור וטיפול בגורמים לערכי פליטה חריגים במערכת הפליטה של הרכב.",
    texture: "/media/still-lamp.webp",
  },
  {
    title: "פתרונות רעש ורעידות",
    desc: "איתור מקור הרעש והתאמת פתרון נקודתי.",
    texture: "/media/still-flex.webp",
  },
  {
    title: "התאמות פליטה חוקיות",
    desc: "פתרונות בטוחים לכביש, בלי לפגוע בתקינות הרכב.",
    texture: "/media/still-hands.webp",
  },
  {
    title: "מערכות בהתאמה אישית",
    desc: "כשאין חלק חילופי, אנחנו בונים אותו: כיפוף צנרת, התאמה וריתוך לפי מידות הרכב.",
    texture: "/media/still-bench.webp",
  },
  {
    title: "אספנות, שטח ורכבים מיוחדים",
    desc: "שחזור המערכת המקורית או בניית מסלול חדש, בהתאם לרכב ולשימוש שלו.",
    texture: "/media/still-4x4.webp",
  },
];

/** 7. Services — 10 cards over the macro fly-through atmosphere. */
export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-head",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: { trigger: section, start: "top 72%" },
        }
      );
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: (i % 3) * 0.08,
            scrollTrigger: { trigger: card, start: "top 88%" },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="services section"
      aria-label="שירותי המוסך"
    >
      <div className="services-atmo" aria-hidden="true">
        <AutoVideo
          src="/media/macro.mp4"
          poster="/media/macro-poster.webp"
          className="services-video"
        />
        <div className="services-overlay" />
      </div>

      <div className="container">
        <div className="services-head">
          <p className="kicker">שירותים</p>
          <h2 className="h-display">כל מה שמערכת הפליטה צריכה — במקום אחד.</h2>
        </div>

        <ul className="services-grid">
          {SERVICES.map((s) => (
            <li key={s.title} className="service-card">
              <span className="service-connector" aria-hidden="true" />
              {s.texture && (
                <span
                  className="service-texture"
                  style={{ backgroundImage: `url(${s.texture})` }}
                  aria-hidden="true"
                />
              )}
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
