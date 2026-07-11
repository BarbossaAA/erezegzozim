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
    "מערכות פליטה בבנייה אישית לרכבי אספנות, רכבי שטח ורכבים מיוחדים: כיפוף צנרת למידה, שחזור מסלול מקורי, ריתוך והתאמה — חוקי ובטוח לכביש. ארז אגזוזים, ראשון לציון.",
  alternates: { canonical: "/custom" },
};

export default function CustomPage() {
  return (
    <>
      <SmoothScroll />
      <CinematicChrome />
      <Header />
      <main id="main">
        <HeroVideo
          video="/media/build.mp4"
          poster="/media/build-poster.webp"
          kicker="כשאין חלק מדף"
          title="יש מערכות שצריך פשוט לבנות."
          sub="אספנות, שטח ורכבים מיוחדים — צנרת שמכופפים למידה, מסלול שמותווה מחדש, צליל שמשחזרים בקשב. זו עבודה איטית יותר, ואנחנו אוהבים אותה."
          primary={{ href: "/#booking", label: "דברו איתנו על הרכב" }}
          tall={false}
        />
        <SpecialBand />
        <MediaBand
          video="/media/orbit.mp4"
          poster="/media/orbit-poster.webp"
          kicker="ההיכרות עם השלדה"
          title="כל עבודה מתחילה מתחת לרכב."
          sub="לפני שמכופפים צינור אחד, עוברים על המסלול כולו: נקודות עיגון, מרווחים, זוויות מעבר — ומה הרכב הזה בכלל מבקש."
        />
        <MediaBand
          video="/media/exploded.mp4"
          poster="/media/exploded-poster.webp"
          kicker="הנדסת פליטה"
          title="המערכת נראית פשוטה. העבודה לא."
          sub="כל חיבור, זווית, אטימה ותושבת משפיעים על רעש, ריח, לחץ ויציבות."
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
