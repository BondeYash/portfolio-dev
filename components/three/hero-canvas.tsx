"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

const CanvasInner = dynamic(
  () =>
    import("@/components/three/hero-canvas-inner").then(
      (mod) => mod.HeroCanvasInner,
    ),
  { ssr: false },
);

export function HeroCanvas() {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_40%,rgb(var(--accent)/0.22),transparent_55%)]"
      />
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 h-full w-full md:pointer-events-auto">
        <CanvasInner />
      </div>
    </div>
  );
}
