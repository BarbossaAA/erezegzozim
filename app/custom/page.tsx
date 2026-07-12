import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import CinematicChrome from "@/components/CinematicChrome";
import Header from "@/components/Header";
import StickyBar from "@/components/StickyBar";
import HeroVideo from "@/components/HeroVideo";
import SpecialBand from "@/components/sections/SpecialBand";
import MediaBand from "@/components/sections/MediaBand";
import CraftSteps from "@/components/sections/CraftSteps";
import SpecialCases from "@/components/sections/SpecialCases";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "עבודות מיוחדות | ארז אגזוזים — מערכות פליטה בהתאמה אישית",
  description:
    "מערכות פליטה בבנייה אישית לרכבי אספנות, רכבי שטח ורכבים מיוחדים: כיפוף צנרת לפי מידה, שחזור מסלול מקורי, ריתוך והתאמה — חוקי ובטוח לכביש. ארז אגזוזים, ראשון לציון.",
  alternates: { canonical: "/custom" },
  openGraph: {
    title: "עבודות מיוחדות | ארז אגזוזים",
    description:
      "כשאין חלק מדף — בונים אותו: מערכות פליטה בהתאמה אישית לרכבי אספנות, שטח ורכבים מיוחדים.",
    locale: "he_IL",
    type: "website",
    url: "/custom",
    images: [
      {
        url: "/media/still-classic.webp",
        width: 1600,
        height: 896,
        alt: "רכב אספנות על הליפט במוסך ארז אגזוזים",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "עבודות מיוחדות | ארז אגזוזים",
    description:
      "מערכות פליטה בהתאמה אישית לרכבי אספנות, שטח ורכבים מיוחדים — כיפוף, ריתוך ובנייה לפי מידה.",
    images: ["/media/still-classic.webp"],
  },
};

export default function CustomPage() {
  return (
    <>
      {/* LCP poster for this page — React hoists the link into <head> */}
      <link
        rel="preload"
        as="image"
        href="/media/build-poster.webp"
        fetchPriority="high"
      />
      <SmoothScroll />
      <CinematicChrome />
      <Header />
      <main id="main">
        <HeroVideo
          video="/media/build.mp4"
          poster="/media/build-poster.webp"
          kicker="עבודות מיוחדות"
          title="את המערכות האלה לא קונים — בונים אותן."
          sub="מדידה על הרכב, כיפוף צנרת וריתוך בעבודת יד, עד שהמערכת יושבת כאילו יצאה מהמפעל. זו עבודה איטית יותר, ואנחנו אוהבים אותה."
          primary={{ href: "#booking", label: "דברו איתנו על הרכב" }}
          tall={false}
        />
        <SpecialBand
          kicker="מהעבודות שלנו"
          title="ככה זה נראה בפועל."
          sub="שלושה סוגי עבודות שחוזרים אצלנו שוב ושוב — לכל אחת הדרישות שלה."
          video="/media/macro.mp4"
          poster="/media/macro-poster.webp"
          showLink={false}
        />
        <MediaBand
          video="/media/orbit.mp4"
          poster="/media/orbit-poster.webp"
          kicker="ההיכרות עם השלדה"
          title="כל עבודה מתחילה מתחת לרכב."
          sub="לפני שמכופפים צינור אחד, אנחנו עוברים על המסלול כולו — נקודות העיגון, המרווחים וזוויות המעבר — כדי להבין מה הרכב באמת צריך."
        />
        <MediaBand
          video="/media/exploded.mp4"
          poster="/media/exploded-poster.webp"
          kicker="הנדסת פליטה"
          title="המערכת נראית פשוטה. העבודה פחות."
          sub="כל חיבור, כל זווית וכל תושבת משפיעים על הרעש, על האטימות ועל יציבות המערכת לאורך זמן."
          chips={["צנרת", "חיבורים", "אטימה", "דודים", "תושבות", "ממיר", "זרימה", "רמת רעש"]}
          flip
        />
        <CraftSteps />
        <SpecialCases />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
