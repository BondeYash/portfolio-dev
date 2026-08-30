export function PageIntro({
  index,
  kicker,
  title,
  lede,
}: {
  index: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-14 max-w-3xl md:mb-20">
      <p className="type-label text-cyan">
        {index} / {kicker}
      </p>
      <h1 className="type-page mt-4 text-ink">{title}</h1>
      {lede ? <p className="type-lede mt-6 max-w-2xl text-muted">{lede}</p> : null}
    </header>
  );
}
