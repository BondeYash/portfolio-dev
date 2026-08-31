# Yash Times

A portfolio built as a newspaper. **Next.js 14 App Router**, TypeScript, Tailwind, and **GSAP** (ScrollTrigger). Copy and résumé facts live in `data/profile.ts`; masthead furniture lives in the `paper` export of the same file. GitHub data is fetched live and cached for twelve hours.

Two experiences carry the site:

- **`/` — the front page.** A full-screen broadsheet: blackletter masthead struck onto the sheet, a stock-ticker of skills, a lead story set in real CSS columns with a drop cap and pull quote, then bands below the fold that *unfold* on scroll (`rotateX`, scrubbed), halftone photography whose dot screen coarsens as it travels, and rules that draw themselves.
- **`/edition` — the bound edition.** Twelve pages hinged at the spine and turned in 3D. Click the peeling corner, drag the sheet, use `←` / `→`, or jump by folio. Each turn carries a sweeping shade across the leaf, a cast shadow on the spread below, and a paper rustle synthesised in the browser from band-passed white noise (no audio files).

Navigation is printed **inside the paper** — the index line under the masthead — because a newspaper has no navbar. There is no site header or footer; the imprint is set in agate at the foot of each sheet.

## Pages

| Route         | Section     | Concern                                            |
| ------------- | ----------- | -------------------------------------------------- |
| `/`           | Front Page  | Lead story, ticker, business, technology, markets, classifieds |
| `/edition`    | The Edition | The twelve-page turnable edition                   |
| `/about`      | Profile     | Bio, schooling, honours, the type case             |
| `/work`       | Technology  | Flagship projects + live repository board          |
| `/experience` | Business    | Postings and assignments                           |
| `/contact`    | Classifieds | Display ads, rate card, letters to the editor      |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update personal info

Edit **`data/profile.ts`** — the single source of truth for name, location, phone, email, education, experience, projects, skills, and certifications. The `paper` export controls the masthead: title, motto, city, volume, number, price.

- `tagline` is printed as the front-page pull quote.
- `resumeUrl` should point at a PDF, not a Drive homepage.

## GitHub username

1. Change `GITHUB_USERNAME` in `data/profile.ts`.
2. Keep `profile.github` in sync.
3. Refresh `data/fallback-github.ts` for the rate-limit fallback.

Optional env: `GITHUB_TOKEN` (higher API limit), `NEXT_PUBLIC_SITE_URL` (canonical / OG URLs).

## The press

- **Type** — `UnifrakturMaguntia` (masthead), `Playfair Display` (headlines), `Source Serif 4` (body), `Oswald` (kickers, slugs, folios), `Special Elite` (stamps). Self-hosted through `next/font`.
- **Paper** — newsprint grain, pulp fibres, edge vignette and halftone screens are all drawn in CSS; nothing is a photograph of paper. Tokens live at the top of `app/globals.css`.
- **Editions** — a morning run (light) and a night run (dark). The choice persists as `localStorage.edition` and is applied before first paint by an inline script in `app/layout.tsx`.
- **Motion** — every animation checks `prefers-reduced-motion`; page turns become instant and reveals stay put. Content is server-rendered inside the leaves, so the whole paper is readable with JavaScript switched off.

## Architecture notes

| File                                | Role                                                             |
| ----------------------------------- | ---------------------------------------------------------------- |
| `components/edition/flipbook.tsx`   | The page-turn engine: leaves, z-ordering, drag, keyboard, sound   |
| `components/edition/pages.tsx`      | The twelve printed pages, composed on a 380 × 543 canvas and scaled |
| `components/front/front-page.tsx`   | The scrolling broadsheet and its GSAP timelines                   |
| `components/paper/primitives.tsx`   | Printer's furniture: rules, section heads, bylines, folios        |
| `lib/gsap.ts`                       | Single GSAP registration point + isomorphic layout effect         |
| `components/paper/masthead-block.tsx` | Folio line, masthead, dateline and index — the printed identity |
| `components/paper/index-strip.tsx`  | The index line: the site's only navigation, plus the edition run  |
| `components/paper/imprint.tsx`      | Agate imprint at the foot of the sheet, in place of a site footer |

## Deploy

Import [github.com/BondeYash/portfolio-dev](https://github.com/BondeYash/portfolio-dev) on Vercel, then attach a custom domain under **Settings → Domains**.
