import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  if (process.env.NODE_ENV !== "production") {
    // debugging aid for devtools
    (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger };
