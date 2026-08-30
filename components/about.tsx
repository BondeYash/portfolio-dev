"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/data/profile";

export function About() {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="About"
            title="MERN in the browser. Foundry when the chain has something to prove."
          />
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <Reveal delay={0.08}>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {profile.bio}
            </p>
          </Reveal>
          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ staggerChildren: reduce ? 0 : 0.04 }}
            className="flex flex-wrap gap-2"
          >
            {profile.skills.map((skill) => (
              <motion.li
                key={skill}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-full border border-line/15 bg-panel px-3.5 py-1.5 text-[13px] text-ink transition-colors hover:border-accent/50"
              >
                {skill}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
