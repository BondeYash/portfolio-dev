# Yash Bonde — Portfolio

Multi-page developer site: **Next.js 14 App Router**, TypeScript, Tailwind, Framer Motion, and **Three.js** (`@react-three/fiber`). Copy and résumé facts live in `data/profile.ts`. GitHub repos are fetched live on `/work`.

## Pages

| Route          | Concern                                      |
| -------------- | -------------------------------------------- |
| `/`            | Index / 3D hero                              |
| `/about`       | Bio, education, skills, certifications       |
| `/work`        | Featured projects + live GitHub repositories |
| `/experience`  | Roles and internships                        |
| `/contact`     | Email, phone, LinkedIn, mailto form          |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update personal info

Edit **`data/profile.ts`** — that is the single source of truth for name, location, phone, email, education, experience, projects, skills, and certifications.

- `tagline` is the home H1. Alternates are commented in that file and in `components/home/home-view.tsx`.
- `resumeUrl` should point at a PDF, not a Drive homepage.

## GitHub username

1. Change `GITHUB_USERNAME` in `data/profile.ts`.
2. Keep `profile.github` in sync.
3. Refresh `data/fallback-github.ts` for rate-limit fallback.

Optional env: `GITHUB_TOKEN` (higher API limit), `NEXT_PUBLIC_SITE_URL` (canonical / OG URLs).

## Fonts

Self-hosted via `next/font`: **Instrument Serif** (headings), **Outfit** (body), **JetBrains Mono** (labels).

## Theme

Dark by default. Toggle persists as `localStorage.theme`. `prefers-reduced-motion` disables the Three.js canvas.

## Deploy

Import [github.com/BondeYash/portfolio-dev](https://github.com/BondeYash/portfolio-dev) on Vercel, then attach a custom domain under **Settings → Domains**.
