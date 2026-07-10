# ארז אגזוזים — erezegzozim.com

Cinematic one-page RTL Hebrew site for Erez Egzozim (exhaust systems workshop, Rishon LeZion).
Next.js 15 + TypeScript, GSAP ScrollTrigger pinned scroll scenes, Lenis smooth scroll,
canvas frame-sequence scrubbing, SVG line-draw overlays. Fully static export.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build & deploy

```bash
npm run build      # static export to ./out
```

Deployed to GitHub Pages (gh-pages branch = contents of ./out, custom domain
erezegzozim.com). To redeploy after changes: build, then push ./out to gh-pages.

## Where things live

- `lib/site.ts` — ALL business details (phones, address, hours, domain). Edit here only.
- `lib/frames.ts` — frame-sequence manifest for the scroll-scrubbed scenes.
- `components/sections/` — one component per page section, in scroll order.
- `public/media/` — optimized web assets (webp frames, mp4 loops, stills).
- `assets-src/manifest.json` — Higgsfield generation job IDs for every source asset
  (sources themselves are git-ignored; re-download via the CDN URLs per job ID).

## Media pipeline

Real shop photos → nano-banana night-grade masters → Seedance 2.0 clips (identity-referenced)
→ 4K upscale → ffmpeg (webp frame sequences for scrubbed scenes, H.264 loops for ambient).
The license plate in the under-car master is blurred (ffmpeg delogo) before serving.
