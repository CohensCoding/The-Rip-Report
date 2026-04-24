import { brandLabels, sportConfig } from "@/lib/sport-config";
import { parallelVariationCount, resolveAutoSignerCount } from "@/lib/overview-stats";
import { cn } from "@/lib/utils";
import type { Parallel } from "@/types/parallels";
import type { Release } from "@/types/release";

import { formatLongDate } from "../_utils";
import { Module7ByTheNumbers } from "./Module7ByTheNumbers";
import { OverviewImage } from "./OverviewImage";
import { OverviewShell } from "./OverviewShell";
import { OverviewStickyNav } from "./OverviewStickyNav";

type Props = { bundle: Release };

function statusLabel(status: Release["status"]): string | null {
  if (status === "dropped") return "Latest drop";
  if (status === "released") return null;
  if (status === "preorder") return "Preorder";
  if (status === "announced") return "Announced";
  return null;
}

function pickRainbowStrip(parallels: Parallel[], max = 14): Parallel[] {
  const scored = parallels.map((p) => ({
    p,
    pr: typeof p.printRun === "number" && Number.isFinite(p.printRun) ? p.printRun : Number.POSITIVE_INFINITY,
  }));
  scored.sort((a, b) => a.pr - b.pr);
  return scored.slice(0, max).map((x) => x.p);
}

export function ReleaseOverviewV2({ bundle }: Props) {
  const sport = sportConfig[bundle.sport];
  const brand = brandLabels[bundle.brand] ?? bundle.brand;
  const imagery = bundle._loaded?.imagery;
  const checklist = bundle._loaded?.checklist;
  const teams = bundle._loaded?.teams;
  const parallelsData = bundle._loaded?.parallels;
  const insights = bundle._loaded?.insights;
  const resources = bundle._loaded?.resources;

  const allParallels = parallelsData?.groups.flatMap((g) => g.parallels ?? []) ?? [];
  const strip = pickRainbowStrip(allParallels, 14);
  const autoSigners = resolveAutoSignerCount(checklist, bundle._loaded?.autographs);
  const parallelTotal = parallelVariationCount(parallelsData);
  const chart = teams?.cardsByTeamChart ?? [];
  const topTeams = chart.slice(0, 10);
  const restCount = Math.max(0, chart.length - topTeams.length);
  const teaserRows = checklist?.cards.slice(0, 7) ?? [];
  const subsets = bundle.baseSetSummary.subsets ?? [];
  const pill = statusLabel(bundle.status);

  return (
    <main className="pb-24">
      <div id="overview-top" />
      <OverviewStickyNav slug={bundle.slug} activeBorderClass={cn("border-b-2", sport.borderClass)} />

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
                      <OverviewImage src={src} alt={imagery?.images?.[slugKey!]?.alt ?? fmt.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center p-2 text-center text-[11px] text-zinc-500">
                        {fmt.name}
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

          <div className="mt-10 flex flex-wrap gap-3 border-t border-zinc-800/80 pt-8">
            {bundle.verdict.rating ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
                <div className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Our rating</div>
                <div className="mt-1 font-serif text-xl text-paper">
                  {bundle.verdict.rating.score}{" "}
                  <span className="text-sm text-zinc-400">· {bundle.verdict.rating.label}</span>
                </div>
              </div>
            ) : null}
            <div className="min-w-[220px] flex-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
              <div className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Who this is for</div>
              <p className="mt-1 text-sm leading-snug text-zinc-200">{bundle.verdict.whoThisIsFor}</p>
            </div>
            <div className="min-w-[220px] flex-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
              <div className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Key chase</div>
              <p className="mt-1 text-sm font-medium text-paper">{bundle.verdict.keyChaseCard}</p>
            </div>
            {bundle.verdict.releaseWindow ? (
              <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3">
                <div className="text-[10px] font-medium tracking-wide text-zinc-500 uppercase">Release window</div>
                <p className="mt-1 text-sm text-paper">{bundle.verdict.releaseWindow}</p>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Module 2 */}
      <OverviewShell id="overview-mod-2" eyebrow="CARDS BY TEAM">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Who owns the checklist</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-400">
          Total cards per team (NBA + NCAA). Tap a team when the Teams route ships; bars scale to the max count in this chart.
        </p>
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

      {/* Module 3 */}
      <OverviewShell id="overview-mod-3" eyebrow="THE FULL SET">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Checklist at a glance</h2>
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
            {checklist?.metadata.autoSignerCount == null && autoSigners != null ? (
              <span className="ml-1 text-[10px] uppercase text-zinc-600">(from signer index)</span>
            ) : null}
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2">
            <span className="text-lg font-semibold text-paper">{parallelTotal ?? "—"}</span>{" "}
            <span className="text-zinc-400">parallel variations</span>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-800/80">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">#</th>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Team</th>
                <th className="px-3 py-2">Subset</th>
              </tr>
            </thead>
            <tbody>
              {teaserRows.map((c) => (
                <tr key={`${c.cardNumber}-${c.playerSlug}`} className="border-b border-zinc-900/80">
                  <td className="px-3 py-2 tabular-nums text-zinc-500">{c.cardNumber}</td>
                  <td className="px-3 py-2 text-paper">{c.player}</td>
                  <td className="px-3 py-2 text-zinc-400">{c.team}</td>
                  <td className="px-3 py-2 text-zinc-500">{c.subset}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 text-sm text-zinc-500">
          Full browser with filters ships with the Checklist route — this is a live slice from `checklist.json`.
        </p>
      </OverviewShell>

      {/* Module 4 */}
      <OverviewShell id="overview-mod-4" eyebrow="THE HOLY GRAILS">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">The cards people will still mention in five years</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(bundle.holyGrails ?? []).map((g) => (
            <article key={g.parallelSlug ?? g.player + g.cardName} className="rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4">
              <div className="aspect-[3/4] overflow-hidden rounded-lg bg-zinc-900">
                {g.imageSlug && imagery?.images?.[g.imageSlug]?.path ? (
                  <OverviewImage src={imagery.images[g.imageSlug].path} alt={g.cardName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-4 text-center text-xs text-zinc-500">{g.cardName}</div>
                )}
              </div>
              <p className="mt-3 font-serif text-lg text-paper">{g.player}</p>
              <p className="text-sm text-zinc-400">{g.cardName}</p>
              {g.estimatedValue ? (
                <p className="mt-2 inline-block rounded-md bg-zinc-900 px-2 py-1 text-xs text-zinc-300">{g.estimatedValue}</p>
              ) : null}
              <p className="mt-2 text-sm leading-snug text-zinc-400 line-clamp-3">{g.reason}</p>
            </article>
          ))}
        </div>
      </OverviewShell>

      {/* Module 5 */}
      <OverviewShell id="overview-mod-5" eyebrow="THE RAINBOW">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Parallel ladder (teaser)</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">{parallelsData?.rainbowSummary.headlineStat}</p>
        <div className="mt-8 flex flex-wrap items-end gap-1 sm:gap-1.5">
          {strip.length === 0 ? (
            <p className="text-sm text-zinc-500">No parallel color data available.</p>
          ) : null}
          {strip.map((p) => (
            <div key={p.slug} className="flex flex-col items-center" title={p.name}>
              <div
                className="w-5 rounded-t sm:w-6"
                style={{
                  height: `${12 + Math.min(48, (typeof p.printRun === "number" ? 320 / p.printRun : 20))}px`,
                  backgroundColor: p.color.hex,
                }}
              />
              <div className="mt-1 max-w-[3.5rem] truncate text-center text-[9px] tabular-nums text-zinc-500 sm:text-[10px]">
                {typeof p.printRun === "number" ? `/${p.printRun}` : p.printRunLabel ?? "—"}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-zinc-500">
          <span className="text-zinc-600">Explore every parallel</span> — Parallel Explorer route next.
        </p>
      </OverviewShell>

      {/* Module 6 */}
      <OverviewShell id="overview-mod-6" eyebrow="THE BOX BREAKDOWN">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Pick your SKU on purpose</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bundle.boxFormats.map((fmt) => {
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
                      <div className="flex h-full items-center justify-center text-[10px] text-zinc-500">{fmt.name}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-paper">{fmt.name}</h3>
                    <p className="mt-1 text-xs tabular-nums text-zinc-500">
                      {fmt.cardsPerPack} × {fmt.packsPerBox} = {cards} cards
                    </p>
                    {fmt.msrp != null ? (
                      <p className="mt-1 text-sm tabular-nums text-zinc-300">${fmt.msrp.toFixed(2)} MSRP</p>
                    ) : null}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-snug text-zinc-400">{fmt.bestFor}</p>
              </article>
            );
          })}
        </div>
      </OverviewShell>

      {/* Module 7 */}
      {insights ? (
        <Module7ByTheNumbers tiles={insights.featuredTiles} imagery={imagery} />
      ) : null}

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
