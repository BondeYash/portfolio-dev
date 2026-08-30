"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/data/profile";

export function Experience() {
  const reduce = useReducedMotion();

  return (
    <section
      id="experience"
      className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-site">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="Experience"
            title="A short timeline. Update the placeholders in profile.ts."
          />
        </Reveal>
        <ol className="relative ml-3 border-l border-line/15 pl-8 sm:ml-4">
          {profile.experience.map((item, index) => (
            <motion.li
              key={`${item.company}-${item.duration}`}
              className="relative mb-14 last:mb-0"
              initial={reduce ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[2.4rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-canvas"
              />
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                {item.duration}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-tight">
                {item.role}
              </h3>
              <p className="mt-1 text-sm text-accent">{item.company}</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                {item.description}
              </p>
            </motion.li>
          ))}
        </ol>
        <Reveal delay={0.1}>
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {profile.education.map((item) => (
              <div
                key={`${item.school}-${item.year}`}
                className="rounded-2xl border border-line/12 bg-panel p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
                  Education · {item.year}
                </p>
                <h3 className="mt-3 font-display text-xl tracking-tight">
                  {item.degree}
                </h3>
                <p className="mt-1 text-muted">{item.school}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
