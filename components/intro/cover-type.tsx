"use client";

import { paper, profile } from "@/data/profile";

/**
 * The type struck onto the sheet once it fills the lens.
 *
 * The reel ends on a printed page, but a generic one. Setting the masthead
 * and the deck over it makes the sheet *this* paper, and the bands of stock
 * give the type something solid to sit on over busy newsprint.
 *
 * Rendered twice — once over the held video frame, once inside each half of
 * the sheet that opens — so the two are pixel-identical at the handoff.
 */
export function CoverType({ printedOn }: { printedOn: string }) {
  return (
    <div className="cover-type">
      <div className="cover-type-top">
        <div className="fold-rule-top" />
        <p className="fold-vol">
          Vol. I &middot; No. 1 &middot; {paper.city} &middot; {printedOn}
        </p>
        <h2 className="fold-masthead">The {paper.title.split(" ")[0]} Daily</h2>
        <div className="fold-rule-mid">
          <span>Special Edition</span>
        </div>
      </div>

      <div className="cover-type-foot">
        <h3 className="fold-hed">
          Developer Ships
          <br />
          New Portfolio
        </h3>
        <p className="fold-dek">
          {profile.fullName}, {profile.role} &mdash; twelve pages, set in full
          and delivered by hand
        </p>
      </div>

      <span className="fold-stamp">Delivered</span>
    </div>
  );
}
