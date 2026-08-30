export function SectionHeading({
  index,
  eyebrow,
  title,
}: {
  index: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4 md:mb-16">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-muted">
        {index} — {eyebrow}
      </p>
      <h2 className="max-w-2xl font-display text-3xl font-medium tracking-tightest text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>
    </div>
  );
}
