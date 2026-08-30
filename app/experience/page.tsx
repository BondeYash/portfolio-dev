import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "Experience",
  description: "Roles at Empiric Infotech, Freshcodes Technology, and Azure training.",
};

export default function ExperiencePage() {
  return (
    <PageShell>
      <PageIntro
        index="03"
        kicker="Experience"
        title="Product work, backend services, and a short detour through Azure."
        lede="Newest first. Each role is a different layer of the same habit: ship systems that can be operated."
      />
      <ol className="relative ml-2 border-l-2 border-accent/40 pl-8 sm:ml-3">
        {profile.experience.map((item, index) => (
          <li key={`${item.company}-${item.duration}`} className="relative mb-16 last:mb-0">
            <span
              aria-hidden="true"
              className={`absolute -left-[2.45rem] top-1.5 h-3 w-3 rounded-full ${
                index === 0 ? "bg-cyan" : index === 1 ? "bg-accent" : "bg-violet"
              }`}
            />
            <p className="type-label text-cyan">
              {item.duration}
            </p>
            <h2 className="type-card mt-2">{item.role}</h2>
            <p className="type-body mt-1 text-violet">
              {item.company} · {item.location}
            </p>
            <ul className="type-body mt-5 max-w-2xl space-y-3 rounded-2xl border border-accent/15 bg-panel/70 p-5 text-muted">
              {item.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </PageShell>
  );
}
