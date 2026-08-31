"use client";

import { FormEvent, useState } from "react";
import { profile } from "@/data/profile";

const fieldClass =
  "mt-1 w-full border-2 border-rule bg-transparent px-2.5 py-2 font-body text-[0.95rem] text-ink outline-none placeholder:text-faded/70 focus:border-spot";

/** Letters to the editor. Composed here, delivered by the reader's own mail client. */
export function LettersDesk() {
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const subject = encodeURIComponent(
      `Letter to the editor from ${name || "a reader"}`,
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus("opened");
  }

  return (
    <form onSubmit={onSubmit} className="boxed p-4" data-reveal>
      <p className="kicker">Letters to the Editor</p>
      <p className="prose-col mt-1.5 !text-left !text-[0.88rem]">
        Copy is set here and delivered through your own mail client. Nothing is
        stored on this press.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="slug">Your name</span>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Reader in Surat"
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="slug">Return address</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="mt-3 block">
        <span className="slug">The letter</span>
        <textarea
          name="message"
          rows={6}
          required
          placeholder="Roles, contracts, corrections, or an argument about type systems."
          className={`${fieldClass} resize-y`}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="border-2 border-rule px-5 py-2 font-cond text-[0.78rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper"
        >
          Send to the desk &rarr;
        </button>
        <p aria-live="polite" className="slug">
          {status === "opened"
            ? "Mail client opened. Press send to file it."
            : "Delivered by mailto — no tracking, no forms server."}
        </p>
      </div>
    </form>
  );
}
