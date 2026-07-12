/** production domain (override with NEXT_PUBLIC_SITE_URL if it ever changes) */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://erezegzozim.com";

/** פרטי העסק — מקור אמת יחיד לכל האתר */
export const SITE = {
  name: "ארז אגזוזים",
  owner: "ארז כהן",
  tagline: "מערכות פליטה, אגזוזים ואבחון רעשים",
  subline: "אבחון ותיקון בעיות זיהום אוויר · אגזוזים · ממירים קטליטיים",
  area: "אזור המרכז",
  city: "ראשון לציון",
  address: "משה בקר 18",
  phoneMobile: "054-5955580",
  phoneMobileHref: "tel:+972545955580",
  phoneLand: "03-9643086",
  phoneLandHref: "tel:+97239643086",
  whatsappHref:
    "https://wa.me/972545955580?text=" +
    encodeURIComponent("היי, יש לי רעש או בעיה באגזוז. אשלח סרטון של הרעש."),
  wazeHref: "https://waze.com/ul?q=" + encodeURIComponent("משה בקר 18, ראשון לציון"),
  hours: "א׳–ה׳ 08:00–17:00 · ו׳ 08:00–13:00",
} as const;
