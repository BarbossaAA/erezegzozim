import type { Metadata, Viewport } from "next";
import { Heebo, Suez_One } from "next/font/google";
import "./globals.css";
import "./sections.css";
import { SITE, SITE_URL } from "@/lib/site";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const suez = Suez_One({
  subsets: ["hebrew", "latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  title: "ארז אגזוזים | אגזוזים ומערכות פליטה לרכב בראשון לציון",
  description:
    "אבחון רעשים, תיקון והחלפת אגזוזים, דודים, צינורות גמישים, דליפות פליטה, ממירים קטליטיים, ריתוך ופתרונות זיהום אוויר לרכב — וגם מערכות פליטה בהתאמה אישית לרכבי אספנות, שטח ורכבים מיוחדים. 40 שנה ניסיון, בדיקה ללא עלות. ארז אגזוזים — משה בקר 18, ראשון לציון.",
  keywords: [
    "אגזוזים",
    "מערכת פליטה",
    "תיקון אגזוז",
    "החלפת אגזוז",
    "דוד אחורי",
    "צינור גמיש לרכב",
    "דליפת פליטה",
    "ריתוך אגזוז",
    "רעש מהאגזוז",
    "ממיר קטליטי",
    "זיהום אוויר לרכב",
    "מערכת פליטה בהתאמה אישית",
    "אגזוז לרכב אספנות",
    "אגזוז לרכב שטח",
    "כיפוף צנרת אגזוז",
  ],
  openGraph: {
    title: "ארז אגזוזים | מערכות פליטה, אגזוזים ואבחון רעשים",
    description:
      "אבחון מדויק ותיקון מקצועי של מערכות פליטה: איתור רעשים ודליפות, ריתוך, החלפת דודים ופתרונות זיהום אוויר — בראשון לציון.",
    locale: "he_IL",
    type: "website",
    url: "/",
    images: [
      {
        url: "/media/facade-night.webp",
        width: 1920,
        height: 1072,
        alt: "מוסך ארז אגזוזים בלילה",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ארז אגזוזים | מערכות פליטה, אגזוזים ואבחון רעשים",
    description:
      "אבחון רעשים, תיקון והחלפת אגזוזים, דליפות פליטה ופתרונות זיהום אוויר — באזור המרכז.",
    images: ["/media/facade-night.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#070708",
  width: "device-width",
  initialScale: 1,
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoRepair",
  name: SITE.name,
  description: SITE.tagline,
  url: SITE_URL,
  image: [`${SITE_URL}/media/real-facade.webp`, `${SITE_URL}/media/facade-night.webp`],
  telephone: "+972-54-5955580",
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address,
    addressLocality: SITE.city,
    addressCountry: "IL",
  },
  areaServed: SITE.area,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Friday",
      opens: "08:00",
      closes: "13:00",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${suez.variable}`}>
      <body>
        {/* without JS, reveal everything the entrance animations would */}
        <noscript>
          <style>{`
            .hv-kicker, .hv-title .word, .hv-sub, .hv-ctas, .hv-chips, .hv-hint,
            .rs-node, .sf-head, .sf-chips, .sf-panel, .sb-copy, .sb-card,
            .tc-head, .tc-photos, .tc-chip, .tc-case, .cw-copy, .cw-card,
            .mb-visual, .mb-copy, .cs-copy, .cs-step, .cs-visual,
            .sc-head, .sc-case, .services-head, .service-card, .rs-copy,
            .cta-inner > * { opacity: 1 !important; transform: none !important; }
            .hv-bar { display: none !important; }
            .sticky-bar { opacity: 1 !important; visibility: visible !important; translate: 0 0 !important; }
            .faq-a { grid-template-rows: 1fr !important; }
          `}</style>
        </noscript>
        <a href="#main" className="skip-link">
          דילוג לתוכן הראשי
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </body>
    </html>
  );
}
