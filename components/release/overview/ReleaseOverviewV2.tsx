import Link from "next/link";

import { brandLabels, sportConfig } from "@/lib/sport-config";
import { parallelVariationCount, resolveAutoSignerCount } from "@/lib/overview-stats";
import { pickRainbowStrip } from "@/lib/pick-rainbow-strip";
import { cn } from "@/lib/utils";
import type { Release } from "@/types/release";

import { RainbowStripSummary } from "../parallels/RainbowStripSummary";

import { formatLongDate } from "../_utils";
import { ReleaseSubNav } from "../ReleaseSubNav";
import AutographsTeaser from "./AutographsTeaser";
import InsertsTeaser from "./InsertsTeaser";
import { OverviewImage } from "./OverviewImage";
import { OverviewShell } from "./OverviewShell";
import SetFramingBlock from "./SetFramingBlock";

type Props = { bundle: Release };

function statusLabel(status: Release["status"]): string | null {
  if (status === "dropped") return "Latest drop";
  if (status === "released") return null;
  if (status === "preorder") return "Preorder";
  if (status === "announced") return "Announced";
  return null;
}

export function ReleaseOverviewV2({ bundle }: Props) {
  const sport = sportConfig[bundle.sport];
  const brand = brandLabels[bundle.brand] ?? bundle.brand;
  const imagery = bundle._loaded?.imagery;
  const checklist = bundle._loaded?.checklist;
  const teams = bundle._loaded?.teams;
  const parallelsData = bundle._loaded?.parallels;
  const autographs = bundle._loaded?.autographs;
  const inserts = bundle._loaded?.inserts;
  const resources = bundle._loaded?.resources;

  const allParallels = parallelsData?.groups.flatMap((g) => g.parallels ?? []) ?? [];
  const strip = pickRainbowStrip(allParallels, 5);
  const autoSigners = resolveAutoSignerCount(checklist, autographs);
  const parallelTotal = parallelVariationCount(parallelsData);
  const chart = teams?.cardsByTeamChart ?? [];
  const topTeams = chart.slice(0, 10);
  const restCount = Math.max(0, chart.length - topTeams.length);
  const subsets = bundle.baseSetSummary.subsets ?? [];
  const pill = statusLabel(bundle.status);

  const maxTeamCount = topTeams[0]?.cardCount ?? 0;
  const heaviestTeams =
    maxTeamCount > 0 ? topTeams.filter((t) => t.cardCount === maxTeamCount).map((t) => t.teamName) : [];
  const teamsInsight =
    heaviestTeams.length > 0
      ? heaviestTeams.length === 1
        ? `${heaviestTeams[0]} leads the checklist at ${maxTeamCount} cards.`
        : `${heaviestTeams.slice(0, 3).join(", ")}${heaviestTeams.length > 3 ? " and others" : ""} are tied for most at ${maxTeamCount} cards.`
      : null;

  const insertsCount = inserts?.sets?.reduce((sum, s) => sum + (s.size || 0), 0) ?? 0;
  const autographSignerCount = autographs?.signerIndex?.length ?? (typeof autoSigners === "number" ? autoSigners : 0);
  const parallelsCount = typeof parallelTotal === "number" ? parallelTotal : 0;

  const compositionSegments: { key: string; label: string; value: number; opacity: string }[] = [
    ...subsets.map((s, idx) => ({
      key: s.name,
      label: s.name,
      value: s.size,
      opacity: idx === 0 ? "opacity-90" : idx === 1 ? "opacity-65" : "opacity-45",
    })),
    { key: "Inserts", label: "Inserts", value: insertsCount, opacity: "opacity-35" },
    { key: "Autographs", label: "Autographs", value: autographSignerCount, opacity: "opacity-30" },
    { key: "Parallels", label: "Parallels", value: parallelsCount, opacity: "opacity-25" },
  ].filter((s) => s.value > 0);

  const compositionTotal = compositionSegments.reduce((sum, s) => sum + s.value, 0) || 1;

  const renderFormatCards = (formats: typeof bundle.boxFormats) => (
    <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {formats.map((fmt) => {
        const slugKey = fmt.imageSlug;
        const src = slugKey && imagery?.images?.[slugKey]?.path;
        const cards = fmt.cardsPerPack * fmt.packsPerBox;
        return (
          <article key={fmt.name} className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4">
            <div className="flex gap-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-900">
                {src ? (
                  <OverviewImage src={src} alt={fmt.name} className="h-full w-full object-cover" />
                ) : (
                  <div className={cn("flex h-full items-center justify-center text-[10px] text-paper/80", sport.bgClass)}>
                    {fmt.name}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-serif text-lg text-paper">{fmt.name}</h3>
                <p className="mt-1 text-xs tabular-nums text-zinc-500">
                  {fmt.cardsPerPack} × {fmt.packsPerBox} = {cards} cards
                </p>
                {fmt.msrp != null ? <p className="mt-1 text-sm tabular-nums text-zinc-300">${fmt.msrp.toFixed(2)} MSRP</p> : null}
              </div>
            </div>
            <p className="mt-3 text-sm leading-snug text-zinc-400">{fmt.bestFor}</p>
          </article>
        );
      })}
    </div>
  );

  return (
    <main className="pb-24">
      <div id="overview-top" />
      <ReleaseSubNav slug={bundle.slug} current="overview" activeBorderClass={cn("border-b-2", sport.borderClass)} />

      {/* Module 1 */}
      <header className="relative">
        <div className={cn("h-2 w-full md:h-2.5", sport.bgClass)} />
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 md:py-20">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
            <span className="tabular">{formatLongDate(bundle.releaseDate)}</span>
            <span>·</span>
            <span>{brand}</span>
            <span>·</span>
            <span className={sport.textClass}>{sport.label}</span>
            {pill ? (
              <>
                <span>·</span>
                <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-medium text-emerald-300">
                  {pill}
                </span>
              </>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] text-paper sm:text-5xl md:text-6xl">
            {bundle.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">{bundle.tagline}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {bundle.boxFormats.slice(0, 5).map((fmt) => {
              const slugKey = fmt.imageSlug;
              const src = slugKey && imagery?.images?.[slugKey]?.path;
              return (
                <div key={fmt.name} className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 p-3">
                  <div className="aspect-[4/3] overflow-hidden rounded-md bg-zinc-900">
                    {src ? (
                      <OverviewImage
                        src={src}
                        alt={imagery?.images?.[slugKey!]?.alt ?? fmt.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className={cn("flex h-full items-center justify-center p-3 text-center", sport.bgClass)}>
                        <div className="font-serif text-sm text-paper/90">{fmt.name}</div>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-center font-serif text-sm text-paper">{fmt.name}</p>
                </div>
              );
            })}
          </div>

          <div className="prose prose-invert mt-12 max-w-3xl text-base leading-relaxed text-zinc-300">
            {bundle.synopsis.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="mb-4 last:mb-0">
                {para.trim()}
              </p>
            ))}
          </div>
        </div>
      </header>

      <SetFramingBlock framing={bundle.commentary.setFraming} />

      {/* Module 3 (keeps id overview-mod-2) */}
      <OverviewShell id="overview-mod-2" eyebrow="CARDS BY TEAM">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Who owns the checklist</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Total cards per team (NBA + NCAA). Tap a team when the Teams route ships; bars scale to the max count in this chart.
        </p>
        {teamsInsight ? <p className="mt-2 max-w-2xl text-sm text-zinc-500">{teamsInsight}</p> : null}
        <div className="mt-8 space-y-2">
          {topTeams.map((row) => {
            const max = topTeams[0]?.cardCount || 1;
            const pct = Math.round((row.cardCount / max) * 100);
            return (
              <div key={row.teamSlug} className="flex items-center gap-3 text-sm">
                <div className="w-32 shrink-0 truncate text-zinc-400 sm:w-40">{row.teamName}</div>
                <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div className={cn("h-full rounded-full", sport.bgClass)} style={{ width: `${pct}%` }} />
                </div>
                <div className="w-10 shrink-0 text-right tabular-nums text-zinc-300">{row.cardCount}</div>
              </div>
            );
          })}
        </div>
        {restCount > 0 ? (
          <details className="mt-4 text-sm text-zinc-500">
            <summary className="cursor-pointer text-zinc-400 hover:text-paper">
              +{restCount} more teams in the full data
            </summary>
            <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs">
              {chart.slice(10).map((row) => (
                <li key={row.teamSlug}>
                  {row.teamName} — {row.cardCount} cards
                </li>
              ))}
            </ul>
          </details>
        ) : null}
        <p className="mt-8 text-sm text-zinc-500">
          <span className="text-zinc-600">Teams landing</span> — route coming next in the migration queue.
        </p>
      </OverviewShell>

      {/* Module 4 (keeps id overview-mod-3) */}
      <OverviewShell id="overview-mod-3" eyebrow="THE FULL SET">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Checklist at a glance</h2>
        <p className="mt-2 text-xs text-zinc-500">
          Paper = matte cardstock base. Chrome = refractor finish.
        </p>

        <div className="mt-6 rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium text-zinc-300">Composition snapshot</div>
            <div className="text-xs tabular-nums text-zinc-500">
              {compositionTotal.toLocaleString()} total (subset sizes + insert/auto/parallel rollups)
            </div>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-zinc-900">
            <div className="flex h-full w-full">
              {compositionSegments.map((seg) => {
                const pct = Math.max(1, Math.round((seg.value / compositionTotal) * 100));
                return (
                  <div
                    key={seg.key}
                    className={cn(sport.bgClass, seg.opacity)}
                    style={{ width: `${pct}%` }}
                    title={`${seg.label}: ${seg.value}`}
                    aria-hidden
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {compositionSegments.map((seg) => (
              <div key={seg.key} className="flex items-center justify-between gap-3 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", sport.bgClass, seg.opacity)} aria-hidden />
                  <span>{seg.label}</span>
                </div>
                <span className="tabular-nums text-zinc-300">{seg.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm tabular-nums">
          {subsets.map((s) => (
            <div key={s.name} className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
              <span className="text-lg font-semibold text-paper">{s.size}</span>{" "}
              <span className="text-zinc-400">{s.name.toLowerCase()}</span>
            </div>
          ))}
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <span className="text-lg font-semibold text-paper">{autoSigners ?? "—"}</span>{" "}
            <span className="text-zinc-400">autograph signers</span>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <span className="text-lg font-semibold text-paper">{parallelTotal ?? "—"}</span>{" "}
            <span className="text-zinc-400">parallel variations</span>
          </div>
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          <Link
            href={`/releases/${bundle.slug}/checklist`}
            className="font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
          >
            Open the full checklist
          </Link>
          <span className="text-zinc-600"> — filters, subsets, and player search.</span>
        </p>
      </OverviewShell>

      <InsertsTeaser inserts={inserts} imagery={imagery} slug={bundle.slug} />

      {/* Module 6 (keeps id overview-mod-5) */}
      <OverviewShell id="overview-mod-5" eyebrow="THE RAINBOW">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Parallel ladder (teaser)</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">{parallelsData?.rainbowSummary.headlineStat}</p>
        <p className="mt-2 max-w-3xl text-sm text-zinc-500">
          Parallels are colored variants of the same card. Lower print runs are rarer.
        </p>
        <RainbowStripSummary strip={strip} className="mt-8" />
        <p className="mt-8 text-sm text-zinc-500">
          <Link
            href={`/releases/${bundle.slug}/parallels`}
            className="font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
          >
            Explore every parallel
          </Link>
          <span className="text-zinc-600"> — full ladders, per-format odds, and format exclusivity.</span>
        </p>
      </OverviewShell>

      <AutographsTeaser slug={bundle.slug} sport={bundle.sport} autographs={autographs} />

      {/* Module 8 (keeps id overview-mod-6) */}
      <OverviewShell id="overview-mod-6" eyebrow="THE BOX BREAKDOWN">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Where do I start?</h2>

        <div className="mt-8 space-y-10">
          <section>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Tier 1 — Retail</div>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">Wide availability, lower cost. Great for sampling and casual ripping.</p>
            {renderFormatCards(bundle.boxFormats.filter((f) => f.tier === "retail"))}
          </section>

          <section>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Tier 2 — Hobby / Mid</div>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">Better odds and structured hits. The default lane for serious ripping.</p>
            {renderFormatCards(bundle.boxFormats.filter((f) => f.tier === "hobby"))}
          </section>

          <section>
            <div className="text-xs font-medium tracking-wide text-zinc-500 uppercase">Tier 3 — Premium / Limited</div>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">Harder to access, higher upside. Often break-driven formats.</p>
            {renderFormatCards(bundle.boxFormats.filter((f) => f.tier === "premium"))}
          </section>
        </div>

        <p className="mt-8 text-sm text-zinc-500">
          <Link
            href={`/releases/${bundle.slug}/resources`}
            className="font-medium text-emerald-400/90 underline-offset-2 hover:text-emerald-300 hover:underline"
          >
            Full format analysis
          </Link>
          <span className="text-zinc-600"> — format advice, links, and buying guidance.</span>
        </p>
      </OverviewShell>

      {/* Editorial */}
      <OverviewShell id="overview-editorial" eyebrow="DEEP READ" className="border-b border-zinc-800/80">
        <div className="mx-auto max-w-3xl space-y-3">
          {[
            ["What's new", bundle.commentary.whatsNew],
            ["How it compares", bundle.commentary.compToLastYear],
            ["Red flags", bundle.commentary.redFlags],
            ["Bull case", bundle.commentary.bullCase],
            ["Bear case", bundle.commentary.bearCase],
          ]
            .filter(([, body]) => Boolean(body?.trim()))
            .map(([title, body]) => (
              <details key={title} className="group rounded-lg border border-zinc-800 bg-zinc-950/40">
                <summary className="cursor-pointer list-none px-4 py-3 font-medium text-paper marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-zinc-500">{title}</span>
                </summary>
                <div className="border-t border-zinc-800/80 px-4 py-3 text-sm leading-relaxed text-zinc-400">
                  {(body as string).trim()}
                </div>
              </details>
            ))}
        </div>
      </OverviewShell>

      <footer className="mx-auto max-w-6xl px-5 py-10 text-xs text-zinc-600 sm:px-8">
        {resources?.officialResources?.[0] ? (
          <a href={resources.officialResources[0].url} className="underline decoration-zinc-700 underline-offset-4 hover:text-zinc-400">
            {resources.officialResources[0].label}
          </a>
        ) : null}
        {bundle.lastUpdated ? <span className="ml-3">Updated {bundle.lastUpdated}</span> : null}
      </footer>
    </main>
  );
}
