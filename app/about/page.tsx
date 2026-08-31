import type { Metadata } from "next";
import Image from "next/image";
import { Brief, PullQuote, Rule } from "@/components/paper/primitives";
import { TearSheet } from "@/components/paper/tear-sheet";
import { profile } from "@/data/profile";
import { getGithubPortfolio } from "@/lib/github";

export const metadata: Metadata = {
  title: "Profile",
  description: profile.bio,
};

export const revalidate = 43200;

export default async function AboutPage() {
  const { profile: gh } = await getGithubPortfolio();

  return (
    <TearSheet
      section="Profile"
      folio="A3"
      kicker="The Profile · Page Three"
      hed="A Developer Who Tests His Own Ledgers"
      dek={profile.subheading}
    >
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:gap-8">
        <figure data-reveal className="col-break-avoid">
          <div className="halftone relative aspect-[3/4] w-full overflow-hidden border-2 border-rule">
            <Image
              src={gh.avatarUrl}
              alt={profile.fullName}
              fill
              sizes="(min-width: 1024px) 15rem, 60vw"
              className="object-cover"
            />
          </div>
          <figcaption className="caption mt-1.5">
            {profile.fullName}, {profile.role}, {profile.location}.
          </figcaption>
        </figure>

        <div>
          <div className="cols-2">
            <p className="prose-col dropcap" data-reveal>
              {profile.bio}
            </p>
            <PullQuote attribution={`${profile.fullName}, on the record`}>
              {profile.tagline}
            </PullQuote>
            <p className="prose-col" data-reveal>
              The through-line across his work is a preference for systems that
              stay coherent under load: immutable ledgers, deterministic lock
              ordering, retrieval pipelines with fact-check gates, and test
              suites that run before anything reaches a user.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <p className="kicker">Schooling</p>
        <Rule weight="thin" className="mt-1.5" />
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {profile.education.map((item) => (
            <Brief
              key={item.school}
              head={item.school}
              meta={`${item.duration} · ${item.location}`}
            >
              <p className="prose-col !text-left">{item.degree}.</p>
              <p className="mt-1.5 font-cond text-[0.76rem] uppercase tracking-news text-spot">
                {item.detail}
              </p>
            </Brief>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <p className="kicker">Honours &amp; Certifications</p>
        <Rule weight="thin" className="mt-1.5" />
        <ul className="mt-4 cols-2 lg:columns-3">
          {profile.certifications.map((item) => (
            <li
              key={item}
              data-reveal
              className="prose-col col-break-avoid mb-2 !text-left"
            >
              <span aria-hidden="true" className="text-spot">
                &#9670;{" "}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <p className="kicker">The Type Case</p>
        <Rule weight="thin" className="mt-1.5" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profile.skillGroups.map((group) => (
            <article
              key={group.label}
              data-reveal
              className="col-break-avoid border-b-2 border-rule pb-3"
            >
              <h3 className="font-cond text-sm font-semibold uppercase tracking-news">
                {group.label}
              </h3>
              <p className="prose-col mt-1.5 !text-left !text-[0.9rem]">
                {group.items.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>
    </TearSheet>
  );
}
