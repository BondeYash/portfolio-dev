import type { ReactNode } from "react";
import { paper } from "@/data/profile";

/* ------------------------------------------------------------------
   Printer's furniture: rules, heads, bylines, boxes. Server-rendered.
   ------------------------------------------------------------------ */

export function Rule({
  weight = "thin",
  className = "",
}: {
  weight?: "hair" | "thin" | "thick" | "double" | "dotted";
  className?: string;
}) {
  const map = {
    hair: "rule-hair",
    thin: "rule-thin",
    thick: "rule-thick",
    double: "rule-double",
    dotted: "rule-dotted",
  } as const;
  return <div aria-hidden="true" className={`${map[weight]} ${className}`} />;
}

export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-2 text-faded ${className}`}
    >
      <span className="h-px w-10 bg-rule/50" />
      <span className="font-hed text-xs">&#10086;</span>
      <span className="h-px w-10 bg-rule/50" />
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <p className="kicker">{children}</p>;
}

export function SectionHead({
  label,
  folio,
  note,
}: {
  label: string;
  folio?: string;
  note?: string;
}) {
  return (
    <header className="mb-5">
      <div className="rule-thick" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-1.5">
        <h2 className="font-cond text-xl font-semibold uppercase tracking-news text-ink sm:text-2xl">
          {label}
        </h2>
        <p className="slug">
          {note ? <span>{note}</span> : null}
          {note && folio ? <span className="px-2">&middot;</span> : null}
          {folio ? <span className="tabular">{folio}</span> : null}
        </p>
      </div>
      <div className="rule-thin" />
    </header>
  );
}

export function Byline({
  credit = "Staff Correspondent",
  wire,
}: {
  credit?: string;
  wire?: string;
}) {
  return (
    <p className="byline mt-3">
      By <span className="font-semibold">{credit}</span>
      {wire ? <span className="text-faded"> &middot; {wire}</span> : null}
    </p>
  );
}

export function Dateline({ city, children }: { city: string; children: ReactNode }) {
  return (
    <>
      <span className="font-cond text-[0.8rem] font-semibold uppercase tracking-wide">
        {city}
      </span>
      <span className="text-faded"> &mdash; </span>
      {children}
    </>
  );
}

export function Brief({
  head,
  meta,
  children,
  className = "",
}: {
  head: string;
  meta?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`boxed col-break-avoid p-4 ${className}`}>
      <h3 className="hed text-lg sm:text-xl">{head}</h3>
      {meta ? <p className="slug mt-1">{meta}</p> : null}
      <div className="mt-2">{children}</div>
    </article>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="pullquote col-break-avoid my-5 py-3">
      <blockquote className="font-hed text-[1.35rem] font-bold italic leading-[1.2] tracking-tight sm:text-2xl">
        &ldquo;{children}&rdquo;
      </blockquote>
      {attribution ? (
        <figcaption className="slug mt-2">&mdash; {attribution}</figcaption>
      ) : null}
    </figure>
  );
}

export function Folio({
  page,
  section,
  className = "",
}: {
  page: string;
  section: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-baseline justify-between border-t border-rule/50 pt-1.5 ${className}`}
    >
      <span className="slug tabular">{page}</span>
      <span className="slug">{paper.title}</span>
      <span className="slug uppercase">{section}</span>
    </div>
  );
}

/** A boxed "continued on" pointer, the way broadsheets jump a story. */
export function Jump({ to }: { to: string }) {
  return (
    <p className="mt-3 font-hed text-sm italic text-faded">
      Continued on {to}
      <span aria-hidden="true"> &rarr;</span>
    </p>
  );
}
