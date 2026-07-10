import SmoothScroll from "@/components/SmoothScroll";
import CinematicChrome from "@/components/CinematicChrome";
import StickyBar from "@/components/StickyBar";
import Header from "@/components/Header";
import ColdOpen from "@/components/sections/ColdOpen";
import Hero from "@/components/sections/Hero";
import Underbody from "@/components/sections/Underbody";
import ExhaustRoute from "@/components/sections/ExhaustRoute";
import FaultReveal from "@/components/sections/FaultReveal";
import Symptoms from "@/components/sections/Symptoms";
import Services from "@/components/sections/Services";
import Exploded from "@/components/sections/Exploded";
import Craft from "@/components/sections/Craft";
import SoundControl from "@/components/sections/SoundControl";
import Trust from "@/components/sections/Trust";
import Cases from "@/components/sections/Cases";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Footer from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <CinematicChrome />
      <Header />
      <main id="main">
        <ColdOpen />
        <Hero />
        <Underbody />
        <ExhaustRoute />
        <FaultReveal />
        <Symptoms />
        <Services />
        <Exploded />
        <Craft />
        <SoundControl />
        <Trust />
        <Cases />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </>
  );
}
