"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HeroVideo } from "@/components/hero-video";
import { profile } from "@/data/profile";

function wordClass(word: string) {
  const clean = word.replace(/[.,]/g, "").toLowerCase();
  if (clean === "404s") return "text-accent italic";
  if (clean === "loading" || clean === "spinner") return "text-cyan italic";
  if (clean === "internet") return "text-violet";
  return "text-ink";
}

export function HomeView() {
  const reduce = useReducedMotion();
  const words = profile.tagline.split(" ");
  const highlightSkills = [
    ...profile.skillGroups[0].items,
    ...profile.skillGroups[1].items.slice(0, 5),
    ...profile.skillGroups[2].items,
  ];

  return (
    <>
      <section className="relative isolate min-h-[92vh] overflow-hidden">
        <HeroVideo />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(var(--accent)/0.18),transparent_42%),radial-gradient(circle_at_90%_80%,rgb(var(--cyan)/0.12),transparent_40%)]"
        />
        <div className="relative mx-auto flex min-h-[92vh] max-w-site flex-col justify-end px-5 pb-16 pt-20 sm:px-8 sm:pb-24">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="type-label text-cyan"
          >
            {profile.role} · {profile.location}
          </motion.p>
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="type-hero mt-4 text-ink"
          >
            {profile.name}
          </motion.h1>
          <h2 className="mt-8 max-w-4xl font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className={`mr-[0.28em] inline-block ${wordClass(word)}`}
                initial={reduce ? false : { opacity: 0, y: "0.45em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.15 + index * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65 }}
            className="type-lede mt-8 max-w-3xl text-muted"
          >
            {profile.subheading}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Link
              href="/work"
              className="type-btn rounded-full bg-accent px-6 py-3 text-white transition-transform hover:scale-[1.03]"
            >
              See the work
            </Link>
            <Link
              href="/contact"
              className="type-btn rounded-full border border-accent/40 px-6 py-3 text-ink transition-colors hover:border-cyan hover:text-cyan"
            >
              Get in touch
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-accent/20 blur-[90px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-80 h-64 w-64 rounded-full bg-violet/20 blur-[80px]"
        />
        <div className="relative mx-auto max-w-site space-y-24 px-5 py-20 sm:px-8 sm:py-28">
          <section>
            <p className="type-label text-cyan">
              01 / Snapshot
            </p>
            <h2 className="type-section mt-3">
              Who I am
            </h2>
            <p className="type-lede mt-6 max-w-3xl text-muted">
              {profile.bio}
            </p>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-label text-accent">
                  02 / Work done
                </p>
                <h2 className="type-section mt-3">
                  Project summary
                </h2>
              </div>
              <Link
                href="/work"
                className="type-label inline-flex items-center gap-1 text-cyan"
              >
                Full case notes <ArrowUpRight size={14} />
              </Link>
            </div>
            <ul className="mt-10 grid gap-5 lg:grid-cols-2">
              {profile.projects.map((project) => (
                <li
                  key={project.name}
                  className="rounded-2xl border border-accent/20 bg-accent/10 p-6 sm:p-8"
                >
                  <p className="type-label text-violet">
                    {project.period}
                  </p>
                  <h3 className="type-card mt-2">
                    {project.name}
                  </h3>
                  <p className="type-body mt-3 text-cyan">{project.stack}</p>
                  <p className="type-body mt-4 text-muted">
                    {project.bullets[0]}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-label text-violet">
                  03 / Experience
                </p>
                <h2 className="type-section mt-3">
                  Roles in brief
                </h2>
              </div>
              <Link
                href="/experience"
                className="type-label inline-flex items-center gap-1 text-cyan"
              >
                Timeline <ArrowUpRight size={14} />
              </Link>
            </div>
            <ol className="mt-10 space-y-5">
              {profile.experience.map((item) => (
                <li
                  key={`${item.company}-${item.duration}`}
                  className="rounded-2xl border border-cyan/20 bg-panel/80 p-6 sm:p-8"
                >
                  <p className="type-label text-cyan">
                    {item.duration}
                  </p>
                  <h3 className="type-card mt-2">
                    {item.role}
                  </h3>
                  <p className="type-body mt-1 text-violet">
                    {item.company} · {item.location}
                  </p>
                  <p className="type-body mt-4 max-w-3xl text-muted">
                    {item.bullets[0]}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="type-label text-cyan">
                04 / Education
              </p>
              <h2 className="type-section mt-3">Education</h2>
              <ul className="mt-8 space-y-4">
                {profile.education.map((item) => (
                  <li
                    key={item.school}
                    className="rounded-2xl border border-accent/15 bg-panel/80 p-5"
                  >
                    <p className="type-label text-cyan">
                      {item.duration}
                    </p>
                    <h3 className="type-card mt-2">{item.school}</h3>
                    <p className="type-body mt-1 text-muted">
                      {item.degree}. {item.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="type-label text-violet">
                05 / Stack
              </p>
              <h2 className="type-section mt-3">Skills I use</h2>
              <ul className="mt-8 flex flex-wrap gap-2">
                {highlightSkills.map((skill) => (
                  <li
                    key={skill}
                    className="type-body rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-ink"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="type-label mt-6 inline-flex items-center gap-1 text-cyan"
              >
                Certifications and full skill list <ArrowUpRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
