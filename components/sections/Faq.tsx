"use client";

import { useState } from "react";

const FAQ = [
  {
    q: "איך יודעים שיש דליפה באגזוז?",
    a: "סימנים נפוצים הם רעש חזק מהרגיל, ריח גזים, רעידות או שינוי בתחושת הנסיעה. בדיקה מתחת לרכב תזהה את המקור.",
  },
  {
    q: "חייבים להחליף את כל האגזוז?",
    a: "לא תמיד. לפעמים אפשר לתקן חלק נקודתי כמו צינור גמיש, חיבור או ריתוך. לכן מתחילים באבחון.",
  },
  {
    q: "אפשר לשלוח סרטון של הרעש?",
    a: "כן. סרטון עוזר להבין את הבעיה הראשונית, אבל אבחון סופי נעשה בבדיקה פיזית של הרכב.",
  },
  {
    q: "כמה עולה הבדיקה?",
    a: "הבדיקה אצלנו היא ללא עלות. תגיעו למוסך, נעלה את הרכב, נבדוק את המערכת ונסביר לכם בדיוק מה מצאנו.",
  },
  {
    q: "אפשר לעשות אגזוז ספורט?",
    a: "כן, כל עוד ההתאמה חוקית ובטוחה. אנחנו בונים את הפתרון לפי הרכב, בהתאם לתקנות התעבורה.",
  },
  {
    q: "יש פתרון לרכב ישן שאין לו חלקים?",
    a: "כן. כשאין חלק חילופי, אנחנו בונים את המערכת בעצמנו: מכופפים צנרת לפי מידה, משחזרים את המסלול המקורי ושומרים על אופי הרכב.",
  },
  {
    q: "רכב שטח מוגבה — מה עושים עם האגזוז?",
    a: "אנחנו מתאימים את מסלול הצנרת להגבהה, עם מרווח גחון מלא וזוויות מעבר נכונות — כך שהרכב יעמוד בעומסי שטח.",
  },
];

/**
 * Accessible accordion. Expansion animates via the CSS grid 0fr→1fr
 * pattern, so answers never clip after resize/rotation/zoom — no JS
 * measurement involved.
 */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

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
                >
                  <div className="faq-a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
