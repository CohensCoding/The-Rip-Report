import { getAllReleases, getFeaturedReleases } from "@/lib/releases";

import { FeaturedReleases } from "@/components/homepage/FeaturedReleases";
import { FilterBar } from "@/components/homepage/FilterBar";
import { Footer } from "@/components/homepage/Footer";
import { Hero } from "@/components/homepage/Hero";
import { ReleaseGrid } from "@/components/homepage/ReleaseGrid";

export default function HomePage() {
  const featured = getFeaturedReleases();
  const releases = getAllReleases();

  return (
    <main className="min-h-dvh">
      <Hero />

      <FeaturedReleases releases={featured} />

      <section className="pb-10 sm:pb-14">
        <div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8">
          <div className="mb-5 text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">
            THE ARCHIVE
          </div>

          <div className="mb-8">
            <FilterBar />
          </div>

          <ReleaseGrid releases={releases} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
