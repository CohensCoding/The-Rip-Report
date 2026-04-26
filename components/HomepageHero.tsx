import { FoilPack } from "@/components/FoilPack";
import { Footer } from "@/components/homepage/Footer";
import { getFeaturedReleases } from "@/lib/releases";
import { brandLabels, sportConfig } from "@/lib/sport-config";

function formatReleaseDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  }).format(d);
}

export function HomepageHero() {
  const featured = getFeaturedReleases().slice(0, 3);
  const packs = featured.length ? featured : [];

  return (
    <main className="min-h-dvh">
      <section className="pt-16 pb-12 sm:pt-24">
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

          <div className="mt-10 grid gap-6 lg:grid-cols-3 max-[900px]:grid-cols-1">
            {packs.map((r) => {
              const sport = sportConfig[r.sport];
              const brand = brandLabels[r.brand] ?? r.brand;
              const chip = `${sport.label} · ${brand} · ${formatReleaseDate(r.releaseDate)}`;
              return (
                <div key={r.slug} className="min-h-[420px]">
                  <FoilPack
                    href={`/releases/${r.slug}`}
                    issueKicker="THE RIP REPORT"
                    wordmark={r.shortTitle ?? r.title}
                    title={r.title}
                    subtitle={r.tagline}
                    chipLabel={chip}
                    chipDotHex={"accentHex" in sport && typeof sport.accentHex === "string" ? sport.accentHex : "#10B981"}
                    ctaLabel="Read the breakdown"
                  />
                </div>
              );
            })}
          </div>

          <p className="mt-10 max-w-3xl text-sm leading-relaxed text-zinc-400">
            Three floating foil packs — each one is a direct jump into a full breakdown. Archive returns later; v1 is
            intentionally focused on the best current reads.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

