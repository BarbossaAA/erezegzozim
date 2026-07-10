import { SITE } from "@/lib/site";

/** 15. Footer */
export default function Footer() {
  return (
    <footer className="footer" aria-label="פרטי העסק">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <p className="footer-logo">{SITE.name}</p>
          <p className="footer-tag">מערכות פליטה, אגזוזים ואבחון רעשים.</p>
          <p className="footer-tag">{SITE.subline}</p>
        </div>

        <nav className="footer-col" aria-label="שירותים">
          <p className="footer-title">שירותים</p>
          <ul>
            <li>אגזוזים</li>
            <li>דודים</li>
            <li>צינור גמיש</li>
            <li>ריתוך</li>
            <li>נזילות פליטה</li>
            <li>ממירים קטליטיים</li>
            <li>הכנה לטסט</li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="יצירת קשר">
          <p className="footer-title">יצירת קשר</p>
          <ul>
            <li>
              <a href={SITE.phoneMobileHref}>
                נייד: <span dir="ltr">{SITE.phoneMobile}</span>
              </a>
            </li>
            <li>
              <a href={SITE.phoneLandHref}>
                טלפון: <span dir="ltr">{SITE.phoneLand}</span>
              </a>
            </li>
            <li>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
                וואטסאפ — שלחו סרטון של הרעש
              </a>
            </li>
            <li>
              <a href={SITE.wazeHref} target="_blank" rel="noopener noreferrer">
                ניווט: {SITE.address}, {SITE.city}
              </a>
            </li>
            <li>{SITE.hours}</li>
          </ul>
        </nav>

        <div className="footer-col">
          <p className="footer-title">איך אנחנו עובדים</p>
          <ul>
            <li>עבודה בטוחה לכביש</li>
            <li>אבחון לפני החלפה</li>
            <li>אחריות לפי סוג עבודה</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {SITE.name} · {SITE.owner} · {SITE.address}, {SITE.city}
        </p>
      </div>
    </footer>
  );
}
