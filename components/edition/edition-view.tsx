"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Flipbook } from "@/components/edition/flipbook";
import { buildEditionPages } from "@/components/edition/pages";
import { Imprint } from "@/components/paper/imprint";
import { IndexStrip } from "@/components/paper/index-strip";
import { paper } from "@/data/profile";
import type { GithubPayload } from "@/lib/types";

export function EditionView({
  github,
  printedOn,
}: {
  github: GithubPayload;
  printedOn: string;
}) {
  const pages = useMemo(() => buildEditionPages(github), [github]);

  return (
    <div className="desk min-h-[100vh] px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-broadsheet">
        <header className="mb-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="slug hidden sm:block">
              {paper.volume} &middot; {paper.number}
            </p>
            <p className="slug misregister text-center">
              The Bound Edition &middot; Twelve Pages
            </p>
            <p className="slug hidden text-right sm:block tabular">
              {printedOn}
            </p>
          </div>
          <div className="rule-thin mt-1.5" />
          <p className="masthead select-none py-2 text-center text-[clamp(2rem,6.5vw,4.2rem)] leading-none">
            {paper.title}
          </p>
          <div className="rule-thin" />
          <p className="slug py-1 text-center">
            {paper.city} &middot; {paper.motto} &middot; Turn the pages by hand
          </p>
          <div className="rule-hair" />
          <IndexStrip compact />
          <div className="rule-thick" />
        </header>

        <Flipbook pages={pages} label="The bound edition" />

        <div className="no-print mt-6 text-center">
          <Link
            href="/"
            className="inline-block border-2 border-ink/60 px-4 py-1.5 font-cond text-[0.72rem] uppercase tracking-news text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            &larr; Back to the front page
          </Link>
        </div>

        <Imprint />
      </div>
    </div>
  );
}
