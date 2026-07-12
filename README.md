# ארז אגזוזים — erezegzozim.com

Marketing site for Erez Egzozim (exhaust systems workshop, Rishon LeZion).
Next.js 15 + TypeScript, fully static export, two pages:

- `/` — conversion-focused home: autoplaying cinematic hero (copy slides in on a
  timed GSAP sequence), interactive symptom finder, services, custom-works band,
  exhaust-route SVG line-draw, trust + case stories, sound-comparison widget, FAQ, CTA.
- `/custom/` — the made-to-measure story: custom builds for classics, 4x4 and
  special vehicles.

Motion: Lenis smooth scroll + GSAP entrance reveals and SVG line-draws only —
no pinned/scroll-scrubbed scenes. Ambient footage is lazy-loaded looping MP4s
(`components/AutoVideo.tsx`), the heroes autoplay muted (`components/HeroVideo.tsx`).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & deploy

```bash
npm run build      # static export to ./out
npm run deploy     # build + force-push ./out to the gh-pages branch
```

Hosting: GitHub Pages (gh-pages branch = contents of ./out, custom domain
erezegzozim.com via CNAME, HTTPS enforced). `npm start` serves the built
./out locally.

## Where things live

- `lib/site.ts` — ALL business details (phones, address, hours, domain). Edit here only.
- `components/HeroVideo.tsx` — reusable autoplay hero (video, timed copy reveal, cinema-bars intro).
- `components/sections/` — one component per page section.
- `public/media/` — optimized web assets (MP4 loops, WebP posters and stills).
- `assets-src/manifest.json` — Higgsfield generation job IDs for every source asset
  (sources themselves are git-ignored; re-download via the CDN URLs per job ID).

## Media pipeline

Real shop photos → nano-banana night-grade masters → Seedance 2.0 clips
(identity-referenced to the real garage) → 4K upscale → ffmpeg (H.264 loops at
1280–1600w + WebP posters). The license plate in the under-car master is blurred
(ffmpeg delogo) before serving. Avoid AI-tell prompts (hands, welding arcs);
lamp-over-metal documentary shots read as real footage.
