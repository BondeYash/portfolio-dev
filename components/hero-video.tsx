"use client";

import { useReducedMotion } from "framer-motion";

export function HeroVideo() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {reduce ? (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgb(var(--accent)/0.28),transparent_55%)]" />
      ) : (
        <video
          className="absolute inset-0 h-full w-full scale-105 object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/hero-earth.mp4" type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-canvas/90 via-canvas/70 to-canvas/45 dark:from-canvas/88 dark:via-canvas/62 dark:to-canvas/35" />
    </div>
  );
}
