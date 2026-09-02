"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  gsap,
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

/* ------------------------------------------------------------------
   A bound edition. Leaves are real: each one carries a front and a
   back, hinges at the spine, and swings through 180 degrees in 3D.
   ------------------------------------------------------------------ */

export type EditionPage = {
  id: string;
  section: string;
  folio: string;
  node: React.ReactNode;
  /** Print this page to the trim, with no margin — the cover plate does. */
  bleed?: boolean;
};

/** Every page is composed at this size, then scaled to fit the stage. */
const DESIGN_W = 380;
const DESIGN_H = 543;

type Leaf = { front: EditionPage | null; back: EditionPage | null };

function buildLeaves(pages: EditionPage[], spread: boolean): Leaf[] {
  if (!spread) {
    return pages.map((page) => ({ front: page, back: null }));
  }
  const leaves: Leaf[] = [];
  for (let i = 0; i < pages.length; i += 2) {
    leaves.push({ front: pages[i] ?? null, back: pages[i + 1] ?? null });
  }
  return leaves;
}

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** The moving parts of one leaf, looked up at mount instead of every frame. */
type LeafParts = {
  front: HTMLElement | null;
  back: HTMLElement | null;
  frontShade: HTMLElement | null;
  backShade: HTMLElement | null;
};

/**
 * Paper does not turn at a constant rate. A thumb lifts the corner slowly,
 * gravity takes the sheet through the vertical, and the leaf lands a little
 * past flat and flutters down. GSAP accepts a plain function as an ease, so
 * the whole curve is written out here rather than approximated by a preset.
 */
const SLAP = 1.03;
const FLUTTER_AT = 0.76;

function paperEase(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  if (t < FLUTTER_AT) {
    const u = t / FLUTTER_AT;
    const swing = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
    return swing * SLAP;
  }
  const u = (t - FLUTTER_AT) / (1 - FLUTTER_AT);
  return 1 + (SLAP - 1) * Math.cos(u * Math.PI * 2.15) * Math.exp(-u * 4.4);
}

/* ---------- paper sound, synthesised (no audio files) ------------ */

function useRustle(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  return useCallback(() => {
    if (!enabled || typeof window === "undefined") return;
    try {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return;
      const ctx = (ctxRef.current ??= new Ctor());
      if (ctx.state === "suspended") void ctx.resume();

      const duration = 0.42;
      const frames = Math.floor(ctx.sampleRate * duration);
      const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frames; i += 1) {
        const t = i / frames;
        const envelope = Math.pow(1 - t, 2.4) * (0.35 + 0.65 * Math.sin(t * 26));
        data[i] = (Math.random() * 2 - 1) * envelope;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const band = ctx.createBiquadFilter();
      band.type = "bandpass";
      band.frequency.value = 2400;
      band.Q.value = 0.65;
      const gain = ctx.createGain();
      gain.gain.value = 0.09;
      source.connect(band).connect(gain).connect(ctx.destination);
      source.start();
    } catch {
      /* audio is a nicety, never a requirement */
    }
  }, [enabled]);
}

export function Flipbook({
  pages,
  label = "The edition",
  fill = false,
  syncHash = false,
}: {
  pages: EditionPage[];
  label?: string;
  /** Fill the height of the flex parent instead of sizing off the window. */
  fill?: boolean;
  /** Keep the address bar on the page the reader is looking at. */
  syncHash?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRefs = useRef<Array<HTMLDivElement | null>>([]);
  const castRef = useRef<HTMLDivElement>(null);
  const partsRef = useRef<Array<LeafParts | null>>([]);
  /** How far the top corner is lifted by a hovering hand. */
  const peekRef = useRef({ p: 0 });

  const [spread, setSpread] = useState(true);
  const [size, setSize] = useState({ w: DESIGN_W, h: DESIGN_H, scale: 1 });
  const [flipped, setFlipped] = useState(0);
  const [sound, setSound] = useState(true);

  const flippedRef = useRef(0);
  const busyRef = useRef(false);
  const dragRef = useRef<{
    leaf: number;
    dir: 1 | -1;
    startX: number;
    progress: number;
    lastX: number;
    lastT: number;
    vx: number;
  } | null>(null);

  const leaves = useMemo(() => buildLeaves(pages, spread), [pages, spread]);
  const leafCount = leaves.length;
  const rustle = useRustle(sound);

  /* ---------- responsive stage ---------------------------------- */

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(min-width: 900px)");
    const apply = () => setSpread(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const measure = () => {
      const available = stage.clientWidth;
      const pad = fill ? 2 * parseFloat(getComputedStyle(stage).paddingTop) : 2;
      const room = fill
        ? Math.max(200, stage.clientHeight - pad)
        : Math.max(380, window.innerHeight - 196);
      const ratio = DESIGN_W / DESIGN_H;
      const columns = spread ? 2 : 1;
      let pageW = Math.min(
        available / columns - (spread ? 8 : 4),
        room * ratio,
      );
      pageW = Math.max(240, pageW);
      const pageH = pageW / ratio;
      setSize({ w: pageW, h: pageH, scale: pageW / DESIGN_W });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fill, spread]);

  /* ---------- opening page ------------------------------------- */

  useIsomorphicLayoutEffect(() => {
    if (!syncHash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const index = pages.findIndex((page) => page.id === id);
    if (index <= 0) return;
    const wide = window.matchMedia("(min-width: 900px)").matches;
    const leaf = wide ? Math.ceil(index / 2) : index;
    prevSpread.current = wide;
    flippedRef.current = leaf;
    setFlipped(leaf);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* ---------- leaf painting ------------------------------------- */

  const zFor = useCallback(
    (index: number, flippedCount: number) =>
      index < flippedCount ? index + 1 : leafCount * 2 - index,
    [leafCount],
  );

  const paint = useCallback(
    (index: number, progress: number, raised: boolean, stackOffset = 0) => {
      const el = leafRefs.current[index];
      if (!el) return;
      const p = clamp(progress);
      /* How far off the flat the sheet is: 0 lying down, 1 stood on edge. */
      const fold = Math.sin(p * Math.PI);
      /* The corner rises early and drops late, the way a thumbed page does. */
      const lift = Math.sin(Math.pow(p, 0.82) * Math.PI);

      el.style.transform = `rotateY(${(-180 * progress).toFixed(
        2,
      )}deg) rotateZ(${(fold * 1.15).toFixed(2)}deg) translateZ(${(
        lift * 58
      ).toFixed(2)}px)`;
      el.style.zIndex = String(
        raised
          ? leafCount * 2 + 10 + stackOffset
          : zFor(index, flippedRef.current),
      );

      const parts = partsRef.current[index];
      if (!parts) return;

      /* Paper bows as it turns, so it reads narrower than it is. Squashing
         each face towards the spine fakes that curl without bending any
         geometry — and stays a composited transform, so it costs nothing. */
      const squash = 1 - fold * 0.075;
      const inset = ((1 - squash) * 50).toFixed(3);
      const scale = squash.toFixed(4);
      if (parts.front) {
        parts.front.style.transform = `translateX(-${inset}%) scaleX(${scale})`;
      }
      if (parts.back) {
        parts.back.style.transform = `rotateY(180deg) translateX(${inset}%) scaleX(${scale})`;
      }

      /* Light travels across the sheet as it swings, instead of the whole
         face simply darkening. */
      if (parts.frontShade) {
        parts.frontShade.style.opacity = String(clamp(p * 1.9) * 0.8);
        parts.frontShade.style.backgroundPositionX = `${(p * 100).toFixed(1)}%`;
      }
      if (parts.backShade) {
        parts.backShade.style.opacity = String(clamp((1 - p) * 1.9) * 0.8);
        parts.backShade.style.backgroundPositionX = `${(100 - p * 100).toFixed(
          1,
        )}%`;
      }

      const cast = castRef.current;
      if (cast) {
        cast.style.opacity = String(fold * 0.42);
        cast.style.transform = `scaleX(${(0.28 + 0.72 * p).toFixed(3)})`;
      }
    },
    [leafCount, zFor],
  );

  /** Repaint everything from the resting state. */
  const settle = useCallback(
    (flippedCount: number) => {
      for (let i = 0; i < leafCount; i += 1) {
        const el = leafRefs.current[i];
        if (!el) continue;
        const progress = i < flippedCount ? 1 : 0;
        el.style.transform = `rotateY(${-180 * progress}deg) rotateZ(0deg) translateZ(0px)`;
        el.style.zIndex = String(zFor(i, flippedCount));
        const parts = partsRef.current[i];
        if (!parts) continue;
        if (parts.front) parts.front.style.transform = "";
        if (parts.back) parts.back.style.transform = "rotateY(180deg)";
        if (parts.frontShade) parts.frontShade.style.opacity = "0";
        if (parts.backShade) parts.backShade.style.opacity = "0";
      }
      if (castRef.current) castRef.current.style.opacity = "0";
    },
    [leafCount, zFor],
  );

  /* Switching between spread and single changes what a "leaf" means;
     remap so the reader stays on the page they were reading. */
  const prevSpread = useRef(spread);
  useIsomorphicLayoutEffect(() => {
    if (prevSpread.current === spread) return;
    const wasSpread = prevSpread.current;
    prevSpread.current = spread;
    const k = flippedRef.current;
    const pageIndex = wasSpread ? (k === 0 ? 0 : k * 2 - 1) : k;
    const next = spread
      ? Math.ceil(pageIndex / 2)
      : Math.min(pageIndex, pages.length);
    flippedRef.current = next;
    setFlipped(next);
  }, [pages.length, spread]);

  useIsomorphicLayoutEffect(() => {
    flippedRef.current = Math.min(flipped, leafCount);
    settle(flippedRef.current);
  }, [flipped, leafCount, settle, spread]);

  /* ---------- turning ------------------------------------------- */

  const turn = useCallback(
    (dir: 1 | -1) => {
      if (busyRef.current) return;
      const index = dir === 1 ? flippedRef.current : flippedRef.current - 1;
      if (index < 0 || index >= leafCount) return;
      const el = leafRefs.current[index];
      if (!el) return;

      busyRef.current = true;
      el.style.zIndex = String(leafCount * 2 + 10);
      gsap.killTweensOf(peekRef.current);
      peekRef.current.p = 0;
      rustle();

      if (prefersReducedMotion()) {
        flippedRef.current += dir;
        setFlipped(flippedRef.current);
        busyRef.current = false;
        return;
      }

      const proxy = { p: dir === 1 ? 0 : 1 };
      gsap.to(proxy, {
        p: dir === 1 ? 1 : 0,
        duration: 0.94,
        ease: paperEase,
        onUpdate: () => paint(index, proxy.p, true),
        onComplete: () => {
          flippedRef.current += dir;
          setFlipped(flippedRef.current);
          busyRef.current = false;
        },
      });
    },
    [leafCount, paint, rustle],
  );

  /** Riffle several leaves at once when jumping across the edition. */
  const goToLeaf = useCallback(
    (target: number) => {
      const bounded = Math.min(Math.max(target, 0), leafCount);
      if (busyRef.current || bounded === flippedRef.current) return;
      const dir: 1 | -1 = bounded > flippedRef.current ? 1 : -1;
      const indices: number[] = [];
      for (let i = flippedRef.current; i !== bounded; i += dir) {
        indices.push(dir === 1 ? i : i - 1);
      }
      if (indices.length === 1) {
        turn(dir);
        return;
      }

      busyRef.current = true;
      rustle();

      if (prefersReducedMotion()) {
        flippedRef.current = bounded;
        setFlipped(bounded);
        busyRef.current = false;
        return;
      }

      const timeline = gsap.timeline({
        onComplete: () => {
          flippedRef.current = bounded;
          setFlipped(bounded);
          busyRef.current = false;
        },
      });

      indices.forEach((index, order) => {
        const proxy = { p: dir === 1 ? 0 : 1 };
        const leafEl = leafRefs.current[index];
        if (leafEl) leafEl.style.zIndex = String(leafCount * 2 + 10 + order);
        timeline.to(
          proxy,
          {
            p: dir === 1 ? 1 : 0,
            duration: 0.66,
            ease: "power3.inOut",
            onUpdate: () => paint(index, proxy.p, true, order),
          },
          order * 0.13,
        );
        if (order > 0) {
          timeline.call(rustle, undefined, order * 0.13);
        }
      });
    },
    [leafCount, paint, rustle, turn],
  );

  /* ---------- the corner curls under a hovering hand ------------- */

  const peek = useCallback(
    (value: number) => {
      if (busyRef.current || dragRef.current || prefersReducedMotion()) return;
      const index = flippedRef.current;
      if (index < 0 || index >= leafCount) return;
      gsap.killTweensOf(peekRef.current);
      gsap.to(peekRef.current, {
        p: value,
        duration: value > 0 ? 0.34 : 0.5,
        ease: value > 0 ? "power3.out" : "power2.inOut",
        onUpdate: () => paint(index, peekRef.current.p, true),
        onComplete: () => {
          if (value === 0 && !busyRef.current) settle(flippedRef.current);
        },
      });
    },
    [leafCount, paint, settle],
  );

  /* ---------- keyboard ------------------------------------------ */

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        turn(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        turn(-1);
      } else if (event.key === "Home") {
        goToLeaf(0);
      } else if (event.key === "End") {
        goToLeaf(leafCount);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToLeaf, leafCount, turn]);

  /* ---------- drag to turn -------------------------------------- */

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (busyRef.current || prefersReducedMotion()) return;
      if ((event.target as HTMLElement).closest("button, a")) return;
      const book = bookRef.current;
      if (!book) return;
      const rect = book.getBoundingClientRect();
      const forward = spread
        ? event.clientX - rect.left > rect.width / 2
        : true;
      const dir: 1 | -1 = forward ? 1 : -1;
      const index = dir === 1 ? flippedRef.current : flippedRef.current - 1;
      if (index < 0 || index >= leafCount) return;

      const leafEl = leafRefs.current[index];
      if (leafEl) leafEl.style.zIndex = String(leafCount * 2 + 10);

      gsap.killTweensOf(peekRef.current);
      peekRef.current.p = 0;
      dragRef.current = {
        leaf: index,
        dir,
        startX: event.clientX,
        progress: dir === 1 ? 0 : 1,
        lastX: event.clientX,
        lastT: event.timeStamp,
        vx: 0,
      };
      book.setPointerCapture(event.pointerId);
    },
    [leafCount, spread],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dt = event.timeStamp - drag.lastT;
      if (dt >= 4) {
        /* Smoothed so one stuttery pointer event cannot fake a fling. */
        drag.vx = 0.7 * ((event.clientX - drag.lastX) / dt) + 0.3 * drag.vx;
        drag.lastX = event.clientX;
        drag.lastT = event.timeStamp;
      }
      const travel = (event.clientX - drag.startX) / size.w;
      const progress =
        drag.dir === 1 ? clamp(-travel) : clamp(1 - Math.max(0, travel));
      drag.progress = progress;
      paint(drag.leaf, progress, true);
    },
    [paint, size.w],
  );

  const endDrag = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      bookRef.current?.releasePointerCapture(event.pointerId);

      const moved =
        drag.dir === 1 ? drag.progress > 0.02 : drag.progress < 0.98;
      if (!moved) return; // a plain click; the corner and buttons handle those

      /* Let go mid-turn and the sheet keeps going: a flick of the wrist
         finishes the page even if it never crossed the halfway mark. */
      const speed = Math.abs(drag.vx);
      const fling = speed > 0.4 ? (drag.vx < 0 ? 1 : -1) : 0;
      const commit =
        fling !== 0
          ? fling === drag.dir
          : drag.dir === 1
            ? drag.progress > 0.32
            : drag.progress < 0.68;
      const end = commit ? (drag.dir === 1 ? 1 : 0) : drag.dir === 1 ? 0 : 1;
      const remaining = Math.abs(end - drag.progress);
      const duration = Math.min(
        0.68,
        Math.max(0.22, remaining * (speed > 0.4 ? 0.5 : 0.95)),
      );

      busyRef.current = true;
      if (commit) rustle();
      const proxy = { p: drag.progress };
      gsap.to(proxy, {
        p: end,
        duration,
        ease: commit ? "power2.out" : "power2.inOut",
        onUpdate: () => paint(drag.leaf, proxy.p, true),
        onComplete: () => {
          if (commit) {
            flippedRef.current += drag.dir;
            setFlipped(flippedRef.current);
          } else {
            settle(flippedRef.current);
          }
          busyRef.current = false;
        },
      });
    },
    [paint, rustle, settle],
  );

  /* ---------- readout ------------------------------------------- */

  const visible = useMemo(() => {
    if (!spread) return [pages[flipped]].filter(Boolean) as EditionPage[];
    const left = leaves[flipped - 1]?.back ?? null;
    const right = leaves[flipped]?.front ?? null;
    return [left, right].filter(Boolean) as EditionPage[];
  }, [flipped, leaves, pages, spread]);

  const atStart = flipped === 0;
  const atEnd = flipped >= leafCount;

  /* A bound edition opens on the cover alone and closes on the back page
     alone. Slide the book so the single sheet sits centred instead of
     leaving half the desk blank. */
  const shift = spread ? (atStart ? -size.w / 2 : atEnd ? size.w / 2 : 0) : 0;

  /* A link anywhere on the desk — a rail, a bookmark, a shared URL — turns
     the paper to that page. */
  useEffect(() => {
    if (!syncHash) return;
    const onHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const index = pages.findIndex((page) => page.id === id);
      if (index < 0) return;
      goToLeaf(spread ? Math.ceil(index / 2) : index);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [goToLeaf, pages, spread, syncHash]);

  const openPageId = visible[visible.length - 1]?.id;
  useEffect(() => {
    if (!syncHash || !openPageId) return;
    /* Keep the query — a referral or campaign tag must survive the turn. */
    const first = openPageId === pages[0]?.id;
    window.history.replaceState(
      null,
      "",
      first ? location.pathname + location.search : `#${openPageId}`,
    );
  }, [openPageId, pages, syncHash]);

  return (
    <div
      className={`select-none ${
        fill ? "flex min-h-0 flex-1 flex-col" : ""
      }`}
    >
      {/* ---- stage ---- */}
      <div
        ref={stageRef}
        className={`book-stage relative mx-auto flex w-full items-center justify-center ${
          fill
            ? "min-h-0 flex-1 overflow-hidden px-4 py-3 sm:px-6 sm:py-4"
            : "px-1 py-2"
        }`}
      >
        <div
          ref={bookRef}
          className="relative touch-pan-y"
          style={{
            width: spread ? size.w * 2 : size.w,
            height: size.h,
            transformStyle: "preserve-3d",
            transform: `translateX(${shift}px)`,
            transition: "transform 420ms cubic-bezier(0.4, 0, 0.2, 1)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {/* the pile of paper under everything */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 border border-rule/30 bg-stock shadow-leaf"
            style={{
              left: spread && !atEnd ? size.w : 0,
              width: size.w,
              transform: `translate3d(${atEnd ? -3 : 3}px, 4px, -8px)`,
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 border border-rule/20 bg-stock/80"
            style={{
              left: spread && !atEnd ? size.w : 0,
              width: size.w,
              transform: `translate3d(${atEnd ? -6 : 6}px, 8px, -14px)`,
            }}
          />

          {leaves.map((leaf, index) => (
            <div
              key={leaf.front?.id ?? leaf.back?.id ?? index}
              ref={(node) => {
                leafRefs.current[index] = node;
                partsRef.current[index] = node
                  ? {
                      front: node.querySelector("[data-face='front']"),
                      back: node.querySelector("[data-face='back']"),
                      frontShade: node.querySelector("[data-shade='front']"),
                      backShade: node.querySelector("[data-shade='back']"),
                    }
                  : null;
              }}
              className="leaf"
              style={{
                width: size.w,
                height: size.h,
                left: spread ? size.w : 0,
              }}
            >
              <div data-face="front" className="leaf-face shadow-leaf">
                <PageCanvas page={leaf.front} scale={size.scale} />
                <div
                  data-shade="front"
                  className="leaf-shade leaf-shade--front"
                />
              </div>
              <div
                data-face="back"
                className="leaf-face leaf-face--back shadow-leaf"
              >
                <PageCanvas page={leaf.back} scale={size.scale} />
                <div data-shade="back" className="leaf-shade leaf-shade--back" />
              </div>
            </div>
          ))}

          {spread && !atStart && !atEnd ? (
            <div
              className="gutter"
              aria-hidden="true"
              style={{ zIndex: leafCount * 2 + 4 }}
            />
          ) : null}

          {/* shadow the turning leaf casts on the spread below */}
          <div
            ref={castRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 opacity-0"
            style={{
              zIndex: leafCount * 2 + 5,
              left: 0,
              width: size.w,
              transformOrigin: spread ? "right center" : "left center",
              willChange: "transform, opacity",
              background:
                "linear-gradient(to left, rgb(0 0 0 / 0.45), rgb(0 0 0 / 0.12) 34%, transparent 72%)",
            }}
          />

          {/* the corner a reader reaches for */}
          {!atEnd ? (
            <button
              type="button"
              onClick={() => turn(1)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") peek(0.055);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") peek(0);
              }}
              onFocus={() => peek(0.055)}
              onBlur={() => peek(0)}
              aria-label="Turn to the next page"
              className="peel no-print"
              style={{ zIndex: leafCount * 2 + 12 }}
            />
          ) : null}
        </div>
      </div>

      {/* ---- controls ---- */}
      <div
        className={`no-print mx-auto flex max-w-broadsheet flex-wrap items-center justify-center gap-2 px-3 ${
          fill ? "mt-1.5 shrink-0" : "mt-4"
        }`}
      >
        <button
          type="button"
          onClick={() => turn(-1)}
          disabled={atStart}
          className="border-2 border-rule px-3 py-1.5 font-cond text-[0.72rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          &larr; Back
        </button>

        <p
          aria-live="polite"
          className="min-w-[13rem] text-center font-cond text-[0.72rem] uppercase tracking-news"
        >
          {visible.length > 0
            ? `${visible.map((page) => page.folio).join(" · ")} — ${visible[
                visible.length - 1
              ].section}`
            : "End of edition"}
        </p>

        <button
          type="button"
          onClick={() => turn(1)}
          disabled={atEnd}
          className="border-2 border-rule px-3 py-1.5 font-cond text-[0.72rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-ink"
        >
          Turn &rarr;
        </button>

        <button
          type="button"
          onClick={() => setSound((value) => !value)}
          aria-pressed={sound}
          className="border border-rule/60 px-2.5 py-1.5 font-cond text-[0.68rem] uppercase tracking-news transition-colors hover:bg-ink hover:text-paper"
        >
          {sound ? "Paper on" : "Paper off"}
        </button>
      </div>

      {/* ---- page index ---- */}
      <nav
        aria-label={`${label} contents`}
        className={`no-print mx-auto flex max-w-broadsheet flex-wrap items-center justify-center gap-1.5 px-3 ${
          fill ? "mt-1 shrink-0" : "mt-3"
        }`}
      >
        {pages.map((page, index) => {
          const targetLeaf = spread
            ? Math.ceil(index / 2)
            : index;
          const active = visible.some((item) => item.id === page.id);
          return (
            <button
              key={page.id}
              type="button"
              onClick={() => goToLeaf(targetLeaf)}
              aria-current={active ? "true" : undefined}
              title={page.section}
              className={`border px-2 py-1 font-cond text-[0.62rem] uppercase tracking-wide transition-colors ${
                active
                  ? "border-spot bg-spot/15 text-spot"
                  : "border-rule/40 text-faded hover:border-rule hover:text-ink"
              }`}
            >
              {page.folio}
            </button>
          );
        })}
      </nav>

      {fill ? null : (
        <p className="no-print mt-3 text-center font-cond text-[0.66rem] uppercase tracking-news text-faded">
          Click the corner &middot; drag the sheet &middot; arrow keys turn
          pages
        </p>
      )}
    </div>
  );
}

/* ---------- a single printed page, composed then scaled ---------- */

const PageCanvas = memo(function PageCanvas({
  page,
  scale,
}: {
  page: EditionPage | null;
  scale: number;
}) {
  if (!page) {
    return (
      <div className="newsprint h-full w-full bg-stock">
        <div
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center opacity-25"
        >
          <span className="masthead text-2xl">Yash Times</span>
        </div>
      </div>
    );
  }

  return (
    <div className="newsprint h-full w-full overflow-hidden bg-paper">
      <div
        className="origin-top-left"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
        }}
      >
        <div className={page.bleed ? "pg h-full" : "pg h-full px-5 py-4"}>
          {page.node}
        </div>
      </div>
    </div>
  );
});
