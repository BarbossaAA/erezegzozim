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
    "אבחון רעשים, תיקון והחלפת אגזוזים, דודים, צינורות גמישים, נזילות פליטה, ממירים קטליטיים, ריתוך אגזוז והכנה לטסט. ארז אגזוזים — משה בקר 18, ראשון לציון.",
  keywords: [
    "אגזוזים",
    "מערכת פליטה",
    "תיקון אגזוז",
    "החלפת אגזוז",
    "דוד אחורי",
    "צינור גמיש לרכב",
    "נזילת פליטה",
    "ריתוך אגזוז",
    "רעש מהאגזוז",
    "הכנה לטסט",
    "ממיר קטליטי",
    "זיהום אוויר לרכב",
  ],
  openGraph: {
    title: "ארז אגזוזים | מערכות פליטה, אגזוזים ואבחון רעשים",
    description:
      "לא מנחשים. עוקבים אחרי כל מסלול הפליטה. אבחון, תיקון, ריתוך והכנה לטסט — באזור המרכז.",
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
      "אבחון רעשים, תיקון והחלפת אגזוזים, נזילות פליטה והכנה לטסט — באזור המרכז.",
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
