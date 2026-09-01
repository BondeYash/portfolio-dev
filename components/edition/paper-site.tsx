"use client";

import { useMemo } from "react";
import { LettersSlip } from "@/components/contact/letters-slip";
import { Flipbook } from "@/components/edition/flipbook";
import { buildEditionPages } from "@/components/edition/pages";
import { EditionToggle } from "@/components/paper/edition-toggle";
import { paper, profile } from "@/data/profile";
import type { GithubPayload } from "@/lib/types";

/**
 * The whole site: one newspaper, on the desk, turned by hand. There is no
 * page above it and no page below it — every section is a printed leaf.
 * On a wide desk the paper is flanked by the slips a compositor would
 * have pinned up beside it: the imprint on the left, the contents on the
 * right. Both are live — a slip turns the paper to its page.
 */
export function PaperSite({
  github,
  printedOn,
}: {
  github: GithubPayload;
  printedOn: string;
}) {
  const pages = useMemo(() => buildEditionPages(github), [github]);
  const gh = github.profile;

  return (
    <div className="desk flex h-[100svh] min-h-0 w-full flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 items-stretch">
        {/* ---- left rail: the imprint, pinned to the desk ---- */}
        <aside className="no-print hidden w-[15.5rem] shrink-0 flex-col justify-center gap-3 py-4 pl-5 pr-2 xl:flex">
          <div className="rail-slip">
            <p className="rail-kicker">The Imprint</p>
            <p className="masthead mt-1 text-[1.75rem] leading-[0.9]">
              {paper.title}
            </p>
            <div className="my-1.5 border-b border-rule/40" />
            <p className="rail-line">{printedOn}</p>
            <p className="rail-line">{paper.city}</p>
            <p className="rail-line mt-1.5 italic">{paper.motto}</p>
          </div>

          <div className="rail-slip">
            <p className="rail-kicker">The Desk</p>
            <dl className="mt-1">
              <RailFact term="Editor">{profile.fullName}</RailFact>
              <RailFact term="Beat">{profile.role}</RailFact>
              <RailFact term="Handle">{gh.login}</RailFact>
              <RailFact term="Repositories">{gh.publicRepos}</RailFact>
              <RailFact term="Subscribers">{gh.followers}</RailFact>
            </dl>
          </div>

          <div className="rail-slip">
            <p className="rail-kicker">Wire</p>
            <div className="mt-1 flex flex-col items-start gap-0.5">
              <a href={`mailto:${profile.email}`} className="rail-link">
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-link"
              >
                GitHub &rarr;
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-link"
              >
                LinkedIn &rarr;
              </a>
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rail-link"
              >
                R&eacute;sum&eacute; &rarr;
              </a>
            </div>
          </div>
        </aside>

        {/* ---- the paper ---- */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Flipbook pages={pages} label={paper.title} fill syncHash />
        </div>

        {/* ---- right rail: the contents, and they turn the paper ---- */}
        <aside className="no-print hidden w-[15.5rem] shrink-0 flex-col justify-center py-4 pl-2 pr-5 xl:flex">
          <nav className="rail-slip" aria-label={`${paper.title} contents`}>
            <p className="rail-kicker">In This Edition</p>
            <ol className="mt-1">
              {pages.map((page) => (
                <li key={page.id}>
                  <a
                    href={`#${page.id}`}
                    className="flex items-baseline justify-between gap-2 border-b border-rule/20 py-[3px] font-cond text-[0.72rem] uppercase tracking-news transition-colors hover:text-spot"
                  >
                    <span className="truncate">{page.section}</span>
                    <span className="tabular text-[0.66rem] text-faded">
                      {page.folio}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-2 font-cond text-[0.62rem] uppercase leading-snug tracking-news text-faded">
              Click the corner &middot; drag the sheet &middot; arrow keys turn
              pages
            </p>
          </nav>
        </aside>
      </div>

      {/* ---- the imprint, set in agate under the paper ---- */}
      <footer className="no-print flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-3 pb-1.5 pt-1 text-center">
        <span className="font-cond text-[0.66rem] uppercase tracking-news text-ink/85">
          {paper.city} &middot; {printedOn}
        </span>
        <span aria-hidden="true" className="text-rule/55">
          &bull;
        </span>
        <span className="hidden font-cond text-[0.66rem] uppercase tracking-news text-ink/75 lg:inline xl:hidden">
          Click the corner &middot; drag the sheet &middot; arrow keys turn
          pages
        </span>
        <span
          aria-hidden="true"
          className="hidden text-rule/55 lg:inline xl:hidden"
        >
          &bull;
        </span>
        <LettersSlip />
        <span aria-hidden="true" className="text-rule/55 xl:hidden">
          &bull;
        </span>
        <a
          href={`mailto:${profile.email}`}
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot xl:hidden"
        >
          {profile.email}
        </a>
        <span aria-hidden="true" className="text-rule/55 xl:hidden">
          &bull;
        </span>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot xl:hidden"
        >
          GitHub
        </a>
        <span aria-hidden="true" className="text-rule/55 xl:hidden">
          &bull;
        </span>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot xl:hidden"
        >
          LinkedIn
        </a>
        <span aria-hidden="true" className="text-rule/55 xl:hidden">
          &bull;
        </span>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot xl:hidden"
        >
          R&eacute;sum&eacute;
        </a>
        <span aria-hidden="true" className="text-rule/55">
          &bull;
        </span>
        <EditionToggle />
      </footer>
    </div>
  );
}

function RailFact({
  term,
  children,
}: {
  term: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-rule/20 py-[2px]">
      <dt className="font-cond text-[0.64rem] uppercase tracking-news text-faded">
        {term}
      </dt>
      <dd className="truncate font-cond text-[0.7rem] uppercase tracking-news">
        {children}
      </dd>
    </div>
  );
}
