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

/** Compact exhaust-route line-draw — plays itself once when it enters view. */
export default function RouteStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const path = pathRef.current;
    if (!section || !path) return;
    const length = path.getTotalLength();

    if (prefersReducedMotion()) {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      gsap.set(".rs-node, .rs-copy", { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section, start: "top 70%" },
      });
      tl.fromTo(".rs-copy", { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
      tl.to(path, { strokeDashoffset: 0, duration: 2.1, ease: "power2.inOut" }, 0.2);
      NODES.forEach((_, i) => {
        tl.fromTo(
          `.rs-node-${i}`,
          { opacity: 0, scale: 0.6, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
          0.2 + ((i + 0.6) / NODES.length) * 2.1
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="rs" aria-label="מסלול מערכת הפליטה">
      <div className="container rs-copy">
        <p className="kicker">כך אנחנו עובדים</p>
        <h2 className="h-display">
          אנחנו לא מנחשים — עוברים על מסלול הפליטה כולו.
        </h2>
      </div>
      <div className="rs-stage">
        <svg viewBox="0 0 1060 320" className="rs-svg" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="rsGrad" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0" stopColor="#ffb45e" />
              <stop offset="1" stopColor="#b06f22" />
            </linearGradient>
          </defs>
          <path d={PATH_D} className="rs-ghost" />
          <path ref={pathRef} d={PATH_D} className="rs-line" stroke="url(#rsGrad)" />
          {NODES.map((n, i) => (
            <g key={n.label} className={`rs-node rs-node-${i}`}>
              <circle cx={n.x} cy={n.y} r="18" className="rs-halo" />
              <circle cx={n.x} cy={n.y} r="5" className="rs-dot" />
              <text
                x={n.x}
                y={i % 2 === 0 ? n.y - 30 : n.y + 42}
                textAnchor="middle"
                className="rs-text"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="visually-hidden">
        {NODES.map((n) => (
          <li key={n.label}>{n.label}</li>
        ))}
      </ul>
    </section>
  );
}
