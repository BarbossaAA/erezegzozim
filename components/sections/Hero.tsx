"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { letterbox } from "@/lib/letterboxBus";
import { setCursorLamp } from "@/components/CinematicChrome";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import ScrubCanvas, { ScrubCanvasHandle } from "@/components/ScrubCanvas";
import { framePaths } from "@/lib/frames";
import { SITE } from "@/lib/site";

const HERO_FRAMES = framePaths("hero");

/** 2. Pinned Hero — garage arrival, scroll-scrubbed frames. */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<ScrubCanvasHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    let lbActive = false;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".hero-copy > *", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=3400",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          // letterbox stays down for the whole pinned scene
          onToggle: (self) => {
            lbActive = self.isActive;
            if (self.isActive) letterbox.enter();
            else letterbox.leave();
          },
          // inspection-lamp cursor only after the hero releases
          onLeave: () => setCursorLamp(true),
          onEnterBack: () => setCursorLamp(false),
        },
      });

      // beats 1–5: the arrival footage scrubs across the first 70% of the pin
      tl.to(
        { p: 0 },
        {
          p: 1,
          duration: 0.7,
          onUpdate() {
            scrubRef.current?.setProgress(this.targets()[0].p as number);
          },
        },
        0
      );

      // parallax drift on atmosphere layers while the shot plays
      gsap.utils.toArray<HTMLElement>("[data-speed]", section).forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.3");
        tl.fromTo(
          el,
          { yPercent: speed * 18 },
          { yPercent: -speed * 18, duration: 1 },
          0
        );
      });

      // beat 6: headline locks into place
      tl.fromTo(
        ".hero-title .word",
        { opacity: 0, y: 60, rotateX: 25 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.14, ease: "power2.out" },
        0.62
      );
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.76
      );
      // beat 7: CTAs appear only after the car has stopped
      tl.fromTo(
        ".hero-ctas",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
        0.85
      );
      tl.to({}, { duration: 0.05 }); // hold
    }, section);

    return () => {
      if (lbActive) letterbox.leave();
      ctx.revert();
    };
  }, []);

  const words = "מערכות פליטה ואגזוזים — באבחון שמקשיב לרכב.".split(" ");

  return (
    <section ref={sectionRef} id="hero" className="hero" aria-label="ארז אגזוזים — פתיח">
      <div className="hero-media">
        <ScrubCanvas
          ref={scrubRef}
          frames={HERO_FRAMES}
          className="hero-canvas"
          eagerCount={8}
          priority
          ariaLabel="רכב נכנס למוסך ארז אגזוזים בלילה"
        />
        <div className="hero-smoke" data-speed="0.12" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-fg" data-speed="0.75" aria-hidden="true" />
      </div>

      <div className="hero-copy container">
        <h2 className="hero-title track-in" aria-label="מערכות פליטה ואגזוזים — באבחון שמקשיב לרכב.">
          {words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="word">{w}</span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <p className="hero-sub">
          איתור נזילות, תיקון רעשים, החלפת דודים, צינורות גמישים, תושבות
          וריתוך מקצועי — פתרונות פליטה חוקיים ובטוחים לכביש, גם לרכבים
          שאין להם חלק מדף.
        </p>
        <div className="hero-ctas">
          <a href="#booking" className="btn btn-primary">
            קבעו בדיקת אגזוז
          </a>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            שלחו סרטון של הרעש
          </a>
        </div>
      </div>
    </section>
  );
}
