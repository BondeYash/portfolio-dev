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

/**
 * The live domain, written as the host Vercel actually serves. The project
 * has www as its primary domain and redirects the apex to it, so canonical
 * and Open Graph URLs must say www — otherwise every page advertises an
 * address that only resolves through a redirect.
 *
 * Host canonicalisation belongs to the domain settings, not to this app: a
 * redirect here fights the one Vercel already performs and loops forever.
 */
const PRODUCTION = "https://www.yashb.dev";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? PRODUCTION
    : fromVercel
      ? `https://${fromVercel}`
      : "http://localhost:3000")
).replace(/\/+$/, "");

/** True once the site is answering on a real domain, not a dev machine. */
export const isLive = !siteUrl.includes("localhost");
