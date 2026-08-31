"use client";

import { useRef } from "react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

/**
 * Wraps server-rendered markup and animates any descendant carrying
 * `data-reveal` as it scrolls into view — the ink hitting the page.
 * Content stays in the HTML, so it survives with JavaScript switched off.
 */
export function RevealScope({
  children,
  y = 22,
  stagger = 0.07,
  start = "top 88%",
  className = "",
}: {
  children: React.ReactNode;
  y?: number;
  stagger?: number;
  start?: string;
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", root);
    if (items.length === 0) return;

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0, clearProps: "filter" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, y, filter: "blur(6px)" });
      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.75,
            ease: "power3.out",
            stagger,
            overwrite: true,
          }),
      });
    }, root);

    return () => ctx.revert();
  }, [start, stagger, y]);

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}
