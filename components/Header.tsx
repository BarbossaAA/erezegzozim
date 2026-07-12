"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

/** identical menu on every page, in reading order */
const NAV = [
  { href: "/", label: "עמוד הבית" },
  { href: "/#symptoms", label: "אבחון מהיר" },
  { href: "/#services", label: "שירותים" },
  { href: "/custom", label: "עבודות מיוחדות" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mobile menu when navigating or pressing Escape
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/custom"
      ? pathname?.startsWith("/custom")
      : href === "/"
        ? pathname === "/"
        : false;

  const links = NAV.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      aria-current={isActive(item.href) ? "page" : undefined}
      onClick={() => setOpen(false)}
    >
      {item.label}
    </Link>
  ));

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <Link href="/" className="brand">
        <span className="brand-name">{SITE.name}</span>
        <span className="brand-tag">{SITE.tagline}</span>
      </Link>

      <nav className="header-nav" aria-label="ניווט ראשי">
        {links}
      </nav>

      <div className="header-actions">
        <a href={SITE.phoneMobileHref} className="header-phone" dir="ltr">
          {SITE.phoneMobile}
        </a>
        <a href="#booking" className="btn btn-primary header-cta">
          קבעו בדיקת אגזוז
        </a>
        <button
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
          onClick={() => setOpen(!open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`mobile-menu ${open ? "is-open" : ""}`}
        aria-label="תפריט נייד"
        inert={!open}
      >
        {links}
        <a href="#booking" className="btn btn-primary" onClick={() => setOpen(false)}>
          קבעו בדיקת אגזוז
        </a>
        <a href={SITE.phoneMobileHref} className="mobile-menu-phone" dir="ltr">
          {SITE.phoneMobile}
        </a>
      </nav>
    </header>
  );
}
