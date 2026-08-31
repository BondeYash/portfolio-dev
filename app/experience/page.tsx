import type { Metadata } from "next";
import { Brief, PullQuote, Rule } from "@/components/paper/primitives";
import { TearSheet } from "@/components/paper/tear-sheet";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Business",
  description:
    "Career record: full-stack engineering at Empiric Infotech, Node.js services at Freshcodes, and Azure cloud training.",
};

export default function ExperiencePage() {
  return (
    <TearSheet
      section="Business"
      folio="A7"
      kicker="Business · Page Seven"
      hed="Postings, Assignments and the Work Between"
      dek="A short career, densely filed: healthcare AI, enterprise Node services, and the cloud fundamentals underneath."
    >
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-10">
        <ol className="space-y-6">
          {profile.experience.map((job, index) => (
            <li
              key={job.company}
              data-reveal
              className="col-break-avoid border-b-2 border-rule pb-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h2 className="hed text-2xl sm:text-3xl">{job.company}</h2>
                <p className="slug tabular">{job.duration}</p>
              </div>
              <p className="mt-1 font-cond text-[0.82rem] uppercase tracking-news text-spot">
                {job.role}
              </p>
              <p className="slug">{job.location}</p>
              <Rule weight="hair" className="my-2" />
              <div className="cols-2 sm:columns-1 lg:columns-2">
                {job.bullets.map((line) => (
                  <p key={line} className="prose-col mb-2">
                    {line}
                  </p>
                ))}
              </div>
              <p className="caption mt-2">
                Posting {String(index + 1).padStart(2, "0")} of{" "}
                {String(profile.experience.length).padStart(2, "0")}
              </p>
            </li>
          ))}
        </ol>

        <aside className="lg:vrule lg:pl-8">
          <PullQuote attribution={`${profile.fullName}`}>
            {profile.tagline}
          </PullQuote>

          <Brief head="Currently On Assignment" meta="Empiric Infotech · Surat">
            <p className="prose-col !text-left">
              Building an AI healthcare management application: client
              interactions, communication workflows, and the data model that has
              to keep both honest.
            </p>
          </Brief>

          <div className="mt-4" data-reveal>
            <p className="kicker">Schooling</p>
            <Rule weight="hair" className="mt-1.5" />
            <ul className="mt-2 space-y-2.5">
              {profile.education.map((item) => (
                <li key={item.school}>
                  <p className="font-cond text-[0.82rem] uppercase tracking-wide">
                    {item.school}
                  </p>
                  <p className="slug">
                    {item.duration} &middot; {item.detail}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </TearSheet>
  );
}
