import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-site flex-col justify-center px-5 py-24 sm:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-muted">404</p>
      <h1 className="mt-4 max-w-xl font-display text-5xl font-medium tracking-tightest text-ink sm:text-6xl">
        That route doesn&apos;t ship.
      </h1>
      <p className="mt-6 max-w-md text-muted">
        The page you want isn&apos;t here. Head back to the work, or start a
        conversation from the homepage.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex w-fit rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-transform hover:scale-[1.03]"
      >
        Back home
      </Link>
    </main>
  );
}
