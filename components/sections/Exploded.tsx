"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { letterbox } from "@/lib/letterboxBus";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import ScrubCanvas, { ScrubCanvasHandle } from "@/components/ScrubCanvas";
import { framePaths } from "@/lib/frames";

const EXPLODED_FRAMES = framePaths("exploded");

const CALLOUTS = [
  "צנרת",
  "חיבורים",
  "אטימה",
  "דודים",
  "תושבות",
  "ממיר",
  "זרימה",
  "רמת רעש",
];

/** 8. Exploded Engineering View — scrubbed assembly + spec callouts. */
export default function Exploded() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<ScrubCanvasHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    let lbActive = false;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".xp-copy, .xp-callout", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2600",
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          onToggle: (self) => {
            lbActive = self.isActive;
            if (self.isActive) letterbox.enter();
            else letterbox.leave();
          },
        },
      });

      tl.to(
        { p: 0 },
        {
          p: 1,
          duration: 1,
          onUpdate() {
            scrubRef.current?.setProgress(this.targets()[0].p as number);
          },
        },
        0
      );

      tl.fromTo(
        ".xp-copy",
        { opacity: 0, y: 46 },
        { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.03
      );
      tl.to(".xp-copy", { opacity: 0, y: -30, duration: 0.07, ease: "power1.in" }, 0.42);

      // spec callouts lock in as the parts converge
      CALLOUTS.forEach((_, i) => {
        tl.fromTo(
          `.xp-callout-${i}`,
          { opacity: 0, y: 22, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.05, ease: "power2.out" },
          0.45 + i * 0.055
        );
      });
    }, section);

    return () => {
      if (lbActive) letterbox.leave();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="exploded"
      aria-label="מבט הנדסי על מערכת הפליטה"
    >
      <div className="xp-media">
        <ScrubCanvas
          ref={scrubRef}
          frames={EXPLODED_FRAMES}
          className="xp-canvas"
          eagerCount={8}
          ariaLabel="מערכת פליטה מתפרקת ומתחברת במבט הנדסי"
        />
      </div>

      <div className="xp-copy">
        <p className="kicker">הנדסת פליטה</p>
        <h2 className="h-display">המערכת נראית פשוטה. העבודה לא.</h2>
        <p className="h-sub">
          כל חיבור, זווית, אטימה ותושבת משפיעים על רעש, ריח, לחץ ויציבות.
        </p>
      </div>

      <ul className="xp-callouts" aria-label="מרכיבי המערכת">
        {CALLOUTS.map((c, i) => (
          <li key={c} className={`xp-callout xp-callout-${i}`}>
            <span className="xp-tick" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </section>
  );
}
