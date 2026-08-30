"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { MeshBackground } from "@/components/mesh-background";
import { profile } from "@/data/profile";
import type { GithubProfile } from "@/lib/types";

type HeroProps = {
  github: GithubProfile;
};

export function Hero({ github }: HeroProps) {
  const reduce = useReducedMotion();
  const words = profile.tagline.split(" ");

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden px-5 pb-24 pt-10 sm:px-8 sm:pb-32 sm:pt-16"
    >
      <MeshBackground />
      <div className="relative mx-auto grid max-w-site gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
        <div>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 text-[11px] font-medium uppercase tracking-[0.32em] text-muted"
          >
            {profile.role} · {profile.location}
          </motion.p>
          <h1 className="max-w-4xl font-display text-[2.65rem] font-medium leading-[0.95] tracking-tightest text-ink sm:text-6xl md:text-7xl lg:text-[5.15rem]">
            {words.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="mr-[0.28em] inline-block"
                initial={reduce ? false : { opacity: 0, y: "0.55em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.08 + index * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          {/*
            Alternate headlines (swap profile.tagline in data/profile.ts):
            1. Interfaces people use. Contracts people trust.
            2. MERN in production. Solidity under pressure.
            3. Ships the product. Then audits the protocol.
            4. From Surat. Building software that doesn't flinch.
          */}
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
          >
            {profile.subheading}
          </motion.p>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-canvas transition-transform duration-300 ease-out hover:scale-[1.03]"
            >
              View Work
              <ArrowDownRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
              />
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-line/20 px-6 py-3 text-sm font-medium text-ink transition-all duration-300 ease-out hover:border-accent/60 hover:shadow-glow"
            >
              Get in Touch
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </motion.div>
        </div>
        <motion.aside
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-start lg:justify-end"
        >
          <div className="w-full max-w-xs rounded-2xl border border-line/12 bg-panel/70 p-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <Image
                src={github.avatarUrl}
                alt={`${github.name} GitHub avatar`}
                width={72}
                height={72}
                className="rounded-xl"
                priority
              />
              <div>
                <p className="font-display text-base font-medium tracking-tight">
                  {github.name}
                </p>
                <p className="text-sm text-muted">@{github.login}</p>
              </div>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line/10 pt-4 text-center">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  Followers
                </dt>
                <dd className="mt-1 font-display text-lg">{github.followers}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  Repos
                </dt>
                <dd className="mt-1 font-display text-lg">
                  {github.publicRepos}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-muted">
                  Base
                </dt>
                <dd className="mt-1 truncate font-display text-sm">
                  {github.location ?? profile.location}
                </dd>
              </div>
            </dl>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
