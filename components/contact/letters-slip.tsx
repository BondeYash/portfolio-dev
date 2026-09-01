"use client";

import { useEffect, useState } from "react";
import { LettersDesk } from "@/components/contact/letters-desk";

/**
 * The letters box. A newspaper does not carry a contact form on its front
 * page; it prints an address and keeps a slip at the desk. This is the slip.
 */
export function LettersSlip() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-cond text-[0.66rem] uppercase tracking-news text-ink underline decoration-dotted underline-offset-4 hover:text-spot"
      >
        Write to the desk
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Letters to the editor"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-press/70 p-4 backdrop-blur-[2px]"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="newsprint sheet my-auto w-full max-w-xl bg-paper p-5 shadow-leaf sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="slug misregister">Letters &middot; Post Free</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close the letters slip"
                className="font-cond text-[0.72rem] uppercase tracking-news text-faded hover:text-spot"
              >
                Close &times;
              </button>
            </div>
            <div className="rule-thick mt-1.5 mb-4" />
            <LettersDesk />
          </div>
        </div>
      ) : null}
    </>
  );
}
