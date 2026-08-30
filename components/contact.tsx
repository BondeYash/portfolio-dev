"use client";

import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/data/profile";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio note from ${name || "someone"}`);
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("opened");
  }

  return (
    <section id="contact" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-site">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Contact"
            title="If it should exist, we can ship it."
          />
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Open to full-stack product work, smart-contract builds, and
              audits. Email is fastest. LinkedIn if you prefer a longer thread.
            </p>
            <ul className="mt-8 space-y-4">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="group inline-flex items-center gap-3 text-ink"
                >
                  <Mail size={18} className="text-accent" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-ink"
                >
                  <Linkedin size={18} className="text-accent" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-ink"
                >
                  <Github size={18} className="text-accent" />
                  GitHub
                </a>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-line/12 bg-panel p-6 sm:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">Name</span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-line/15 bg-canvas px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-2 block text-muted">Email</span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full rounded-xl border border-line/15 bg-canvas px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
                  />
                </label>
              </div>
              <label className="mt-4 block text-sm">
                <span className="mb-2 block text-muted">Message</span>
                <textarea
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-y rounded-xl border border-line/15 bg-canvas px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
                />
              </label>
              <button
                type="submit"
                className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition-transform duration-300 ease-out hover:scale-[1.03]"
              >
                Send via email
              </button>
              {status === "opened" ? (
                <p className="mt-3 text-sm text-muted" role="status">
                  Your mail client should open with the message drafted.
                </p>
              ) : null}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
