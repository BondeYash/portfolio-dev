import Link from "next/link";
import { Ornament, Rule } from "@/components/paper/primitives";
import { paper } from "@/data/profile";

export default function NotFound() {
  return (
    <div className="desk px-0 py-0 sm:px-6 sm:py-8">
      <article className="sheet mx-auto max-w-3xl px-5 py-10 text-center sm:px-10">
        <p className="slug">{paper.title}</p>
        <Rule weight="thick" className="mt-2" />
        <p className="kicker mt-5">Stop Press</p>
        <h1 className="hed mt-2 text-[clamp(2.2rem,7vw,4.2rem)]">
          This Page Never Made the Print Run
        </h1>
        <Rule weight="double" className="mt-4" />
        <p className="lede mx-auto mt-5 max-w-lg">
          The desk has checked the plates twice. Whatever you were looking for
          was either pulled before deadline or filed under a different folio.
        </p>
        <p className="stamp mt-3 text-faded">Error 404 &middot; Composing room</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="border-2 border-rule px-5 py-2 font-cond text-[0.78rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper"
          >
            Back to the front page
          </Link>
          <Link
            href="/#edition"
            className="border-2 border-rule px-5 py-2 font-cond text-[0.78rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper"
          >
            Open the bound edition &rarr;
          </Link>
        </div>

        <Ornament className="mt-10" />
      </article>
    </div>
  );
}
