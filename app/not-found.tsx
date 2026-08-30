import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-10 h-64 w-64 rounded-full bg-accent/30 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-24 h-56 w-56 rounded-full bg-violet/25 blur-[80px]"
      />
      <div className="relative mx-auto flex min-h-[60vh] max-w-site flex-col justify-center px-5 py-24 sm:px-8">
        <p className="type-label text-cyan">
          404
        </p>
        <h1 className="type-page mt-4 max-w-xl text-ink">
          Just a bunch of <span className="italic text-accent">404s</span>.
        </h1>
        <p className="type-lede mt-6 max-w-md text-muted">
          This page isn&apos;t in the map. Return to the index before the spinner
          starts feeling lonely.
        </p>
        <Link
          href="/"
          className="type-btn mt-10 inline-flex w-fit rounded-full bg-accent px-6 py-3 text-white transition-transform hover:scale-[1.03]"
        >
          Back to index
        </Link>
      </div>
    </div>
  );
}
