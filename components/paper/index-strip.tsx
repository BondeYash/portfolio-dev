"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EditionToggle } from "@/components/paper/edition-toggle";
import { nav } from "@/data/profile";

/**
 * The index line a broadsheet prints under its masthead. It is the only
 * navigation on the site, because a newspaper does not have a navbar.
 */
export function IndexStrip({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Index"
      className={`no-print flex flex-wrap items-baseline justify-center gap-x-1 gap-y-1 ${
        compact ? "py-1" : "py-1.5"
      }`}
    >
      <span className="pr-1.5 font-cond text-[0.62rem] uppercase tracking-wide2 text-faded">
        Index
      </span>
      {nav.map((item, index) => (
        <span key={item.href} className="flex items-baseline">
          {index > 0 ? (
            <span aria-hidden="true" className="px-1.5 text-rule/35">
              &bull;
            </span>
          ) : null}
          <Link
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`font-cond text-[0.7rem] uppercase tracking-news transition-colors hover:text-spot ${
              isActive(item.href) ? "text-spot" : "text-ink"
            }`}
          >
            {item.label}
            <span className="pl-1 text-[0.58rem] tabular text-faded">
              {item.folio}
            </span>
          </Link>
        </span>
      ))}
      <span aria-hidden="true" className="px-1.5 text-rule/35">
        &bull;
      </span>
      <EditionToggle />
    </nav>
  );
}
