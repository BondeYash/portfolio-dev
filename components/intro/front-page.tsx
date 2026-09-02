"use client";

import { paper, profile } from "@/data/profile";

/**
 * The sheet that lands on the lens. It is the same paper the site is set
 * in — masthead, rules, a stamped special edition — so when it opens the
 * reader is already looking at the publication, not at a splash screen.
 */
export function FrontPage({ printedOn }: { printedOn: string }) {
  return (
    <div className="fold-page">
      <div className="fold-rule-top" />
      <p className="fold-vol">
        Vol. I &middot; No. 1 &middot; {paper.city} &middot; {printedOn}
      </p>
      <h2 className="fold-masthead">The {paper.title.split(" ")[0]} Daily</h2>
      <div className="fold-rule-mid">
        <span>Special Edition</span>
      </div>
      <h3 className="fold-hed">
        Developer Ships
        <br />
        New Portfolio
      </h3>
      <p className="fold-dek">
        {profile.fullName}, {profile.role} &mdash; twelve pages, set in full and
        delivered by hand
      </p>
      <div className="fold-cols" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="fold-foot">{paper.motto}</p>
    </div>
  );
}
