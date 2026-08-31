import type { Metadata } from "next";
import { LettersDesk } from "@/components/contact/letters-desk";
import { Ornament, Rule } from "@/components/paper/primitives";
import { TearSheet } from "@/components/paper/tear-sheet";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Classifieds",
  description:
    "Situations wanted: hire a full-stack engineer in Surat. Email, telephone, GitHub, LinkedIn and a one-page résumé.",
};

const ads = [
  {
    head: "Engineer Available",
    body: "Full-stack. Backends that hold under load, interfaces that explain themselves, tests that run before anything ships.",
    cta: profile.email,
    href: `mailto:${profile.email}`,
  },
  {
    head: "Telephone Enquiries",
    body: "For urgent threads and contract discussions. Indian Standard Time, business hours, mostly.",
    cta: profile.phone,
    href: profile.phoneHref,
  },
  {
    head: "Source Code, Open",
    body: "Ledgers, agents, security audits and scaffolding, all published for inspection. Forks welcome.",
    cta: "github.com/BondeYash",
    href: profile.github,
  },
  {
    head: "Professional Notices",
    body: "Career history, endorsements, and the occasional long-form argument about static types.",
    cta: "LinkedIn",
    href: profile.linkedin,
  },
  {
    head: "Résumé, One Page",
    body: "The complete record of employment, schooling and honours, delivered as a PDF.",
    cta: "Collect a copy",
    href: profile.resumeUrl,
  },
  {
    head: "Previous Edition",
    body: "The earlier portfolio remains in circulation for readers who prefer the old typography.",
    cta: "Archive copy",
    href: profile.website,
  },
];

export default function ContactPage() {
  return (
    <TearSheet
      section="Classifieds"
      folio="A9"
      kicker="Classifieds · Page Nine"
      hed="Situations Wanted, Terms Negotiable"
      dek={`Based in ${profile.location}. Email is fastest; the telephone is for anything already on fire.`}
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="kicker">Display Advertisements</p>
          <Rule weight="thin" className="mt-1.5" />
          <div className="mt-4 cols-2 sm:columns-2">
            {ads.map((ad) => (
              <a
                key={ad.head}
                href={ad.href}
                target={
                  ad.href.startsWith("mailto:") || ad.href.startsWith("tel:")
                    ? undefined
                    : "_blank"
                }
                rel="noopener noreferrer"
                data-reveal
                className="col-break-avoid mb-3 block border border-rule/60 p-3 transition-colors hover:bg-stock"
              >
                <p className="font-cond text-[0.8rem] font-semibold uppercase tracking-news">
                  {ad.head}
                </p>
                <p className="prose-col mt-1 !text-left !text-[0.84rem]">
                  {ad.body}
                </p>
                <p className="mt-1.5 font-cond text-[0.74rem] uppercase tracking-wide text-spot">
                  {ad.cta} &rarr;
                </p>
              </a>
            ))}
          </div>
        </div>

        <div>
          <LettersDesk />

          <div className="boxed mt-5 p-4" data-reveal>
            <p className="kicker">Rate Card</p>
            <Rule weight="hair" className="mt-1.5" />
            <dl className="mt-2 space-y-1.5">
              {[
                ["Reply time", "Within one business day"],
                ["Working hours", "09:30 – 19:00 IST"],
                ["Preferred brief", "Problem first, stack second"],
                ["Notice period", "Negotiable"],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-3 border-b border-rule/25 pb-1"
                >
                  <dt className="slug">{term}</dt>
                  <dd className="font-cond text-[0.8rem] uppercase tracking-wide">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <Ornament className="mt-10" />
    </TearSheet>
  );
}
