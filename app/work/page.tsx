import type { Metadata } from "next";
import { Rule, SectionHead } from "@/components/paper/primitives";
import { TearSheet } from "@/components/paper/tear-sheet";
import { profile } from "@/data/profile";
import { formatUpdated } from "@/lib/format";
import { getGithubPortfolio } from "@/lib/github";
import { languageColor } from "@/lib/language-colors";

export const metadata: Metadata = {
  title: "Technology",
  description:
    "Selected systems: a RAG-grounded content agent, a multi-tenant banking core, a scaffolding platform, plus live repositories from GitHub.",
};

export const revalidate = 43200;

export default async function WorkPage() {
  const { profile: gh, repos, source } = await getGithubPortfolio();

  return (
    <TearSheet
      section="Technology"
      folio="A5"
      kicker="Technology · Page Five"
      hed="Built, Shipped, and Under Test"
      dek="Four flagship systems and an open board of public repositories, filed from the workbench."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {profile.projects.map((project, index) => (
          <article
            key={project.name}
            data-reveal
            className="col-break-avoid border-b-2 border-rule pb-5"
          >
            <p className="kicker">
              Project {String(index + 1).padStart(2, "0")} &middot;{" "}
              {project.period}
            </p>
            <h2 className="hed mt-1 text-2xl sm:text-3xl">{project.name}</h2>
            <Rule weight="thin" className="my-2" />
            <div className="cols-2 sm:columns-1 lg:columns-2">
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

      <section className="mt-10">
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
                <tr key={repo.name} className="border-b border-rule/30 align-top">
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
                        style={{ backgroundColor: languageColor(repo.language) }}
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
                  <td className="prose-col px-2 py-1.5 !text-left !text-[0.82rem]">
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
    </TearSheet>
  );
}
