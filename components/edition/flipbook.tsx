"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
      const room = fill
        ? Math.max(200, stage.clientHeight - 2)
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
      const lift = Math.sin(progress * Math.PI);
      el.style.transform = `rotateY(${-180 * progress}deg) translateZ(${(
        lift * 52
      ).toFixed(2)}px)`;
      el.style.zIndex = String(
        raised
          ? leafCount * 2 + 10 + stackOffset
          : zFor(index, flippedRef.current),
      );

      const front = el.querySelector<HTMLElement>("[data-shade='front']");
      const back = el.querySelector<HTMLElement>("[data-shade='back']");
      if (front) front.style.opacity = String(clamp(progress * 1.7) * 0.85);
      if (back) back.style.opacity = String(clamp((1 - progress) * 1.7) * 0.85);

      if (castRef.current) {
        castRef.current.style.opacity = String(lift * 0.4);
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
        el.style.transform = `rotateY(${-180 * progress}deg) translateZ(0px)`;
        el.style.zIndex = String(zFor(i, flippedCount));
        const front = el.querySelector<HTMLElement>("[data-shade='front']");
        const back = el.querySelector<HTMLElement>("[data-shade='back']");
        if (front) front.style.opacity = "0";
        if (back) back.style.opacity = "0";
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
        duration: 1.02,
        ease: "power2.inOut",
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
            duration: 0.62,
            ease: "power2.inOut",
            onUpdate: () => paint(index, proxy.p, true, order),
          },
          order * 0.16,
        );
        if (order > 0) {
          timeline.call(rustle, undefined, order * 0.16);
        }
      });
    },
    [leafCount, paint, rustle, turn],
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

      dragRef.current = {
        leaf: index,
        dir,
        startX: event.clientX,
        progress: dir === 1 ? 0 : 1,
      };
      book.setPointerCapture(event.pointerId);
    },
    [leafCount, spread],
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      if (!drag) return;
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

      const commit = drag.dir === 1 ? drag.progress > 0.32 : drag.progress < 0.68;
      const end = commit ? (drag.dir === 1 ? 1 : 0) : drag.dir === 1 ? 0 : 1;

      busyRef.current = true;
      if (commit) rustle();
      const proxy = { p: drag.progress };
      gsap.to(proxy, {
        p: end,
        duration: 0.5,
        ease: "power2.out",
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

  const openPageId = visible[visible.length - 1]?.id;
  useEffect(() => {
    if (!syncHash || !openPageId) return;
    const hash = openPageId === pages[0]?.id ? " " : `#${openPageId}`;
    window.history.replaceState(null, "", hash === " " ? location.pathname : hash);
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
        className={`book-stage relative mx-auto flex w-full items-center justify-center px-1 ${
          fill ? "min-h-0 flex-1 overflow-hidden py-0" : "py-2"
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
              }}
              className="leaf"
              style={{
                width: size.w,
                height: size.h,
                left: spread ? size.w : 0,
              }}
            >
              <div className="leaf-face shadow-leaf">
                <PageCanvas page={leaf.front} scale={size.scale} />
                <div
                  data-shade="front"
                  className="leaf-shade leaf-shade--front"
                />
              </div>
              <div className="leaf-face leaf-face--back shadow-leaf">
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
              background:
                "linear-gradient(to left, rgb(0 0 0 / 0.45), transparent 70%)",
            }}
          />

          {/* the corner a reader reaches for */}
          {!atEnd ? (
            <button
              type="button"
              onClick={() => turn(1)}
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

function PageCanvas({
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
        <div className="pg px-5 py-4">{page.node}</div>
      </div>
    </div>
  );
}
