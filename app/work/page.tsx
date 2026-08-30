import type { Metadata } from "next";
import { ArrowUpRight, Star } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { profile } from "@/data/profile";
import { formatUpdated } from "@/lib/format";
import { getGithubPortfolio } from "@/lib/github";
import { languageColor } from "@/lib/language-colors";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected systems: LinkedIn automation, multi-tenant banking, developer scaffolding, plus live GitHub repositories.",
};

export default async function WorkPage() {
  const github = await getGithubPortfolio();

  return (
    <PageShell>
      <PageIntro
        index="02"
        kicker="Work"
        title="Selected systems, then the public trail on GitHub."
        lede="The first set is from the résumé: agents, ledgers, and scaffolding. Below that, live repositories ranked by stars."
      />
      <section>
        <h2 className="type-label text-accent">
          Featured
        </h2>
        <ul className="mt-8 space-y-6">
          {profile.projects.map((project, index) => (
            <li
              key={project.name}
              className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow sm:p-8 ${
                index % 2 === 0
                  ? "border-accent/30 bg-accent/10"
                  : "border-cyan/30 bg-cyan/10"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="type-card">{project.name}</h3>
                <p className="type-label text-violet">
                  {project.period}
                </p>
              </div>
              <p className="type-body mt-3 text-accent">{project.stack}</p>
              <ul className="type-body mt-5 space-y-3 text-muted">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-20">
        <h2 className="type-label text-cyan">
          Open source
        </h2>
        {github.source === "fallback" ? (
          <p className="type-body mt-4 text-muted">
            Live GitHub data is temporarily unavailable. Showing cached
            highlights instead.
          </p>
        ) : null}
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {github.repos.map((repo) => (
            <li key={repo.htmlUrl}>
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-violet/25 bg-panel/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/50 hover:shadow-glow"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="type-card">{repo.name}</h3>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>
                <p className="type-body mt-3 flex-1 text-muted">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="type-label mt-5 flex flex-wrap items-center gap-4 text-muted">
                  <span className="inline-flex items-center gap-1.5 normal-case tracking-normal">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: languageColor(repo.language) }}
                      aria-hidden="true"
                    />
                    {repo.language ?? "Other"}
                  </span>
                  <span className="inline-flex items-center gap-1 normal-case tracking-normal">
                    <Star size={12} aria-hidden="true" />
                    {repo.stars}
                  </span>
                  <span className="normal-case tracking-normal">
                    Updated {formatUpdated(repo.updatedAt)}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
