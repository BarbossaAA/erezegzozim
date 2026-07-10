"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { letterbox } from "@/lib/letterboxBus";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import ScrubCanvas, { ScrubCanvasHandle } from "@/components/ScrubCanvas";
import { framePaths } from "@/lib/frames";

const ORBIT_FRAMES = framePaths("orbit");

const LABELS = [
  { text: "יציאת מנוע", x: 78, y: 38, at: 0.1 },
  { text: "ממיר קטליטי", x: 62, y: 55, at: 0.28 },
  { text: "צינור גמיש", x: 50, y: 44, at: 0.46 },
  { text: "רזונטור", x: 38, y: 58, at: 0.64 },
  { text: "דוד אחורי", x: 24, y: 46, at: 0.8 },
  { text: "קצה אגזוז", x: 12, y: 60, at: 0.92 },
];

/** 3. 3D Scroll Inspection — scrubbed underbody orbit with attached labels. */
export default function Underbody() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<ScrubCanvasHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduced = prefersReducedMotion();
    let lbActive = false;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(".ub-label, .ub-copy", { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=2800",
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

      // headline floats in early, drifts out late
      tl.fromTo(
        ".ub-copy",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.02
      );
      tl.to(".ub-copy", { opacity: 0, y: -40, duration: 0.08, ease: "power2.in" }, 0.3);

      // labels attach along the route with lagging inertia
      LABELS.forEach((label, i) => {
        tl.fromTo(
          `.ub-label-${i}`,
          { opacity: 0, y: 34, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.06, ease: "back.out(1.6)" },
          label.at
        );
        tl.to(
          `.ub-label-${i}`,
          { opacity: 0, y: -20, duration: 0.05, ease: "power1.in" },
          Math.min(label.at + 0.16, 0.98)
        );
      });

      // depth parallax: shadows drift slightly against the footage
      tl.fromTo(".ub-shadow", { yPercent: 8 }, { yPercent: -8, duration: 1 }, 0);
    }, section);

    return () => {
      if (lbActive) letterbox.leave();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="underbody"
      aria-label="סיור מתחת לרכב לאורך מערכת הפליטה"
    >
      <div className="ub-media">
        <ScrubCanvas
          ref={scrubRef}
          frames={ORBIT_FRAMES}
          className="ub-canvas"
          eagerCount={8}
          ariaLabel="מבט מתחת לרכב לאורך מסלול הפליטה: ממיר, צינור גמיש, רזונטור, דוד אחורי"
        />
        <div className="ub-shadow" aria-hidden="true" />
      </div>

      <div className="ub-copy">
        <p className="kicker">בדיקה מתחת לרכב</p>
        <h2 className="h-display">
          מתחת לרכב נמצאים החום, הלחץ, הרעש — והפתרון.
        </h2>
      </div>

      <div className="ub-labels" aria-hidden="true">
        {LABELS.map((l, i) => (
          <div
            key={l.text}
            className={`ub-label ub-label-${i}`}
            style={{ right: `${100 - l.x}%`, top: `${l.y}%` }}
          >
            <span className="ub-dot" />
            <span className="ub-text">{l.text}</span>
          </div>
        ))}
      </div>
      {/* accessible fallback list for the visual labels */}
      <ul className="visually-hidden">
        {LABELS.map((l) => (
          <li key={l.text}>{l.text}</li>
        ))}
      </ul>
    </section>
  );
}
