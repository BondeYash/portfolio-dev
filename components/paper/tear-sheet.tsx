import { Imprint } from "@/components/paper/imprint";
import { MastheadBlock } from "@/components/paper/masthead-block";
import { Byline, Folio, Rule } from "@/components/paper/primitives";
import { RevealScope } from "@/components/paper/reveal";
import { paper, profile } from "@/data/profile";

/** A single sheet torn from the paper: one section, printed on its own. */
export function TearSheet({
  section,
  folio,
  kicker,
  hed,
  dek,
  children,
}: {
  section: string;
  folio: string;
  kicker: string;
  hed: string;
  dek?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="desk px-0 py-0 sm:px-6 sm:py-8">
      <article className="sheet mx-auto max-w-broadsheet px-4 py-6 sm:px-8 sm:py-10">
        <MastheadBlock size="small" edition={`${section} · ${folio}`} />

        <header className="py-5 text-center">
          <p className="kicker">{kicker}</p>
          <h1 className="hed mt-1.5 text-[clamp(1.9rem,5.4vw,3.6rem)]">{hed}</h1>
          {dek ? <p className="dek mx-auto mt-3 max-w-2xl">{dek}</p> : null}
          <Byline credit={profile.fullName} wire={paper.wire} />
        </header>
        <Rule weight="double" />

        <RevealScope className="mt-6">{children}</RevealScope>

        <Imprint />
        <Folio page={folio} section={section} className="mt-4" />
      </article>
    </div>
  );
}
