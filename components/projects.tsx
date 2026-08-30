"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { formatUpdated } from "@/lib/format";
import { languageColor } from "@/lib/language-colors";
import type { GithubRepo } from "@/lib/types";

type ProjectsProps = {
  repos: GithubRepo[];
  source: "live" | "fallback";
};

export function Projects({ repos, source }: ProjectsProps) {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="Selected work"
            title="Repos that earned their keep — live from GitHub."
          />
        </Reveal>
        {source === "fallback" ? (
          <p className="mb-8 text-sm text-muted">
            Live GitHub data is temporarily unavailable. Showing cached
            highlights instead.
          </p>
        ) : null}
        <motion.ul
          initial={reduce ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 md:grid-cols-2"
        >
          {repos.map((repo, index) => (
            <motion.li
              key={repo.htmlUrl}
              initial={reduce ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : index * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <a
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-line/12 bg-panel p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/45 hover:shadow-glow"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-medium tracking-tight text-ink">
                    {repo.name}
                  </h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {repo.description ?? "No description provided."}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: languageColor(repo.language) }}
                      aria-hidden="true"
                    />
                    {repo.language ?? "Other"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only">Stars:</span>
                    {repo.stars}
                  </span>
                  <span>Updated {formatUpdated(repo.updatedAt)}</span>
                </div>
              </a>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
