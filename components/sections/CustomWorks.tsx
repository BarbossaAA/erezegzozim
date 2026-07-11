"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import AutoVideo from "@/components/AutoVideo";

const WORKS = [
  {
    img: "/media/still-classic.webp",
    title: "נאמן למקור",
    desc: "רכבים שיצאו מהייצור לפני עשורים — המערכת משוחזרת לפי המסלול והצליל המקוריים.",
    alt: "מכונית אספנות קלאסית על הליפט במוסך, מערכת פליטה בנויה בעבודת יד",
  },
  {
    img: "/media/still-4x4.webp",
    title: "בנוי לשטח",
    desc: "מסלול צנרת עם מרווח גחון, זוויות נכונות ותושבות שמחזיקות גם אחרי המהמורה המאה.",
    alt: "רכב שטח מוגבה על הליפט, מסלול אגזוז מותאם לאורך השלדה",
  },
  {
    img: "/media/still-bench.webp",
    title: "מהשרטוט למתכת",
    desc: "כיפוף, התאמה וריתוך של צנרת למידה — כל קשת נמדדת לרכב אחד בלבד.",
    alt: "שולחן עבודה עם צינורות מכופפים, שרטוט טכני וכלי מדידה",
  },
];

/** Custom builds — the work you don't see in every garage. Understated on purpose. */
export default function CustomWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cw-copy",
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );
      gsap.fromTo(
        ".cw-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.14,
          duration: 0.9,
          scrollTrigger: { trigger: ".cw-grid", start: "top 82%" },
        }
      );
      // thin measure-line draws across the section
      const line = section.querySelector<SVGPathElement>(".cw-measure path");
      if (line) {
        const len = line.getTotalLength();
        gsap.fromTo(
          line,
          { strokeDasharray: len, strokeDashoffset: len },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              end: "center 40%",
              scrub: 0.8,
            },
          }
        );
      }
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="custom-works section"
      aria-label="עבודות בהתאמה אישית"
    >
      <div className="cw-media" aria-hidden="true">
        <AutoVideo
          src="/media/build.mp4"
          poster="/media/build-poster.webp"
          className="cw-video"
        />
        <div className="cw-overlay" />
      </div>

      <svg
        className="cw-measure"
        viewBox="0 0 1200 60"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M 1200 30 L 0 30"
          fill="none"
          stroke="rgba(227,154,59,0.35)"
          strokeWidth="1"
          strokeDasharray="1 0"
        />
      </svg>

      <div className="container">
        <div className="cw-copy">
          <p className="kicker">כשאין חלק מדף</p>
          <h2 className="h-display">יש מערכות שצריך פשוט לבנות.</h2>
          <p className="h-sub">
            רוב הרכבים מקבלים פתרון מהיר. חלקם מבקשים משהו אחר — צנרת שמכופפים
            למידה, מסלול שמותווה מחדש, צליל שמשחזרים בקשב. זו עבודה איטית יותר,
            ואנחנו אוהבים אותה.
          </p>
        </div>

        <ul className="cw-grid">
          {WORKS.map((w) => (
            <li key={w.title} className="cw-card">
              <img src={w.img} alt={w.alt} loading="lazy" />
              <div className="cw-card-body">
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
