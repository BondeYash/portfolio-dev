"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CourierScene } from "@/components/intro/courier-scene";
import { FrontPage } from "@/components/intro/front-page";
import { gsap, prefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/gsap";

const SEEN_KEY = "courier-delivered";

/** Play once a visit. A reader who wants it again can ask for it. */
function shouldPlay(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true;
  if (params.get("intro") === "0") return false;
  if (prefersReducedMotion()) return false;
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
  const doneRef = useRef(false);
  const reelRef = useRef<gsap.core.Timeline | null>(null);
  const loopsRef = useRef<Array<gsap.core.Animation>>([]);

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
    const root = rootRef.current;
    if (!root) {
      setPlaying(false);
      return;
    }
    reelRef.current?.kill();
    loopsRef.current.forEach((loop) => loop.kill());
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
    if (!root) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const fly = q("#fly")[0] as HTMLElement;
      const fold = q("#fold")[0] as HTMLElement;

      gsap.set(root, { autoAlpha: 1 });
      gsap.set([fly, fold], { autoAlpha: 0 });

      /* ---- the loops: wheels, legs, the bag, the wind ---- */
      const cycle = gsap.timeline({ repeat: -1 });
      cycle
        .to(q(".wheel"), {
          rotation: 360,
          duration: 0.62,
          ease: "none",
          transformOrigin: "50% 50%",
        })
        .to(
          "#crank",
          { rotation: 360, duration: 0.62, ease: "none", transformOrigin: "50% 50%" },
          0,
        )
        .to(
          "#leg-near",
          {
            rotation: 13,
            duration: 0.31,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
            svgOrigin: "772 574",
          },
          0,
        )
        .to(
          "#leg-far",
          {
            rotation: -13,
            duration: 0.31,
            yoyo: true,
            repeat: 1,
            ease: "sine.inOut",
            svgOrigin: "766 566",
          },
          0,
        );

      /* Paper in the bag never sits still in the wind. */
      const wind = gsap.to("#bag-papers", {
        rotation: 3.2,
        duration: 1.1,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        svgOrigin: "724 552",
      });

      const puffs = gsap.to(q(".puff"), {
        scale: 2.1,
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
        transformOrigin: "50% 50%",
        stagger: { each: 0.11, repeat: -1, repeatDelay: 0.22 },
      });

      const blink = gsap.to(q(".eye"), {
        scaleY: 0.12,
        duration: 0.09,
        repeat: -1,
        yoyo: true,
        repeatDelay: 2.4,
        transformOrigin: "50% 50%",
      });

      /* ---- the reel ---- */
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      reelRef.current = tl;
      loopsRef.current = [cycle, wind, puffs, blink];

      /* Scene 1 — an empty street, and someone coming up it. */
      tl.from("#intro-plate", { opacity: 0, duration: 0.45 }, 0)
        /* the camera closes in across the whole reel */
        .fromTo(
          "#intro-plate",
          { scale: 1 },
          { scale: 1.16, duration: 5.4, ease: "none", transformOrigin: "54% 64%" },
          0,
        )
        .fromTo("#scene-far", { x: 70 }, { x: -50, duration: 5.4, ease: "none" }, 0)
        .fromTo("#scene-mid", { x: 210 }, { x: -150, duration: 5.4, ease: "none" }, 0)
        .fromTo("#street", { x: 90 }, { x: -70, duration: 5.4, ease: "none" }, 0)
        .fromTo(
          "#rider",
          { x: -1180 },
          { x: 0, duration: 1.6, ease: "power2.out" },
          0.25,
        )
        .fromTo("#dust", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3)
        .to("#rider-bob", { y: -7, duration: 0.31, yoyo: true, repeat: 4, ease: "sine.inOut" }, 0.3)

        /* Scene 2 — he pulls up, and looks straight down the lens. */
        .addLabel("stop", 1.72)
        .to(cycle, { timeScale: 0, duration: 0.62, ease: "power2.out" }, "stop-=0.35")
        .to("#dust", { opacity: 0, duration: 0.4 }, "stop")
        .to("#rider-bob", { y: 0, duration: 0.3 }, "stop")
        .to("#leg-far", { rotation: 26, duration: 0.35, svgOrigin: "766 566" }, "stop")
        .to("#face", { x: -11, duration: 0.35 }, "stop+=0.1")
        /* tips the cap */
        .to("#arm-upper", { rotation: -38, duration: 0.34, svgOrigin: "838 454" }, "stop+=0.2")
        .to("#arm-fore", { rotation: -34, duration: 0.34, svgOrigin: "896 510" }, "stop+=0.2")
        .to("#cap", { rotation: -9, y: -8, duration: 0.24, svgOrigin: "892 384" }, "stop+=0.42")
        .to("#cap", { rotation: 0, y: 0, duration: 0.24 }, "stop+=0.68")

        /* Scene 3 — into the bag, out with the edition. */
        .addLabel("reach", 2.62)
        .to("#arm-upper", { rotation: 70, duration: 0.34, svgOrigin: "838 454" }, "reach")
        .to("#arm-fore", { rotation: 58, duration: 0.34, svgOrigin: "896 510" }, "reach")
        .set("#hand-roll", { opacity: 1 }, "reach+=0.34")
        .to("#bag-papers", { scale: 0.94, duration: 0.3, svgOrigin: "724 552" }, "reach+=0.34")
        .to(
          "#arm-upper",
          { rotation: -104, duration: 0.42, ease: "back.out(1.5)", svgOrigin: "838 454" },
          "reach+=0.4",
        )
        .to("#arm-fore", { rotation: -22, duration: 0.42, svgOrigin: "896 510" }, "reach+=0.4")
        .to("#hand-roll", { scale: 0.92, duration: 0.4, transformOrigin: "50% 50%" }, "reach+=0.4")
        /* a beat, held, so the paper is unmistakably the point */
        .to("#rider-bob", { x: -14, duration: 0.26 }, "reach+=0.72")

        /* Scene 4 — the throw. */
        .addLabel("throw", 3.72)
        .to("#rider-bob", { x: 26, duration: 0.16, ease: "power3.in" }, "throw")
        .to("#arm-upper", { rotation: -12, duration: 0.2, ease: "power3.in", svgOrigin: "838 454" }, "throw")
        .to("#arm-fore", { rotation: 26, duration: 0.2, ease: "power3.in", svgOrigin: "896 510" }, "throw")
        .set("#hand-roll", { opacity: 0 }, "throw+=0.14")
        .to("#rider-bob", { x: 0, duration: 0.5 }, "throw+=0.2")
        .fromTo("#speed", { opacity: 0, scale: 1.5 }, { opacity: 0.5, scale: 1, duration: 0.18, transformOrigin: "50% 50%" }, "throw+=0.1")
        .to("#speed", { opacity: 0, duration: 0.5 }, "throw+=0.34")

        /* the edition, coming straight at the reader */
        .call(
          () => {
            const hand = q("#hand")[0];
            if (!hand) return;
            const box = hand.getBoundingClientRect();
            gsap.set(fly, {
              autoAlpha: 1,
              x: box.left + box.width / 2 - window.innerWidth / 2,
              y: box.top + box.height / 2 - window.innerHeight / 2,
              scale: 0.14,
              rotate: -22,
              rotateX: 26,
            });
          },
          undefined,
          "throw+=0.14",
        )
        /* It leaves the hand fast and lines up on the lens... */
        .to(fly, { x: 0, y: 0, duration: 0.34, ease: "power2.out" }, "throw+=0.16")
        /* ...then closes the distance, growing the way a thrown thing does. */
        .to(
          fly,
          {
            scale: () => (window.innerWidth / 1160) * 3.1,
            rotate: 400,
            rotateX: 0,
            duration: 0.86,
            ease: "power1.in",
          },
          "throw+=0.16",
        )

        /* Scene 5 — it covers the lens, and it is the paper. */
        .addLabel("cover", 4.6)
        .set(fold, { autoAlpha: 1 }, "cover")
        .fromTo(fold, { scale: 1.28, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.26 }, "cover")
        .to(fly, { autoAlpha: 0, duration: 0.18 }, "cover+=0.06")
        .to("#intro-plate", { opacity: 0, duration: 0.2 }, "cover+=0.1")
        .fromTo(
          "#fold-stamp",
          { scale: 2.4, opacity: 0, rotate: -16 },
          { scale: 1, opacity: 1, rotate: -8, duration: 0.3, ease: "back.out(2)" },
          "cover+=0.28",
        )
        .fromTo(fold, { x: 0 }, { x: 7, duration: 0.07, repeat: 3, yoyo: true }, "cover+=0.3")

        /* Scene 6 — it opens, and the paper is the website. */
        .addLabel("open", 5.34)
        .to(root, { backgroundColor: "rgba(0,0,0,0)", duration: 0.5 }, "open")
        .to("#fold-stamp", { opacity: 0, duration: 0.28 }, "open")
        .to("#fold-half-l", { rotateY: -78, x: "-6%", duration: 0.9, ease: "power2.inOut" }, "open")
        .to("#fold-half-r", { rotateY: 78, x: "6%", duration: 0.9, ease: "power2.inOut" }, "open")
        .to(fold, { scale: 1.34, duration: 0.9, ease: "power2.in" }, "open")
        .to("#fold-half-l", { opacity: 0, duration: 0.34 }, "open+=0.52")
        .to("#fold-half-r", { opacity: 0, duration: 0.34 }, "open+=0.52")
        .to(root, { autoAlpha: 0, duration: 0.3 }, "open+=0.66");

      /* In development, ?t=3.4 freezes the reel on a frame for tuning. */
      if (process.env.NODE_ENV !== "production") {
        const at = new URLSearchParams(window.location.search).get("t");
        if (at) {
          tl.pause(parseFloat(at), false);
          [cycle, wind, puffs, blink].forEach((loop) => loop.pause(0));
        }
      }

      /* Loops stop with the reel. */
      tl.eventCallback("onComplete", () => {
        loopsRef.current.forEach((loop) => loop.kill());
        finish();
      });
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
      <CourierScene />

      {/* the edition, in flight */}
      <div id="fly" className="intro-fly" aria-hidden="true">
        <svg viewBox="-120 -34 240 68" className="intro-fly-art">
          <rect className="paper-fill" x={-58} y={-15} width={116} height={30} rx={13} />
          <rect className="spot-fill" x={-14} y={-15} width={22} height={30} />
          <ellipse className="paper-fill ink-stroke" cx={-58} cy={0} rx={7} ry={15} />
          <path className="ink-stroke" d="M-58 -15 H58 M-58 15 H58" />
          <path
            className="ink-hair"
            d="M-42 -9 H26 M-42 -4 H34 M-42 1 H20 M-42 6 H30 M-42 11 H14"
          />
          <path className="ink-stroke" d="M16 -15 V15" />
        </svg>
      </div>

      {/* the edition, covering the lens, then opening */}
      <div id="fold" className="intro-fold" aria-hidden="true">
        <div id="fold-half-l" className="fold-half fold-half--l">
          <div className="fold-inner">
            <FrontPage printedOn={printedOn} />
          </div>
        </div>
        <div id="fold-half-r" className="fold-half fold-half--r">
          <div className="fold-inner fold-inner--r">
            <FrontPage printedOn={printedOn} />
          </div>
        </div>
        <span id="fold-stamp" className="fold-stamp">
          Delivered
        </span>
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
