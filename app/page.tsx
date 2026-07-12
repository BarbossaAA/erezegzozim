import SmoothScroll from "@/components/SmoothScroll";
import CinematicChrome from "@/components/CinematicChrome";
import Header from "@/components/Header";
import StickyBar from "@/components/StickyBar";
import HeroVideo from "@/components/HeroVideo";
import SymptomFinder from "@/components/sections/SymptomFinder";
import Services from "@/components/sections/Services";
import SpecialBand from "@/components/sections/SpecialBand";
import RouteStrip from "@/components/sections/RouteStrip";
import TrustCases from "@/components/sections/TrustCases";
import SoundControl from "@/components/sections/SoundControl";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";
import { SITE } from "@/lib/site";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <CinematicChrome />
      <Header />
      <main id="main">
        <HeroVideo
          video="/media/hero.mp4"
          poster="/media/hero-poster.webp"
          title="מערכות פליטה ואגזוזים, מהאבחון ועד הפתרון."
          sub="אנחנו מאתרים נזילות, מטפלים ברעשים ומחליפים דודים, צינורות גמישים ותושבות — הכול במקצועיות ובהתאם לדרישות החוק. וכשאין חלק מדף לרכב שלכם, אנחנו יודעים לבנות אותו."
          primary={{ href: "#booking", label: "קבעו בדיקת אגזוז" }}
          secondary={{
            href: SITE.whatsappHref,
            label: "שלחו סרטון של הרעש",
            external: true,
          }}
          chips={[
            `${SITE.address}, ${SITE.city}`,
            SITE.hours,
            "מענה מהיר בוואטסאפ",
          ]}
        />
        <SymptomFinder />
        <Services />
        <SpecialBand />
        <RouteStrip />
        <TrustCases />
        <SoundControl />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
