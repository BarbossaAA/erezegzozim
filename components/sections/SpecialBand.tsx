"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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

/** Custom-works teaser band on the home page; links to the full page. */
export default function SpecialBand() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sb-copy",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          scrollTrigger: { trigger: section, start: "top 72%" },
        }
      );
      gsap.fromTo(
        ".sb-card",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.8,
          scrollTrigger: { trigger: ".sb-grid", start: "top 84%" },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sb section-tight"
      aria-label="עבודות בהתאמה אישית"
    >
      <div className="sb-media" aria-hidden="true">
        <AutoVideo
          src="/media/build.mp4"
          poster="/media/build-poster.webp"
          className="sb-video"
        />
        <div className="sb-overlay" />
      </div>

      <div className="container">
        <div className="sb-copy">
          <p className="kicker">כשאין חלק מדף</p>
          <h2 className="h-display">יש מערכות שצריך פשוט לבנות.</h2>
          <p className="h-sub">
            אספנות, שטח ורכבים מיוחדים — צנרת שמכופפים למידה, מסלול שמותווה
            מחדש, צליל שמשחזרים בקשב.
          </p>
        </div>

        <ul className="sb-grid">
          {WORKS.map((w) => (
            <li key={w.title} className="sb-card">
              <img src={w.img} alt={w.alt} loading="lazy" />
              <div className="sb-card-body">
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="sb-more">
          <Link href="/custom" className="btn btn-ghost">
            לעבודות המיוחדות ←
          </Link>
        </div>
      </div>
    </section>
  );
}
