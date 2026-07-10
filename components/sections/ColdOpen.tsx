"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { letterbox } from "@/lib/letterboxBus";
import { prefersReducedMotion } from "@/lib/useReducedMotion";
import TrackInWords from "@/components/TrackInWords";

/** 1. Cold Open — the sound. Near-black, waveform, letterbox. */
export default function ColdOpen() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const reduced = prefersReducedMotion();

    // ---- waveform (runs only while on screen) ----
    const ctx = canvas.getContext("2d");
    let raf = 0;
    let t = 0;
    let waveVisible = true;
    const drawWave = () => {
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bw = Math.round(rect.width * dpr);
      if (canvas.width !== bw) {
        canvas.width = bw;
        canvas.height = Math.round(rect.height * dpr);
      }
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1.4 * dpr;
      ctx.strokeStyle = "rgba(227,154,59,0.55)";
      ctx.beginPath();
      const mid = h / 2;
      for (let x = 0; x <= w; x += 3) {
        const k = x / w;
        // irregular "something is wrong" waveform
        const env = Math.sin(k * Math.PI);
        const y =
          mid +
          env *
            (Math.sin(x * 0.02 + t) * 6 +
              Math.sin(x * 0.11 + t * 2.3) * 3 +
              Math.sin(x * 0.005 + t * 0.7) * 14) *
            dpr;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      t += 0.035;
      if (!reduced && waveVisible) raf = requestAnimationFrame(drawWave);
    };
    drawWave();
    const waveIo = new IntersectionObserver(([entry]) => {
      const was = waveVisible;
      waveVisible = entry.isIntersecting;
      if (waveVisible && !was && !reduced) drawWave();
    });
    waveIo.observe(canvas);

    let lbActive = false;
    const ctxGsap = gsap.context(() => {
      // letterbox while cold open is on screen
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom top",
        onToggle: (self) => {
          lbActive = self.isActive;
          if (self.isActive) letterbox.enter();
          else letterbox.leave();
        },
      });

      if (!reduced) {
        // typography tracks in from depth
        gsap.fromTo(
          ".cold-open .word",
          { opacity: 0, y: 40, z: -120, rotateX: 18 },
          {
            opacity: 1,
            y: 0,
            z: 0,
            rotateX: 0,
            stagger: 0.14,
            duration: 1.4,
            ease: "power3.out",
            delay: 0.4,
          }
        );
        gsap.fromTo(
          ".cold-sub, .cold-small, .cold-wave, .cold-hint",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, stagger: 0.22, duration: 1.2, delay: 1.4 }
        );
        // fade the whole thing slightly as you scroll away
        gsap.to(".cold-inner", {
          opacity: 0.15,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "60% center",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, section);

    return () => {
      cancelAnimationFrame(raf);
      waveIo.disconnect();
      if (lbActive) letterbox.leave();
      ctxGsap.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="cold-open" aria-label="פתיחה">
      <div className="cold-inner">
        <TrackInWords as="h1" className="cold-title" text="שומעים שמשהו השתנה?" />
        <p className="cold-sub">
          רעש מתכתי. ריח גזים. רעידה בסרק. אגזוז שנשמע עמוק מדי.
        </p>
        <canvas ref={canvasRef} className="cold-wave" aria-hidden="true" />
        <p className="cold-small">מערכת הפליטה מספרת מה קורה מתחת לרכב.</p>
        <div className="cold-hint" aria-hidden="true">
          <span className="hint-lamp" />
          <span>גללו למטה</span>
        </div>
      </div>
    </section>
  );
}
