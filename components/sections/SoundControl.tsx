"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

type Phase = "before" | "after";
type Mode = "idle" | "accel" | "cruise";

const MODES: { id: Mode; label: string }[] = [
  { id: "idle", label: "סרק" },
  { id: "accel", label: "האצה" },
  { id: "cruise", label: "נסיעה רגועה" },
];

/** waveform character per state — noisy/uneven before, controlled after */
const PARAMS: Record<Phase, Record<Mode, { amp: number; noise: number; freq: number }>> = {
  before: {
    idle: { amp: 16, noise: 10, freq: 0.05 },
    accel: { amp: 34, noise: 22, freq: 0.09 },
    cruise: { amp: 22, noise: 14, freq: 0.06 },
  },
  after: {
    idle: { amp: 7, noise: 1.2, freq: 0.035 },
    accel: { amp: 16, noise: 2.5, freq: 0.06 },
    cruise: { amp: 10, noise: 1.6, freq: 0.045 },
  },
};

/** 10. Sound Control — morphing waveform, before/after states. */
export default function SoundControl() {
  const [phase, setPhase] = useState<Phase>("before");
  const [mode, setMode] = useState<Mode>("idle");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const current = useRef({ amp: 16, noise: 10, freq: 0.05 });

  useEffect(() => {
    const target = PARAMS[phase][mode];
    if (prefersReducedMotion()) {
      current.current = { ...target };
      return;
    }
    gsap.to(current.current, {
      amp: target.amp,
      noise: target.noise,
      freq: target.freq,
      duration: 1.1,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }, [phase, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = prefersReducedMotion();
    let raf = 0;
    let t = 0;
    let visible = false;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(rect.width * dpr)) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
      }
      const w = canvas.width;
      const h = canvas.height;
      const { amp, noise, freq } = current.current;
      ctx.clearRect(0, 0, w, h);

      // reference center line
      ctx.strokeStyle = "rgba(234,231,224,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();

      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const k = x / w;
        const env = Math.sin(k * Math.PI) ** 0.7;
        const base = Math.sin(x * freq + t * 2.2) * amp;
        const jitter =
          Math.sin(x * 0.33 + t * 9.1) * noise * 0.55 +
          Math.sin(x * 0.71 + t * 13.7) * noise * 0.45;
        const y = h / 2 + env * (base + jitter) * dpr * 0.55;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      // faked glow: wide translucent pass + crisp pass (far cheaper than shadowBlur)
      ctx.lineWidth = 7 * dpr;
      ctx.strokeStyle = "rgba(227,154,59,0.16)";
      ctx.stroke();
      ctx.lineWidth = 1.6 * dpr;
      ctx.strokeStyle = "rgba(227,154,59,0.85)";
      ctx.stroke();

      t += 0.016;
      if (!reduced && visible) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = entry.isIntersecting;
      if (visible && (!was || reduced)) draw();
    });
    io.observe(canvas);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sound section" aria-label="שליטה ברעש">
      <div className="container">
        <p className="kicker">שליטה בצליל</p>
        <h2 className="h-display">ככה נראה ההבדל בצליל.</h2>
        <p className="h-sub">
          מערכת פליטה תקינה שומרת על איזון בין זרימה, שקט ובטיחות. ההדמיה
          ממחישה איך הרכב נשמע לפני הטיפול ואחריו, במצבי נסיעה שונים.
        </p>

        <div className="sound-stage">
          <div className="sound-toggles">
            <div
              className="toggle-group"
              role="group"
              aria-label="מצב המערכת"
            >
              <button
                aria-pressed={phase === "before"}
                className={phase === "before" ? "is-on" : ""}
                onClick={() => setPhase("before")}
              >
                לפני
              </button>
              <button
                aria-pressed={phase === "after"}
                className={phase === "after" ? "is-on" : ""}
                onClick={() => setPhase("after")}
              >
                אחרי
              </button>
            </div>
            <div className="toggle-group" role="group" aria-label="מצב נסיעה">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  aria-pressed={mode === m.id}
                  className={mode === m.id ? "is-on" : ""}
                  onClick={() => setMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <canvas
            ref={canvasRef}
            className="sound-canvas"
            role="img"
            aria-label={`הדמיית צליל האגזוז — ${phase === "before" ? "לפני תיקון: גל לא אחיד" : "אחרי תיקון: גל יציב ומבוקר"}`}
          />
        </div>
      </div>
    </section>
  );
}
