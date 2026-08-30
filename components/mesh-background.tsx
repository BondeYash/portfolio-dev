"use client";

export function MeshBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -left-24 top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[110px] motion-safe:animate-pulse" />
      <div className="absolute right-[-6rem] top-24 h-[22rem] w-[22rem] rounded-full bg-accent-dim/60 blur-[100px]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-[20rem] w-[36rem] rounded-full bg-accent/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(var(--line)/0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--line)/0.07)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  );
}
