"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { letterbox, cursorLamp } from "@/lib/letterboxBus";
import { prefersReducedMotion } from "@/lib/useReducedMotion";

/**
 * Global cinematic chrome: film grain, letterbox bars, cursor lamp.
 * Sections drive the letterbox/lamp via the stores in lib/letterboxBus.
 */
export default function CinematicChrome() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    // normalize to GSAP-managed yPercent: the CSS translateY(-101%) fallback is
    // read back from the computed matrix as PIXELS, so tweens on yPercent would
    // otherwise never move the bars
    gsap.set(topRef.current, { yPercent: -101, y: 0 });
    gsap.set(bottomRef.current, { yPercent: 101, y: 0 });

    // ---- letterbox ----
    const unsubLetterbox = letterbox.subscribe((on) => {
      if (reduced) return;
      gsap.to(topRef.current, {
        yPercent: on ? 0 : -101,
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: "auto",
      });
      gsap.to(bottomRef.current, {
        yPercent: on ? 0 : 101,
        duration: 0.9,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    });

    // ---- cursor lamp (desktop pointers only) ----
    const lamp = lampRef.current;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let cleanupLamp = () => {};
    if (lamp && fine && !reduced) {
      const xTo = gsap.quickTo(lamp, "x", { duration: 0.65, ease: "power3.out" });
      const yTo = gsap.quickTo(lamp, "y", { duration: 0.65, ease: "power3.out" });
      let enabled = false;
      const onMove = (e: PointerEvent) => {
        if (!enabled) return;
        xTo(e.clientX);
        yTo(e.clientY);
      };
      const unsubLamp = cursorLamp.subscribe((on) => {
        enabled = on;
        lamp.classList.toggle("is-on", on);
      });
      window.addEventListener("pointermove", onMove, { passive: true });
      cleanupLamp = () => {
        window.removeEventListener("pointermove", onMove);
        unsubLamp();
      };
    }

    return () => {
      unsubLetterbox();
      cleanupLamp();
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div
        ref={topRef}
        className="letterbox-bar letterbox-top"
        aria-hidden="true"
      />
      <div
        ref={bottomRef}
        className="letterbox-bar letterbox-bottom"
        aria-hidden="true"
      />
      <div ref={lampRef} className="cursor-lamp" aria-hidden="true" />
    </>
  );
}

export function setCursorLamp(on: boolean) {
  cursorLamp.set(on);
}
