import { profile } from "@/data/profile";

const arrows = ["▲", "▼"] as const;

/** Skills, priced like securities. Pure CSS marquee: cheap and smooth. */
export function Ticker() {
  const items = profile.skillGroups.flatMap((group) =>
    group.items.map((item, index) => ({
      symbol: item,
      up: (item.length + index) % 3 !== 0,
      move: (((item.length * 7 + index * 13) % 480) / 100 + 0.12).toFixed(2),
    })),
  );

  const strip = (
    <div className="ticker-track">
      {items.map((item, index) => (
        <span
          key={`${item.symbol}-${index}`}
          className="flex items-center gap-1.5 whitespace-nowrap px-4 font-cond text-[0.78rem] uppercase tracking-wide"
        >
          <span className="font-semibold">{item.symbol}</span>
          <span className={item.up ? "text-spot" : "text-faded"}>
            {item.up ? arrows[0] : arrows[1]}
            <span className="tabular"> {item.move}</span>
          </span>
          <span aria-hidden="true" className="pl-3 text-rule/40">
            |
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="group relative overflow-hidden border-y-2 border-rule bg-stock/70 py-1.5"
      aria-label="Skill index"
    >
      <div className="flex w-max animate-ticker group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {strip}
        <div aria-hidden="true" className="contents">
          {strip}
        </div>
      </div>
    </div>
  );
}
