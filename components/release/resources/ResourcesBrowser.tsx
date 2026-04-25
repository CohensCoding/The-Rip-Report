"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { ResourcesData, Retailer } from "@/types/resources";
import type { BoxFormatDeepDive } from "@/types/resources";
import type { ImageryData } from "@/types/imagery";
import type { RelatedReading } from "@/types/resources";

import type { ResourcesInitialFilters } from "@/lib/resources-filters";

import { OverviewImage } from "../overview/OverviewImage";

type Props = {
  slug: string;
  data: ResourcesData;
  imagery: ImageryData | undefined;
  initial: ResourcesInitialFilters;
};

function buildSearchParams(slug: string, s: ResourcesInitialFilters): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  const qs = p.toString();
  return qs ? `/releases/${slug}/resources?${qs}` : `/releases/${slug}/resources`;
}

function trustBadge(trust: Retailer["trustLevel"]): { label: string; cls: string } {
  if (trust === "official") return { label: "Official", cls: "bg-emerald-500/15 text-emerald-100 ring-1 ring-emerald-500/35" };
  if (trust === "vetted-secondary") return { label: "Vetted", cls: "bg-zinc-900 text-zinc-200 ring-1 ring-zinc-700/60" };
  return { label: "Marketplace", cls: "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/40" };
}

function relationshipLabel(rel: RelatedReading["relationship"]): string {
  if (rel === "previous-year") return "Previous year";
  if (rel === "chrome-version") return "Chrome version";
  if (rel === "companion-set") return "Companion set";
  return "Related";
}

function priceLabel(price: number | null | undefined): string {
  if (typeof price === "number" && Number.isFinite(price)) return `$${price.toFixed(2)}`;
  return "Check retailer";
}

function formatSpecLine(fmt: BoxFormatDeepDive): string {
  const { cardsPerPack, packsPerBox } = fmt.spec;
  const pack = typeof packsPerBox === "number" ? `${packsPerBox} packs` : "packs TBD";
  return `${cardsPerPack} cards/pack · ${pack}`;
}

function isBulk(fmt: BoxFormatDeepDive): boolean {
  return fmt.formatName.toLowerCase() === "bulk";
}

export function ResourcesBrowser({ slug, data, imagery, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(initial.q);

  const filteredFormats = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return data.boxFormatDeepDive ?? [];
    return (data.boxFormatDeepDive ?? []).filter((f) => {
      const hay = `${f.formatName} ${f.guarantees.join(" ")} ${f.exclusives.join(" ")} ${f.bestForVerdict.audience} ${f.bestForVerdict.reasoning}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [data.boxFormatDeepDive, q]);

  const apply = () => startTransition(() => router.replace(buildSearchParams(slug, { q })));
  const reset = () => {
    setQ("");
    startTransition(() => router.replace(`/releases/${slug}/resources`));
  };

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:items-end">
        <label className="block min-w-[220px] flex-1 text-xs text-zinc-500">
          Search resources
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Mega, Mojo, Geometric, grading…"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={apply}
            className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
          >
            Apply &amp; share URL
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            Reset
          </button>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Box format deep-dive</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          The spine of this page: specs, guarantees, exclusives, and a Rip Report “best for” verdict with both audience and reasoning.
        </p>
        <div className="mt-6 space-y-6">
          {filteredFormats.map((fmt) => {
            const imgPath = fmt.imageSlug && imagery?.images?.[fmt.imageSlug]?.path;
            const bulk = isBulk(fmt);
            return (
              <article
                key={fmt.formatName}
                className={cn(
                  "rounded-2xl border bg-zinc-950/35 p-6",
                  bulk ? "border-amber-500/25 bg-amber-500/5" : "border-zinc-800/80",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl text-paper">{fmt.formatName}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{formatSpecLine(fmt)}</p>
                    {bulk ? (
                      <p className="mt-2 text-sm text-amber-100/80">
                        Provisional: Bulk configuration is not fully confirmed — missing fields are intentionally left blank.
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">MSRP</div>
                      <div className="mt-1 text-xl text-paper">
                        {typeof fmt.pricing.msrp === "number" ? `$${fmt.pricing.msrp.toFixed(2)}` : <span className="text-zinc-600">TBD</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Current</div>
                      <div className="mt-1 text-xl text-paper">{priceLabel(fmt.pricing.currentPrice)}</div>
                    </div>
                    <div className="h-16 w-24 overflow-hidden rounded-md bg-zinc-900">
                      {imgPath ? <OverviewImage src={imgPath} alt={fmt.formatName} className="h-full w-full object-cover" /> : null}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-3">
                  <div className="rounded-xl border border-zinc-800/80 bg-black/20 p-4">
                    <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Guarantees</div>
                    <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                      {fmt.guarantees.map((g) => (
                        <li key={g} className="leading-snug">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-zinc-800/80 bg-black/20 p-4">
                    <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Exclusives</div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {fmt.exclusives.map((e) => (
                        <span key={e} className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border border-zinc-800/80 bg-black/20 p-4">
                    <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Best for</div>
                    <div className="mt-3 text-sm font-medium text-paper">{fmt.bestForVerdict.audience}</div>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-300">{fmt.bestForVerdict.reasoning}</p>
                  </div>
                </div>

                {fmt.expectedValueNote ? (
                  <p className={cn("mt-6 text-sm leading-relaxed", bulk ? "text-amber-100/80" : "text-zinc-400")}>
                    {fmt.expectedValueNote}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Buy links</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Trust signaling matters: official Topps links, vetted secondary retailers, and marketplaces are visually distinct.
        </p>
        <div className="mt-6 space-y-6">
          {(data.buyLinks ?? []).map((b) => (
            <div key={b.format} className="rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
              <h3 className="font-serif text-xl text-paper">{b.format}</h3>
              <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-800/80">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Retailer</th>
                      <th className="px-3 py-2">Trust</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">As of</th>
                      <th className="px-3 py-2"> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {b.retailers.map((r) => {
                      const badge = trustBadge(r.trustLevel);
                      const p = priceLabel(r.price ?? null);
                      return (
                        <tr key={r.url} className="border-b border-zinc-900/80">
                          <td className="px-3 py-2 font-medium text-paper">{r.name}</td>
                          <td className="px-3 py-2">
                            <span className={cn("rounded px-2 py-0.5 text-[11px] font-medium", badge.cls)}>{badge.label}</span>
                          </td>
                          <td className="px-3 py-2 font-mono text-zinc-200">{p}</td>
                          <td className="px-3 py-2 text-zinc-500">{r.asOf ?? "—"}</td>
                          <td className="px-3 py-2 text-right">
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-emerald-400/90 hover:underline"
                            >
                              Open
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-zinc-600">
                Note: <code className="rounded bg-black/30 px-1">currentPrice</code> is intentionally not sourced yet across retailers — “Check retailer” is the correct render.
              </p>
            </div>
          ))}
        </div>
      </section>

      {(data.breakProviders ?? []).length ? (
        <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Break providers</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">Services, not product buy links.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.breakProviders!.map((b) => (
              <a
                key={b.url}
                href={b.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-zinc-800/80 bg-black/20 p-4 hover:border-zinc-600"
              >
                <div className="font-medium text-paper">{b.name}</div>
                {b.note ? <p className="mt-2 text-sm text-zinc-400">{b.note}</p> : null}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      {data.gradingConsiderations ? (
        <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Grading considerations</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300">{data.gradingConsiderations}</p>
        </section>
      ) : null}

      {data.errata?.length ? (
        <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Errata</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Corrections and updates post-publish. Reverse chronological with date stamps.
          </p>
          <div className="mt-6 space-y-3">
            {[...data.errata]
              .slice()
              .sort((a, b) => b.date.localeCompare(a.date))
              .map((e) => (
                <div key={`${e.date}-${e.summary}`} className="rounded-lg border border-zinc-800/80 bg-black/20 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium text-paper">{e.summary}</div>
                    <div className="text-xs text-zinc-500 tabular-nums">{e.date}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {e.sectionsAffected.map((s) => (
                      <span key={s} className="rounded bg-zinc-900 px-2 py-0.5 text-[11px] text-zinc-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {data.relatedReading?.length ? (
        <section className="mt-12 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Related reading</h2>
          <p className="mt-2 max-w-3xl text-sm text-zinc-400">
            Placeholder slugs for future releases — links stay inert until those releases are sourced.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {data.relatedReading.map((r) => (
              <div key={r.slug} className="rounded-xl border border-zinc-800/80 bg-black/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium text-paper">{r.slug}</div>
                    <div className="mt-1 text-xs text-zinc-500">{relationshipLabel(r.relationship)}</div>
                  </div>
                  <span className="rounded bg-zinc-950 px-2 py-0.5 text-[11px] text-zinc-500 ring-1 ring-zinc-800">
                    Not yet sourced
                  </span>
                </div>
                {r.editorialBlurb ? <p className="mt-3 text-sm leading-relaxed text-zinc-400">{r.editorialBlurb}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.officialResources?.length ? (
        <section className="mt-12">
          <h2 className="font-serif text-2xl text-paper sm:text-3xl">Official resources</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-950/35">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Label</th>
                  <th className="px-3 py-2">Posted</th>
                  <th className="px-3 py-2"> </th>
                </tr>
              </thead>
              <tbody>
                {data.officialResources.map((o) => (
                  <tr key={o.url} className="border-b border-zinc-900/80">
                    <td className="px-3 py-2 font-mono text-xs text-zinc-400">{o.type}</td>
                    <td className="px-3 py-2 font-medium text-paper">{o.label}</td>
                    <td className="px-3 py-2 text-zinc-500 tabular-nums">{o.postedAt}</td>
                    <td className="px-3 py-2 text-right">
                      <a href={o.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400/90 hover:underline">
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

