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
 */
export function PaperSite({
  github,
  printedOn,
}: {
  github: GithubPayload;
  printedOn: string;
}) {
  const pages = useMemo(() => buildEditionPages(github), [github]);

  return (
    <div className="desk flex h-[100svh] min-h-0 w-full flex-col overflow-hidden">
      <Flipbook pages={pages} label={paper.title} fill syncHash />

      {/* ---- the imprint, set in agate under the paper ---- */}
      <footer className="no-print flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-0.5 px-3 pb-1.5 pt-1 text-center">
        <span className="font-cond text-[0.66rem] uppercase tracking-news text-faded">
          {paper.city} &middot; {printedOn}
        </span>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <span className="hidden font-cond text-[0.66rem] uppercase tracking-news text-faded lg:inline">
          Click the corner &middot; drag the sheet &middot; arrow keys turn
          pages
        </span>
        <span aria-hidden="true" className="hidden text-rule/40 lg:inline">
          &bull;
        </span>
        <LettersSlip />
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <a
          href={`mailto:${profile.email}`}
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot"
        >
          {profile.email}
        </a>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot"
        >
          GitHub
        </a>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot"
        >
          LinkedIn
        </a>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <a
          href={profile.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-cond text-[0.66rem] uppercase tracking-news hover:text-spot"
        >
          R&eacute;sum&eacute;
        </a>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <EditionToggle />
      </footer>
    </div>
  );
}
