"use client";

import Link from "next/link";
import { useRef } from "react";
import { LeadArt } from "@/components/front/lead-art";
import { Imprint } from "@/components/paper/imprint";
import { IndexStrip } from "@/components/paper/index-strip";
import {
  Brief,
  Byline,
  Dateline,
  Folio,
  Jump,
  Kicker,
  Ornament,
  PullQuote,
  Rule,
  SectionHead,
} from "@/components/paper/primitives";
import { Ticker } from "@/components/paper/ticker";
import { paper, profile } from "@/data/profile";
import { formatUpdated } from "@/lib/format";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { languageColor } from "@/lib/language-colors";
import type { GithubPayload } from "@/lib/types";

const MASTHEAD_TEXT = paper.title;

const LEAD_HED = [
  "Engineer",
  "Ships",
  "Systems",
  "That",
  "Hold",
  "Under",
  "Load",
];

export function FrontPage({
  github,
  printedOn,
}: {
  github: GithubPayload;
  printedOn: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");

      if (reduced) {
        gsap.set(reveals, { opacity: 1, y: 0 });
        return;
      }

      /* --- the press run: masthead struck onto the sheet --------- */
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .from("[data-sheet]", {
          yPercent: -1.5,
          opacity: 0,
          duration: 0.8,
        })
        .from(
          "[data-mast-char]",
          {
            yPercent: 120,
            rotateX: -75,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.9,
            stagger: 0.028,
          },
          "-=0.45",
        )
        .from(
          "[data-rule]",
          { scaleX: 0, transformOrigin: "left center", duration: 0.7, stagger: 0.06 },
          "-=0.6",
        )
        .from(
          "[data-hed-word]",
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.75,
            stagger: 0.045,
          },
          "-=0.45",
        )
        .from(
          "[data-lead-meta]",
          { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 },
          "-=0.4",
        );

      /* --- masthead sinks into the gutter as you read on --------- */
      gsap.to("[data-mast]", {
        yPercent: 26,
        opacity: 0.28,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      /* --- halftone screen coarsens as the sheet moves ----------- */
      gsap.utils.toArray<HTMLElement>("[data-halftone]").forEach((art) => {
        gsap.fromTo(
          art,
          { "--dot": "2.6px" },
          {
            "--dot": "6.5px",
            ease: "none",
            scrollTrigger: {
              trigger: art,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      });

      /* --- every band below the fold unfolds on approach -------- */
      gsap.utils.toArray<HTMLElement>("[data-unfold]").forEach((band) => {
        gsap.fromTo(
          band,
          { rotateX: -34, transformOrigin: "50% 0%", opacity: 0.35 },
          {
            rotateX: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: band,
              start: "top 96%",
              end: "top 52%",
              scrub: 0.5,
            },
          },
        );
      });

      /* --- column copy arrives like ink drying ------------------ */
      gsap.set(reveals, { opacity: 0, y: 20, filter: "blur(5px)" });
      ScrollTrigger.batch(reveals, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.06,
            overwrite: true,
          }),
      });

      /* --- section rules draw themselves ------------------------ */
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: line, start: "top 92%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const { profile: gh, repos, source } = github;

  return (
    <div ref={root} className="desk px-0 py-0 sm:px-6 sm:py-8">
      <article
        data-sheet
        className="sheet mx-auto max-w-broadsheet px-4 py-6 sm:px-8 sm:py-10"
      >
        {/* ============ MASTHEAD ============ */}
        <div data-hero>
          <div className="flex items-center justify-between gap-3">
            <p className="slug hidden sm:block">
              {paper.volume} &middot; {paper.number}
            </p>
            <p className="slug text-center">
              <span className="misregister">Late City Edition</span>
            </p>
            <p className="slug hidden text-right sm:block">{paper.price}</p>
          </div>

          <div data-rule className="rule-thin mt-2" />

          <h1
            data-mast
            className="masthead select-none py-3 text-center text-[clamp(2.5rem,10.5vw,8rem)] leading-none"
            aria-label={paper.title}
          >
            <span aria-hidden="true" className="inline-block [perspective:600px]">
              {MASTHEAD_TEXT.split("").map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  data-mast-char
                  className="inline-block whitespace-pre will-change-transform"
                >
                  {char}
                </span>
              ))}
            </span>
          </h1>

          <div data-rule className="rule-thin" />

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-1.5 text-center">
            <p className="slug">{paper.city}</p>
            <span aria-hidden="true" className="text-rule/40">
              &bull;
            </span>
            <p className="slug tabular">{printedOn}</p>
            <span aria-hidden="true" className="text-rule/40">
              &bull;
            </span>
            <p className="slug italic">{paper.motto}</p>
          </div>

          <div data-rule className="rule-hair" />
          <IndexStrip />
          <div data-rule className="rule-thick" />

          <div className="-mx-4 sm:-mx-8">
            <Ticker />
          </div>

          {/* ============ LEAD STORY ============ */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_17rem] lg:gap-8">
            <div>
              <div className="text-center">
                <Kicker>Technology &middot; Page One &middot; Exclusive</Kicker>
                <h2 className="hed mt-1.5 text-[clamp(2rem,6.2vw,4.4rem)]">
                  <span
                    aria-hidden="true"
                    className="block overflow-hidden [perspective:800px]"
                  >
                    {LEAD_HED.map((word) => (
                      <span
                        key={word}
                        className="inline-block overflow-hidden align-bottom"
                      >
                        <span
                          data-hed-word
                          className="inline-block will-change-transform"
                        >
                          {word}
                          &nbsp;
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="sr-only">
                    Engineer ships systems that hold under load
                  </span>
                </h2>
                <p data-lead-meta className="dek mx-auto mt-3 max-w-2xl">
                  {profile.subheading}
                </p>
                <div data-lead-meta>
                  <Byline credit={profile.fullName} wire={paper.wire} />
                </div>
                <div data-rule className="rule-double mt-3" />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-[15rem_1fr] sm:gap-6">
                <LeadArt
                  src={gh.avatarUrl}
                  alt={`${profile.fullName}, photographed for Yash Times`}
                  caption={`${profile.fullName}, ${profile.role}, at the terminal in ${paper.city}.`}
                  credit="Photo: Wire service"
                  priority
                  className="sm:pt-1"
                />

                <div className="cols-2 sm:columns-1 lg:columns-2">
                  <p className="prose-col dropcap" data-reveal>
                    <Dateline city={paper.city}>
                      A developer with a preference for systems that stay
                      coherent under pressure has spent the year turning
                      healthcare workflows, banking ledgers and retrieval
                      pipelines into software that survives contact with real
                      users.
                    </Dateline>
                  </p>
                  <p className="prose-col" data-reveal>
                    {profile.bio}
                  </p>
                  <PullQuote attribution={`${profile.fullName}, on the record`}>
                    {profile.tagline}
                  </PullQuote>
                  <p className="prose-col" data-reveal>
                    Current assignment: an AI healthcare management product at
                    Empiric Infotech, organising client interactions and the
                    communication workflows around them. Earlier this year the
                    same engineer maintained Node.js and TypeScript services at
                    Freshcodes Technology, where microservice components and
                    deployment automation were the daily beat.
                  </p>
                  <p className="prose-col" data-reveal>
                    The portfolio runs to {gh.publicRepos} public repositories
                    and includes a double-entry banking core in Spring Boot, a
                    RAG-grounded content agent in FastAPI, and a scaffolding
                    platform carrying 98.5 per cent core coverage. Tests, the
                    engineer notes, are not decoration.
                  </p>
                  <p className="prose-col" data-reveal>
                    Readers are directed to the full edition, where the record
                    is set out page by page and may be turned by hand.
                  </p>
                  <Jump to="The Edition, Page A2" />
                </div>
              </div>
            </div>

            {/* ---------- right rail ---------- */}
            <aside className="lg:vrule lg:pl-6">
              <div className="boxed p-3" data-reveal>
                <p className="kicker">Inside Today&rsquo;s Edition</p>
                <Rule weight="hair" className="mt-1.5" />
                <ol className="mt-2 space-y-1.5">
                  {[
                    ["A2", "The Profile", "/edition"],
                    ["A3", "Schooling & Honours", "/about"],
                    ["A5", "Technology & Projects", "/work"],
                    ["A7", "Business & Career", "/experience"],
                    ["A8", "Markets: Repositories", "/work"],
                    ["A9", "Classifieds: Hire", "/contact"],
                  ].map(([folio, label, href]) => (
                    <li key={folio}>
                      <Link
                        href={href}
                        className="flex items-baseline justify-between gap-2 font-cond text-[0.76rem] uppercase tracking-wide hover:text-spot"
                      >
                        <span>{label}</span>
                        <span className="slug tabular">{folio}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-4 boxed p-3" data-reveal>
                <p className="kicker">Weather, Surat</p>
                <Rule weight="hair" className="mt-1.5" />
                <p className="mt-2 font-hed text-3xl font-black leading-none">
                  200 <span className="text-base font-normal italic">OK</span>
                </p>
                <p className="prose-col mt-1.5 !text-left !text-[0.86rem]">
                  Clear skies, light latency. Ninety per cent chance of deploys
                  after 18:00 IST. Cold front of code review moving in from the
                  north.
                </p>
              </div>

              <div className="mt-4 boxed p-3" data-reveal>
                <p className="kicker">Corrections</p>
                <Rule weight="hair" className="mt-1.5" />
                <p className="prose-col mt-2 !text-left !text-[0.82rem]">
                  An earlier build of this developer declared variables with{" "}
                  <code className="font-type">var</code>. The error has been
                  refactored and the reducer regrets it.
                </p>
              </div>

              <Link
                href="/edition"
                data-reveal
                className="group mt-4 block border-4 border-double border-rule p-3 text-center transition-colors hover:bg-ink hover:text-paper"
              >
                <p className="kicker group-hover:text-paper">House Advertisement</p>
                <p className="masthead mt-1.5 text-2xl leading-none">
                  Turn the Page
                </p>
                <p className="mt-1.5 font-cond text-[0.7rem] uppercase tracking-news">
                  The full edition, bound &amp; turnable
                </p>
                <p className="mt-1 font-hed text-lg italic">
                  Open A2 &rarr;
                </p>
              </Link>
            </aside>
          </div>
        </div>

        {/* ============ THE FOLD ============ */}
        <div className="my-8 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 border-t-2 border-dashed border-rule/50" />
          <span className="stamp text-faded">Fold</span>
          <span className="h-px flex-1 border-t-2 border-dashed border-rule/50" />
        </div>

        {/* ============ BELOW THE FOLD ============ */}
        <div className="[perspective:1400px]">
          {/* -------- BUSINESS -------- */}
          <section data-unfold className="mb-10">
            <SectionHead label="Business" folio="A7" note="Career desk" />
            <div className="grid gap-4 md:grid-cols-3">
              {profile.experience.map((job) => (
                <Brief
                  key={job.company}
                  head={job.company}
                  meta={`${job.role} · ${job.duration}`}
                >
                  <p className="slug mb-1.5">{job.location}</p>
                  <ul className="space-y-1.5">
                    {job.bullets.map((line) => (
                      <li key={line} className="prose-col !text-[0.88rem]">
                        {line}
                      </li>
                    ))}
                  </ul>
                </Brief>
              ))}
            </div>
          </section>

          {/* -------- TECHNOLOGY -------- */}
          <section data-unfold className="mb-10">
            <SectionHead
              label="Technology"
              folio="A5"
              note="Filed from the workbench"
            />
            <div className="grid gap-5 md:grid-cols-2">
              {profile.projects.map((project, index) => (
                <article
                  key={project.name}
                  data-reveal
                  className="col-break-avoid border-b-2 border-rule pb-4"
                >
                  <p className="kicker">
                    Project {String(index + 1).padStart(2, "0")} &middot;{" "}
                    {project.period}
                  </p>
                  <h3 className="hed mt-1 text-2xl sm:text-3xl">
                    {project.name}
                  </h3>
                  <div data-draw className="rule-thin my-2" />
                  <div className="cols-2">
                    {project.bullets.map((line) => (
                      <p key={line} className="prose-col mb-2">
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className="caption mt-2">Filed under: {project.stack}</p>
                </article>
              ))}
            </div>
          </section>

          {/* -------- MARKETS -------- */}
          <section data-unfold className="mb-10">
            <SectionHead
              label="Markets"
              folio="A8"
              note={
                source === "live"
                  ? "Repositories · live from GitHub"
                  : "Repositories · last filed close"
              }
            />
            <div className="overflow-x-auto" data-reveal>
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">
                  Public repositories by stars and last update
                </caption>
                <thead>
                  <tr className="border-b-2 border-rule">
                    {["Issue", "Sector", "Stars", "Last trade", "Note"].map(
                      (head) => (
                        <th
                          key={head}
                          scope="col"
                          className="px-2 py-1.5 font-cond text-[0.68rem] uppercase tracking-news"
                        >
                          {head}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => (
                    <tr
                      key={repo.name}
                      className="border-b border-rule/30 align-top"
                    >
                      <th scope="row" className="px-2 py-1.5 font-normal">
                        <a
                          href={repo.htmlUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-news font-cond text-[0.86rem] font-medium uppercase tracking-wide"
                        >
                          {repo.name}
                        </a>
                      </th>
                      <td className="px-2 py-1.5">
                        <span className="inline-flex items-center gap-1.5 font-cond text-[0.76rem] uppercase tracking-wide">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2 w-2 rounded-full ring-1 ring-rule/60"
                            style={{
                              backgroundColor: languageColor(repo.language),
                            }}
                          />
                          {repo.language ?? "Mixed"}
                        </span>
                      </td>
                      <td className="tabular px-2 py-1.5 font-cond text-[0.82rem]">
                        <span className="text-spot">&#9650;</span> {repo.stars}
                      </td>
                      <td className="tabular px-2 py-1.5 font-cond text-[0.78rem] uppercase text-faded">
                        {formatUpdated(repo.updatedAt)}
                      </td>
                      <td className="px-2 py-1.5 prose-col !text-left !text-[0.82rem]">
                        {repo.description ?? "No prospectus filed."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="caption mt-2">
              Index compiled from {gh.publicRepos} public repositories &middot;{" "}
              {gh.followers} subscribers &middot;{" "}
              {source === "live" ? "live wire" : "cached tape"}
            </p>
          </section>

          {/* -------- EDUCATION + HONOURS -------- */}
          <section data-unfold className="mb-10">
            <SectionHead label="Schooling &amp; Honours" folio="A3" />
            <div className="grid gap-5 md:grid-cols-2">
              <div data-reveal>
                <p className="kicker">The Record</p>
                <div data-draw className="rule-thin my-2" />
                <ul className="space-y-3">
                  {profile.education.map((item) => (
                    <li key={item.school} className="col-break-avoid">
                      <h3 className="hed text-xl">{item.school}</h3>
                      <p className="slug mt-0.5">
                        {item.duration} &middot; {item.location}
                      </p>
                      <p className="prose-col mt-1 !text-left">
                        {item.degree}. {item.detail}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div data-reveal>
                <p className="kicker">Honours &amp; Certifications</p>
                <div data-draw className="rule-thin my-2" />
                <ul className="cols-2 sm:columns-1">
                  {profile.certifications.map((item) => (
                    <li
                      key={item}
                      className="prose-col col-break-avoid mb-2 !text-left !text-[0.86rem]"
                    >
                      <span aria-hidden="true" className="text-spot">
                        &#9670;{" "}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* -------- CLASSIFIEDS -------- */}
          <section data-unfold className="mb-6">
            <SectionHead
              label="Classifieds"
              folio="A9"
              note="Situations wanted"
            />
            <div className="cols-2 lg:columns-4">
              {[
                {
                  head: "Engineer Available",
                  body: `Full-stack, ${profile.location}. Node, Spring Boot, Next.js, FastAPI. Ships with tests. Enquire within.`,
                  href: `mailto:${profile.email}`,
                  cta: profile.email,
                },
                {
                  head: "Résumé, One Page",
                  body: "Complete record of employment, schooling and honours. Delivered as PDF, no subscription required.",
                  href: profile.resumeUrl,
                  cta: "Collect a copy",
                },
                {
                  head: "Source Code",
                  body: "Repositories open for inspection. Audits, ledgers, agents and scaffolding. Forks welcome.",
                  href: profile.github,
                  cta: "github.com/BondeYash",
                },
                {
                  head: "Correspondence",
                  body: "Letters to the editor, contract enquiries and long-form arguments about type systems.",
                  href: profile.linkedin,
                  cta: "LinkedIn",
                },
              ].map((ad) => (
                <a
                  key={ad.head}
                  href={ad.href}
                  target={ad.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  data-reveal
                  className="col-break-avoid mb-3 block border border-rule/60 p-2.5 transition-colors hover:bg-stock"
                >
                  <p className="font-cond text-[0.78rem] font-semibold uppercase tracking-news">
                    {ad.head}
                  </p>
                  <p className="prose-col mt-1 !text-left !text-[0.8rem]">
                    {ad.body}
                  </p>
                  <p className="mt-1.5 font-cond text-[0.72rem] uppercase tracking-wide text-spot">
                    {ad.cta} &rarr;
                  </p>
                </a>
              ))}
            </div>
          </section>

          <Ornament className="my-6" />

          <div className="text-center" data-reveal>
            <p className="slug">End of the front page</p>
            <Link
              href="/edition"
              className="mt-2 inline-block border-2 border-rule px-5 py-2 font-cond text-[0.8rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper"
            >
              Continue to the full edition &rarr;
            </Link>
          </div>
        </div>

        <Imprint />
        <Folio page="A1" section="Front Page" className="mt-4" />
      </article>
    </div>
  );
}
