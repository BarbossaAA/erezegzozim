"use client";

import { useRef, useState } from "react";

const FAQ = [
  {
    q: "איך יודעים שיש נזילה באגזוז?",
    a: "סימנים נפוצים הם רעש חזק מהרגיל, ריח גזים, שריקה, רעידות או שינוי בתחושת הנסיעה. בדיקה מתחת לרכב תזהה את המקור.",
  },
  {
    q: "חייבים להחליף את כל האגזוז?",
    a: "לא תמיד. לפעמים אפשר לתקן חלק נקודתי כמו צינור גמיש, תושבת, חיבור או ריתוך. לכן מתחילים באבחון.",
  },
  {
    q: "אפשר לשלוח סרטון של הרעש?",
    a: "כן. סרטון עוזר להבין את הסימפטום הראשוני, אבל אבחון סופי נעשה בבדיקה פיזית של הרכב.",
  },
  {
    q: "אתם עושים הכנה לטסט?",
    a: "כן. ניתן לבדוק רעש, נזילות, יציבות מערכת הפליטה ומצב כללי לפני הטסט.",
  },
  {
    q: "אפשר לעשות אגזוז ספורט?",
    a: "ניתן לבדוק התאמות חוקיות ובטוחות בלבד, בהתאם לרכב ולדרישות הכביש.",
  },
  {
    q: "יש פתרון לרכב ישן שאין לו חלקים?",
    a: "כן. כשאין חלק מדף — בונים: מכופפים צנרת למידה, משחזרים את המסלול המקורי ושומרים על הצליל ועל אופי הרכב, בגבולות החוק.",
  },
  {
    q: "רכב שטח מוגבה — מה עושים עם האגזוז?",
    a: "מתאימים את המסלול להגבהה: מרווח גחון, זוויות מעבר ותושבות שמחזיקות עומסי שטח — בלי לפגוע בחוקיות ובטסט.",
  },
];

/** 13. FAQ — accessible accordion, readability first. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="faq section" aria-label="שאלות נפוצות">
      <div className="container faq-container">
        <p className="kicker">שאלות נפוצות</p>
        <h2 className="h-display">שאלות נפוצות על אגזוזים ומערכות פליטה</h2>

        <div className="faq-list">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? "is-open" : ""}`}>
                <h3>
                  <button
                    className="faq-q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-btn-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-plus" aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  className="faq-a"
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  style={{
                    maxHeight: isOpen
                      ? `${refs.current[i]?.scrollHeight ?? 400}px`
                      : "0px",
                  }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
