"use client";

import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";
import { PageIntro } from "@/components/page-intro";
import { PageShell } from "@/components/page-shell";
import { profile } from "@/data/profile";

export function ContactView() {
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(`Portfolio note from ${name || "someone"}`);
    const body = encodeURIComponent(
      `${message}\n\n- ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("opened");
  }

  return (
    <PageShell>
      <PageIntro
        index="04"
        kicker="Contact"
        title="If it should exist in production, we can talk."
        lede="Pune-based. Email is fastest. Phone if the thread is urgent."
      />
      <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <ul className="space-y-5">
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="type-lede inline-flex items-center gap-3 text-ink transition-colors hover:text-cyan"
            >
              <Mail size={18} className="text-accent" />
              {profile.email}
            </a>
          </li>
          <li>
            <a
              href={profile.phoneHref}
              className="type-lede inline-flex items-center gap-3 text-ink transition-colors hover:text-cyan"
            >
              <Phone size={18} className="text-accent" />
              {profile.phone}
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="type-lede inline-flex items-center gap-3 text-ink transition-colors hover:text-cyan"
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
              className="type-lede inline-flex items-center gap-3 text-ink transition-colors hover:text-cyan"
            >
              <Github size={18} className="text-accent" />
              GitHub
            </a>
          </li>
          <li className="type-label pt-2 text-cyan">
            {profile.location}
          </li>
        </ul>
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-accent/25 bg-panel/85 p-6 shadow-glow sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="type-body mb-2 block text-muted">Name</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                className="type-body w-full rounded-xl border border-accent/20 bg-canvas/80 px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
              />
            </label>
            <label className="block">
              <span className="type-body mb-2 block text-muted">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="type-body w-full rounded-xl border border-accent/20 bg-canvas/80 px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className="type-body mb-2 block text-muted">Message</span>
            <textarea
              name="message"
              required
              rows={6}
              className="type-body w-full resize-y rounded-xl border border-accent/20 bg-canvas/80 px-3 py-2.5 text-ink outline-none transition-shadow focus:shadow-glow"
            />
          </label>
          <button
            type="submit"
            className="type-btn mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-white transition-transform duration-300 ease-out hover:scale-[1.03]"
          >
            Send via email
          </button>
          {status === "opened" ? (
            <p className="type-body mt-3 text-muted" role="status">
              Your mail client should open with the message drafted.
            </p>
          ) : null}
        </form>
      </div>
    </PageShell>
  );
}
