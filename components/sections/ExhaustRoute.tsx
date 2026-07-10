"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

const NODES = [
  { label: "יציאת מנוע", x: 940, y: 150 },
  { label: "ממיר קטליטי", x: 790, y: 210 },
  { label: "צינור גמיש", x: 640, y: 175 },
  { label: "רזונטור", x: 470, y: 225 },
  { label: "דוד אחורי", x: 280, y: 185 },
  { label: "קצה אגזוז", x: 110, y: 235 },
];

const PATH_D =
  "M 950 150 C 880 150 860 210 790 210 C 720 210 710 175 640 175 C 560 175 550 225 470 225 C 380 225 360 185 280 185 C 190 185 170 235 110 235";

/** 4. Exhaust Route — SVG line-draw tied to scroll, RTL: engine (right) → tip (left). */
export default function ExhaustRoute() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;
    const reduced = prefersReducedMotion();
    const length = path.getTotalLength();

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
        gsap.set(".route-node, .route-copy", { opacity: 1 });
        return;
      }

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.fromTo(
        ".route-copy",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: { trigger: section, start: "top 70%" },
        }
      );

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".route-stage",
          start: "top 75%",
          end: "bottom 45%",
          scrub: 0.8,
        },
      });

      tl.to(path, { strokeDashoffset: 0, duration: 1 }, 0);

      // each node glows as the line reaches it
      NODES.forEach((_, i) => {
        const at = (i + 0.5) / NODES.length;
        tl.fromTo(
          `.route-node-${i}`,
          { opacity: 0, scale: 0.6, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.07, ease: "back.out(2)" },
          at
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="route section"
      aria-label="מסלול מערכת הפליטה"
    >
      <div className="container route-copy">
        <p className="kicker">מסלול הפליטה</p>
        <h2 className="h-display">לא מנחשים. עוקבים אחרי כל מסלול הפליטה.</h2>
        <p className="h-sub">
          מנוע ← סעפת ← ממיר קטליטי ← צינור גמיש ← רזונטור ← דוד אחורי ← יציאה
        </p>
      </div>

      <div className="route-stage">
        <svg
          viewBox="0 0 1060 340"
          className="route-svg"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="routeGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#ffb45e" />
              <stop offset="1" stopColor="#b06f22" />
            </linearGradient>
            <filter id="routeGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ghost track */}
          <path d={PATH_D} className="route-ghost" />
          {/* animated draw */}
          <path
            ref={pathRef}
            d={PATH_D}
            className="route-line"
            stroke="url(#routeGrad)"
            filter="url(#routeGlow)"
          />

          {NODES.map((n, i) => (
            <g key={n.label} className={`route-node route-node-${i}`}>
              <circle cx={n.x} cy={n.y} r="22" className="route-node-halo" />
              <circle cx={n.x} cy={n.y} r="6" className="route-node-dot" />
              <text
                x={n.x}
                y={i % 2 === 0 ? n.y - 38 : n.y + 52}
                textAnchor="middle"
                className="route-node-text"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
