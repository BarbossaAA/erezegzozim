"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const SERVICES: { title: string; desc: string; texture?: string }[] = [
  {
    title: "איתור נזילות פליטה",
    desc: "בדיקה של חיבורים, צנרת, ריתוכים, דודים וצינור גמיש.",
    texture: "/media/still-catalytic.webp",
  },
  {
    title: "תיקון והחלפת אגזוזים",
    desc: "פתרון לרעש חריג, חלודה, חיבורים רופפים ואגזוזים פגומים.",
    texture: "/media/still-muffler.webp",
  },
  {
    title: "דוד אחורי / דוד מרכזי",
    desc: "החלפה והתאמה לפי סוג הרכב, רמת הרעש והצורך.",
    texture: "/media/still-muffler.webp",
  },
  {
    title: "צינור גמיש לרכב",
    desc: "טיפול ברעידות, נזילות ורעשי פליטה מאזור החיבור הגמיש.",
    texture: "/media/still-flex.webp",
  },
  {
    title: "ריתוך מערכת פליטה",
    desc: "ריתוך נקי ומדויק לחיזוק, אטימה והתאמה.",
    texture: "/media/still-weld.webp",
  },
  {
    title: "תושבות ומתלי אגזוז",
    desc: "ייצוב המערכת ומניעת דפיקות, רעידות ושחיקה חוזרת.",
    texture: "/media/still-hands.webp",
  },
  {
    title: "בדיקת ממיר קטליטי",
    desc: "אבחון תקינות, זרימה, רעשים ותקלות הקשורות לפליטה.",
    texture: "/media/still-catalytic.webp",
  },
  {
    title: "הכנה לטסט",
    desc: "בדיקת רעש, אטימה ומצב מערכת הפליטה לפני בדיקה.",
    texture: "/media/still-lamp.webp",
  },
  {
    title: "פתרונות רעש וויברציה",
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
    desc: "כיפוף, התאמה וריתוך של צנרת למידה — כשאין חלק מדף.",
    texture: "/media/still-bench.webp",
  },
  {
    title: "אספנות, שטח ורכבים מיוחדים",
    desc: "שחזור מסלול מקורי או התוויית מסלול חדש, לפי הרכב והייעוד.",
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
