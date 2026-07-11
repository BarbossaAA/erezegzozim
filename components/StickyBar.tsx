"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

/** Sticky contact bar — appears after the hero releases. */
export default function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      // visible only once the hero has been scrolled PAST (it sits above the viewport)
      ([entry]) =>
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <nav
      className={`sticky-bar ${visible ? "is-visible" : ""}`}
      aria-label="יצירת קשר מהירה"
      aria-hidden={!visible}
      inert={!visible}
    >
      <a href="#booking" className="primary">
        קבע בדיקה
      </a>
      <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
        וואטסאפ
      </a>
      <a href={SITE.wazeHref} target="_blank" rel="noopener noreferrer">
        ניווט
      </a>
      <a href={SITE.phoneMobileHref}>טלפון</a>
    </nav>
  );
}
