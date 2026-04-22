import type { Release } from "@/types/release";

import { ReleaseTileLarge } from "./ReleaseTileLarge";

export function FeaturedReleases({ releases }: { releases: Release[] }) {
  return (
    <section className="pb-14 sm:pb-18">
      <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
        <div className="mb-5 text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
          FEATURED BREAKDOWNS
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {releases.map((r) => (
            <ReleaseTileLarge key={r.slug} release={r} />
          ))}
        </div>
      </div>
    </section>
  );
}

