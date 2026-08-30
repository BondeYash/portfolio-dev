import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: "About",
  description: profile.bio,
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro
        index="01"
        kicker="About"
        title="Full-stack developer who likes systems that stay honest."
        lede={profile.bio}
      />
      <section className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="type-label text-cyan">
            Education
          </h2>
          <ul className="mt-6 space-y-8">
            {profile.education.map((item) => (
              <li key={item.school} className="rounded-2xl border border-accent/15 bg-panel/80 p-5">
                <p className="type-label text-cyan">
                  {item.duration} · {item.location}
                </p>
                <h3 className="type-card mt-2 leading-snug">
                  {item.school}
                </h3>
                <p className="type-body mt-2 text-muted">
                  {item.degree}. {item.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="type-label text-violet">
            Recognition
          </h2>
          <ul className="mt-6 space-y-3">
            {profile.certifications.map((item) => (
              <li
                key={item}
                className="type-body rounded-xl border border-violet/20 bg-violet/10 px-4 py-3 text-ink"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="mt-20">
          <h2 className="type-label text-accent">
            Technical skills
          </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {profile.skillGroups.map((group, index) => {
            const tones = [
              "border-accent/40 bg-accent/10",
              "border-cyan/40 bg-cyan/10",
              "border-violet/40 bg-violet/10",
            ] as const;
            return (
            <article
              key={group.label}
              className={`rounded-2xl border p-6 ${tones[index % tones.length]}`}
            >
              <h3 className="type-card">{group.label}</h3>
              <p className="type-body mt-3 text-muted">
                {group.items.join(" · ")}
              </p>
            </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
