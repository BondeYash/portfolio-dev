"use client";

import { useEdition } from "@/components/edition-provider";

/**
 * Printed furniture, not a UI control: it reads like the line a paper
 * sets to name which run you are holding.
 */
export function EditionToggle({ className = "" }: { className?: string }) {
  const { edition, toggleEdition } = useEdition();
  const night = edition === "night";

  return (
    <button
      type="button"
      onClick={toggleEdition}
      aria-label={
        night ? "Switch to the morning edition" : "Switch to the night edition"
      }
      className={`no-print font-cond text-[0.7rem] uppercase tracking-news text-faded underline decoration-dotted decoration-from-font underline-offset-4 transition-colors hover:text-spot ${className}`}
    >
      <span aria-hidden="true">{night ? "☾ " : "☀ "}</span>
      {night ? "Night Edition" : "Morning Edition"}
    </button>
  );
}
