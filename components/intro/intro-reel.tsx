"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CoverType } from "@/components/intro/cover-type";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/gsap";

const SEEN_KEY = "courier-delivered";
/** By here the thrown sheet is covering the lens, so the type can be struck. */
const TYPE_AT = 5.95;
/** A reel that has not started by now is not worth waiting for. */
const LOAD_TIMEOUT = 2500;

/** Play once a visit. A reader who wants it again can ask for it. */
function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true;
  if (params.get("intro") === "0") return false;
  if (prefersReducedMotion()) return false;
  /* A reader on a metered or slow connection did not ask for a film. */
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /2g/.test(conn.effectiveType)) return false;
  try {
    return window.sessionStorage.getItem(SEEN_KEY) !== "1";
  } catch {
    return true;
  }
}

export function IntroReel({ printedOn }: { printedOn: string }) {
  const [playing, setPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const doneRef = useRef(false);
  const reelRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    setMounted(true);
    if (shouldPlay()) setPlaying(true);
  }, []);

  const finish = useCallback((instant = false) => {
    if (doneRef.current) return;
    doneRef.current = true;
    try {
      window.sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* a private window can refuse; the reel is not worth failing over */
    }
    videoRef.current?.pause();
    const root = rootRef.current;
    if (!root) {
      setPlaying(false);
      return;
    }
    reelRef.current?.kill();
    gsap.killTweensOf(root.querySelectorAll("*"));
    gsap.to(root, {
      autoAlpha: 0,
      duration: instant ? 0.2 : 0.45,
      ease: "power2.out",
      onComplete: () => setPlaying(false),
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!playing) return;
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    let struck = false;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const fold = q("#fold")[0] as HTMLElement;
      const type = q("#reel-type")[0] as HTMLElement;

      gsap.set(root, { autoAlpha: 1 });
      gsap.set([fold, type], { autoAlpha: 0 });

      /* ---- the sheet takes the lens, and the type lands on it ---- */
      const strike = () => {
        if (struck) return;
        struck = true;
        gsap.to(type, { autoAlpha: 1, duration: 0.26, ease: "power2.out" });
      };

      /* ---- the sheet opens, and the paper is the website ---- */
      const open = () => {
        if (doneRef.current || reelRef.current) return;
        strike();
        const tl = gsap.timeline({ onComplete: () => finish() });
        reelRef.current = tl;
        /* The strike fade may still be mid-flight; left running it would
           keep writing opacity onto the centre copy of the type and float it
           over the reveal. */
        gsap.killTweensOf([type, video]);
        tl
          /* The plate behind the halves is the frame the reel ended on, so
             the swap from film to paper has nothing to see. */
          .set(fold, { autoAlpha: 1 })
          .set([video, type], { autoAlpha: 0 })
          .to("#fold-half-l", { rotateY: -78, x: "-6%", duration: 0.92, ease: "power2.inOut" }, 0.1)
          .to("#fold-half-r", { rotateY: 78, x: "6%", duration: 0.92, ease: "power2.inOut" }, 0.1)
          .to(fold, { scale: 1.3, duration: 0.92, ease: "power2.in" }, 0.1)
          .to(root, { backgroundColor: "rgba(0,0,0,0)", duration: 0.5 }, 0.1)
          .to(["#fold-half-l", "#fold-half-r"], { opacity: 0, duration: 0.34 }, 0.64)
          .to(root, { autoAlpha: 0, duration: 0.3 }, 0.78);
      };

      const onTime = () => {
        if (video.currentTime >= TYPE_AT) strike();
      };
      const onCanPlay = () => {
        window.clearTimeout(timer);
        if (process.env.NODE_ENV !== "production") {
          const at = new URLSearchParams(window.location.search).get("t");
          if (at) video.currentTime = parseFloat(at);
        }
        /* Autoplay can still be refused; a frozen first frame is worse than
           no reel at all, so step aside if it is. */
        video.play().catch(() => finish(true));
      };

      /* In development, ?stage=type or ?stage=open&st=0.4 holds the handoff
         still so the sheet and its type can be looked at. */
      if (process.env.NODE_ENV !== "production") {
        const params = new URLSearchParams(window.location.search);
        const stage = params.get("stage");
        if (stage === "type") {
          strike();
          return;
        }
        if (stage === "open") {
          open();
          reelRef.current?.pause(parseFloat(params.get("st") ?? "0.5"), false);
          return;
        }
      }

      /* A reel that never arrives must not hold the door shut. */
      const timer = window.setTimeout(() => finish(true), LOAD_TIMEOUT);

      video.addEventListener("timeupdate", onTime);
      video.addEventListener("ended", open);
      video.addEventListener("canplay", onCanPlay);
      video.addEventListener("error", () => finish(true));
      if (video.readyState >= 3) onCanPlay();

      return () => {
        window.clearTimeout(timer);
        video.removeEventListener("timeupdate", onTime);
        video.removeEventListener("ended", open);
        video.removeEventListener("canplay", onCanPlay);
      };
    }, rootRef);

    return () => ctx.revert();
  }, [finish, playing]);

  useEffect(() => {
    if (!playing) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        finish(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish, playing]);

  if (!mounted || !playing) return null;

  return (
    <div
      ref={rootRef}
      id="intro-reel"
      className="intro-reel"
      role="img"
      aria-label="A newspaper courier rides up and throws today's edition at the camera; it opens into the site."
      onClick={() => finish(true)}
    >
      <video
        ref={videoRef}
        id="reel-video"
        className="intro-video"
        muted
        playsInline
        autoPlay
        preload="auto"
        poster="/intro/poster.jpg"
        aria-hidden="true"
      >
        <source src="/intro/delivery.mp4" type="video/mp4" />
      </video>

      {/* the masthead, struck onto the sheet while the film still holds it */}
      <div id="reel-type" className="intro-typelayer" aria-hidden="true">
        <CoverType printedOn={printedOn} />
      </div>

      {/* the same sheet, in two halves, ready to be opened */}
      <div id="fold" className="intro-fold" aria-hidden="true">
        <div id="fold-half-l" className="fold-half fold-half--l">
          <div className="fold-inner">
            <div className="fold-plate">
              <CoverType printedOn={printedOn} />
            </div>
          </div>
        </div>
        <div id="fold-half-r" className="fold-half fold-half--r">
          <div className="fold-inner fold-inner--r">
            <div className="fold-plate">
              <CoverType printedOn={printedOn} />
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="intro-skip"
        onClick={(event) => {
          event.stopPropagation();
          finish(true);
        }}
      >
        Skip the delivery &rarr;
      </button>
    </div>
  );
}
