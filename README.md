# Yash Bonde — Portfolio

Production-ready developer portfolio built with **Next.js 14 (App Router)**, TypeScript (strict), Tailwind CSS, and Framer Motion. GitHub data is fetched live from the [GitHub REST API](https://api.github.com) and revalidated every 12 hours.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Update personal info

All LinkedIn / bio / skills / experience / education lives in a single typed file:

```
data/profile.ts
```

Fill in `experience` and `education` (they currently use placeholders). Then update:

- `tagline` — default H1. Alternate headlines are commented in that file and in `components/hero.tsx`.
- `email`, `linkedin`, `github`, `resumeUrl`
- `skills`, `bio`, `subheading`

## Swap the GitHub username

1. Change `GITHUB_USERNAME` at the top of `data/profile.ts`.
2. Update `profile.github` to match.
3. Optionally refresh `data/fallback-github.ts` so the offline/rate-limit fallback still looks like you.

Live fetch happens in `lib/github.ts` (`GET /users/{username}` and `GET /users/{username}/repos?sort=updated&per_page=100`). Forks are filtered out, then the top 6 repos by stars (then recency) are shown.

If GitHub rate-limits the unauthenticated API, set a personal access token:

```bash
GITHUB_TOKEN=ghp_your_token
```

The site will not crash on API failure — it falls back to `data/fallback-github.ts`.

## Theme

Dark mode is the default. The toggle persists in `localStorage` under the key `theme`.

## Deploy on Vercel + custom domain

1. Push this repo to GitHub (`https://github.com/BondeYash/portfolio-dev`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Framework preset: **Next.js**. Build command `next build`, output as default.
4. Add env vars if you want them:
   - `GITHUB_TOKEN` (optional, higher rate limit)
   - `NEXT_PUBLIC_SITE_URL` (your live URL, e.g. `https://yashbonde.com`)
5. Deploy.
6. In the Vercel project: **Settings → Domains** → add your domain.
7. At your registrar, point DNS as Vercel shows:
   - Apex: `A` record to `76.76.21.21` (or Vercel nameservers)
   - `www`: `CNAME` to `cname.vercel-dns.com`
8. Wait for SSL to issue, then set `NEXT_PUBLIC_SITE_URL` to `https://your-domain` and redeploy so Open Graph URLs are correct.

## Scripts

| Command        | What it does        |
| -------------- | ------------------- |
| `npm run dev`  | Local development   |
| `npm run build`| Production build    |
| `npm run start`| Serve production    |
| `npm run lint` | ESLint              |
