"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onCustom = pathname?.startsWith("/custom");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="brand">
        <span className="brand-name">{SITE.name}</span>
        <span className="brand-tag">{SITE.tagline}</span>
      </Link>
      <nav className="header-nav" aria-label="ניווט ראשי">
        <Link href={onCustom ? "/" : "/#symptoms"}>
          {onCustom ? "עמוד הבית" : "אבחון מהיר"}
        </Link>
        <Link href="/#services">שירותים</Link>
        <Link href="/custom" aria-current={onCustom ? "page" : undefined}>
          עבודות מיוחדות
        </Link>
      </nav>
      <div className="header-actions">
        <a href={SITE.phoneMobileHref} className="header-phone" dir="ltr">
          {SITE.phoneMobile}
        </a>
        <a href="/#booking" className="btn btn-primary header-cta">
          קבעו בדיקת אגזוז
        </a>
      </div>
    </header>
  );
}
