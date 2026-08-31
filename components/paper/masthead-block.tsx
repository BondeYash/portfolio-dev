import { IndexStrip } from "@/components/paper/index-strip";
import { paper } from "@/data/profile";
import { printedOn } from "@/lib/press";

/** The printed identity block: folio line, masthead, dateline, index. */
export function MastheadBlock({
  edition = "Late City Edition",
  size = "full",
}: {
  edition?: string;
  size?: "full" | "small";
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className="slug hidden sm:block">
          {paper.volume} &middot; {paper.number}
        </p>
        <p className="slug misregister text-center">{edition}</p>
        <p className="slug hidden text-right sm:block">{paper.price}</p>
      </div>

      <div className="rule-thin mt-1.5" />

      <p
        className={`masthead select-none py-2 text-center leading-none ${
          size === "full"
            ? "text-[clamp(2.4rem,9vw,6.5rem)]"
            : "text-[clamp(1.9rem,6vw,3.6rem)]"
        }`}
      >
        {paper.title}
      </p>

      <div className="rule-thin" />

      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1.5 text-center">
        <p className="slug">{paper.city}</p>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <p className="slug tabular">{printedOn()}</p>
        <span aria-hidden="true" className="text-rule/40">
          &bull;
        </span>
        <p className="slug italic">{paper.motto}</p>
      </div>

      <div className="rule-hair" />
      <IndexStrip />
      <div className="rule-thick" />
    </div>
  );
}
