export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent/25 blur-[90px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-40 h-64 w-64 rounded-full bg-violet/20 blur-[80px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-80 rounded-full bg-cyan/15 blur-[90px]"
      />
      <div className="relative mx-auto w-full max-w-site px-5 py-16 sm:px-8 sm:py-20">
        {children}
      </div>
    </div>
  );
}
