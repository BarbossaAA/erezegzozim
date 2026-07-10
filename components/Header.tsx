"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <a href="#main" className="brand">
        <span className="brand-name">{SITE.name}</span>
        <span className="brand-tag">{SITE.tagline}</span>
      </a>
      <div className="header-actions">
        <a href={SITE.phoneMobileHref} className="header-phone" dir="ltr">
          {SITE.phoneMobile}
        </a>
        <a href="#booking" className="btn btn-primary header-cta">
          קבעו בדיקת אגזוז
        </a>
      </div>
    </header>
  );
}
