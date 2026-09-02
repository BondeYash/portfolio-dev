/**
 * The canonical origin of the paper.
 *
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every deployment, so canonical
 * and Open Graph URLs stay correct even when NEXT_PUBLIC_SITE_URL was never
 * configured. Only a local run falls through to localhost.
 */
const fromVercel =
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (fromVercel ? `https://${fromVercel}` : "http://localhost:3000")
).replace(/\/+$/, "");

/** True once the site is answering on a real domain, not a dev machine. */
export const isLive = !siteUrl.includes("localhost");
