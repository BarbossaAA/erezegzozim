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
    desc: "כשמדובר ברכב שירד מפס הייצור לפני עשרות שנים, אנחנו משחזרים את המערכת לפי המסלול והצליל המקוריים.",
    alt: "מכונית אספנות קלאסית על הליפט במוסך, מערכת פליטה בנויה בעבודת יד",
  },
  {
    img: "/media/still-4x4.webp",
    title: "בנוי לשטח",
    desc: "לרכבי שטח מוגבהים אנחנו בונים מסלול צנרת עם מרווח גחון מלא ותושבות מחוזקות שמחזיקות גם בשטח קשה.",
    alt: "רכב שטח מוגבה על הליפט, מסלול אגזוז מותאם לאורך השלדה",
  },
  {
    img: "/media/still-bench.webp",
    title: "מהשרטוט למתכת",
    desc: "כל עבודה מתחילה במדידה ובשרטוט, וממשיכה בכיפוף ובריתוך מדויקים — עד שהמערכת יושבת ברכב כאילו יוצרה עבורו במפעל.",
    alt: "שולחן עבודה עם צינורות מכופפים, שרטוט טכני וכלי מדידה",
  },
];

type Props = {
  kicker?: string;
  title?: string;
  sub?: string;
  video?: string;
  poster?: string;
  /** hide the "לעבודות המיוחדות" link (e.g. when rendered on /custom itself) */
  showLink?: boolean;
};

/** Custom-works band. Defaults fit the home page; /custom passes its own copy. */
export default function SpecialBand({
  kicker = "כשאין חלק מדף",
  title = "יש מערכות שצריך פשוט לבנות.",
  sub = "לרכבי אספנות, לרכבי שטח ולרכבים מיוחדים לא תמיד יש פתרון מדף. במקרים כאלה אנחנו בונים את המערכת בעצמנו — מכופפים את הצנרת לפי מידה, מתאימים את המסלול לרכב ושומרים על הצליל שלו.",
  video = "/media/build.mp4",
  poster = "/media/build-poster.webp",
  showLink = true,
}: Props) {
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
        <AutoVideo src={video} poster={poster} className="sb-video" />
        <div className="sb-overlay" />
      </div>

      <div className="container">
        <div className="sb-copy">
          <p className="kicker">{kicker}</p>
          <h2 className="h-display">{title}</h2>
          <p className="h-sub">{sub}</p>
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

        {showLink && (
          <div className="sb-more">
            <Link href="/custom" className="btn btn-ghost">
              לעבודות המיוחדות ←
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
