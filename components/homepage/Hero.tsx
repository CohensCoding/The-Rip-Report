export function Hero() {
  return (
    <section className="pt-16 pb-10 sm:pt-24 sm:pb-14">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="space-y-6">
          <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            ISSUE 01 · <span className="tabular">APRIL 2026</span>
          </div>

          <h1 className="text-6xl leading-[0.92] sm:text-7xl lg:text-8xl">Rip Report</h1>

          <p className="max-w-2xl text-lg text-paper/80 sm:text-xl">
            Sports card release breakdowns, without the noise.
          </p>

          <div className="h-px w-full bg-zinc-800" />
        </div>
      </div>
    </section>
  );
}

