"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import type { AutographData, AutoSet, SignerEntry } from "@/types/autographs";
import type { BoxFormatName, PackOdds } from "@/types/common";
import type { ImageryData } from "@/types/imagery";

import type { AutographsInitialFilters } from "@/lib/autographs-filters";

import { OverviewImage } from "../overview/OverviewImage";

const TIER4_PAGE_SIZE = 60;

type Props = {
  slug: string;
  data: AutographData;
  imagery: ImageryData | undefined;
  initial: AutographsInitialFilters;
};

const FORMAT_ORDER: BoxFormatName[] = [
  "Hobby",
  "Jumbo",
  "Mega",
  "Value",
  "Retail",
  "Breaker's Delight",
  "Sapphire",
  "Bulk",
];

function buildSearchParams(slug: string, s: AutographsInitialFilters): string {
  const p = new URLSearchParams();
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.tier) p.set("tier", s.tier);
  if (s.set) p.set("set", s.set);
  if (s.teamSlug) p.set("team", s.teamSlug);
  if (s.firstBowman) p.set("firstBowman", s.firstBowman);
  if (s.rookie) p.set("rookie", s.rookie);
  const qs = p.toString();
  return qs ? `/releases/${slug}/autographs?${qs}` : `/releases/${slug}/autographs`;
}

function logoPathForTeam(teamSlug: string | undefined, imagery: ImageryData | undefined): string | undefined {
  if (!teamSlug) return undefined;
  const key = `logo-${teamSlug}`;
  return imagery?.images?.[key]?.path;
}

function photoPathForSigner(s: SignerEntry, imagery: ImageryData | undefined): string | undefined {
  if (!s.photoSlug) return undefined;
  return imagery?.images?.[s.photoSlug]?.path;
}

function perFormatOddsRows(odds: PackOdds | undefined): { format: BoxFormatName; ratioDisplay: string }[] {
  const pf = odds?.perFormat;
  if (!pf) return [];
  const out: { format: BoxFormatName; ratioDisplay: string }[] = [];
  const used = new Set<BoxFormatName>();
  for (const fmt of FORMAT_ORDER) {
    const row = pf[fmt];
    if (row?.ratioDisplay) {
      out.push({ format: fmt, ratioDisplay: row.ratioDisplay });
      used.add(fmt);
    }
  }
  for (const k of Object.keys(pf) as BoxFormatName[]) {
    if (used.has(k)) continue;
    const row = pf[k];
    if (row?.ratioDisplay) out.push({ format: k, ratioDisplay: row.ratioDisplay });
  }
  return out;
}

function tierLabel(tier: 1 | 2 | 3 | 4): string {
  if (tier === 1) return "Tier 1";
  if (tier === 2) return "Tier 2";
  if (tier === 3) return "Tier 3";
  return "Tier 4";
}

function tierBadgeClass(tier: 1 | 2 | 3 | 4): string {
  if (tier === 1) return "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/40";
  if (tier === 2) return "bg-zinc-100/10 text-zinc-200 ring-1 ring-zinc-600/40";
  if (tier === 3) return "bg-zinc-900 text-zinc-300 ring-1 ring-zinc-700/60";
  return "bg-zinc-950 text-zinc-500 ring-1 ring-zinc-800";
}

export function AutographsBrowser({ slug, data, imagery, initial }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initial.q);
  const [tier, setTier] = useState<AutographsInitialFilters["tier"]>(initial.tier);
  const [setSlug, setSetSlug] = useState(initial.set);
  const [teamSlug, setTeamSlug] = useState(initial.teamSlug);
  const [firstBowman, setFirstBowman] = useState<AutographsInitialFilters["firstBowman"]>(initial.firstBowman);
  const [rookie, setRookie] = useState<AutographsInitialFilters["rookie"]>(initial.rookie);

  const [tier4Open, setTier4Open] = useState(false);
  const [tier4Page, setTier4Page] = useState(1);

  const signerBySlug = useMemo(() => {
    const m = new Map<string, SignerEntry>();
    for (const s of data.signerIndex ?? []) m.set(s.playerSlug, s);
    return m;
  }, [data.signerIndex]);

  const allSets = data.sets ?? [];

  const filteredSignerIndex = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data.signerIndex ?? []).filter((s) => {
      if (tier && String(s.tier) !== tier) return false;
      if (setSlug && !s.inSets.includes(setSlug)) return false;
      if (teamSlug && s.teamSlug !== teamSlug) return false;
      if (firstBowman === "yes" && !s.isFirstBowmanAuto) return false;
      if (firstBowman === "no" && s.isFirstBowmanAuto) return false;
      if (rookie === "yes" && !s.isRookie) return false;
      if (rookie === "no" && s.isRookie) return false;
      if (needle) {
        const hay = `${s.player} ${s.team ?? ""} ${s.playerSlug} ${s.teamSlug ?? ""} ${s.inSets.join(" ")}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [data.signerIndex, q, tier, setSlug, teamSlug, firstBowman, rookie]);

  const filteredSlugSet = useMemo(() => new Set(filteredSignerIndex.map((s) => s.playerSlug)), [filteredSignerIndex]);

  const tierSlugs = data.tierRanking;
  const tier1 = (tierSlugs?.tier1 ?? []).map((slug) => signerBySlug.get(slug)).filter(Boolean) as SignerEntry[];
  const tier2 = (tierSlugs?.tier2 ?? []).map((slug) => signerBySlug.get(slug)).filter(Boolean) as SignerEntry[];
  const tier3 = (tierSlugs?.tier3 ?? []).map((slug) => signerBySlug.get(slug)).filter(Boolean) as SignerEntry[];
  const tier4All = (tierSlugs?.tier4 ?? []).map((slug) => signerBySlug.get(slug)).filter(Boolean) as SignerEntry[];

  const tier4Filtered = useMemo(() => tier4All.filter((s) => filteredSlugSet.has(s.playerSlug)), [tier4All, filteredSlugSet]);
  const tier4Count = tier4Filtered.length;
  const tier4PageCount = Math.max(1, Math.ceil(tier4Count / TIER4_PAGE_SIZE));
  const safeTier4Page = Math.min(Math.max(1, tier4Page), tier4PageCount);
  const tier4Slice = tier4Filtered.slice((safeTier4Page - 1) * TIER4_PAGE_SIZE, safeTier4Page * TIER4_PAGE_SIZE);

  const apply = () => {
    setTier4Page(1);
    const state: AutographsInitialFilters = { q, tier, set: setSlug, teamSlug, firstBowman, rookie };
    startTransition(() => router.replace(buildSearchParams(slug, state)));
  };

  const reset = () => {
    setQ("");
    setTier("");
    setSetSlug("");
    setTeamSlug("");
    setFirstBowman("");
    setRookie("");
    setTier4Page(1);
    setTier4Open(false);
    startTransition(() => router.replace(`/releases/${slug}/autographs`));
  };

  const filteredCount = filteredSignerIndex.length;

  const setOptions = useMemo(() => {
    return [...allSets].sort((a, b) => a.name.localeCompare(b.name));
  }, [allSets]);

  return (
    <div className={cn("mx-auto max-w-6xl px-5 py-8 sm:px-8", isPending && "opacity-70")}>
      <p className="max-w-3xl text-sm leading-relaxed text-zinc-400">{data.editorial.overview}</p>

      <div className="mt-8 flex flex-col gap-4 border-b border-zinc-800 pb-6 sm:flex-row sm:flex-wrap sm:items-end">
        <label className="block min-w-[200px] flex-1 text-xs text-zinc-500">
          Search
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-paper"
            placeholder="Player, team, set…"
          />
        </label>

        <label className="block w-full min-w-[120px] sm:w-36">
          <span className="text-xs text-zinc-500">Tier</span>
          <select
            value={tier}
            onChange={(e) => setTier(e.target.value as AutographsInitialFilters["tier"])}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All tiers</option>
            <option value="1">Tier 1</option>
            <option value="2">Tier 2</option>
            <option value="3">Tier 3</option>
            <option value="4">Tier 4</option>
          </select>
        </label>

        <label className="block w-full min-w-[200px] sm:w-72">
          <span className="text-xs text-zinc-500">Auto set</span>
          <select
            value={setSlug}
            onChange={(e) => setSetSlug(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All sets</option>
            {setOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block w-full min-w-[160px] sm:w-52">
          <span className="text-xs text-zinc-500">Team slug</span>
          <input
            value={teamSlug}
            onChange={(e) => setTeamSlug(e.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
            placeholder="e.g. dallas-mavericks"
          />
        </label>

        <label className="block w-full min-w-[130px] sm:w-36">
          <span className="text-xs text-zinc-500">1st Bowman</span>
          <select
            value={firstBowman}
            onChange={(e) => setFirstBowman(e.target.value as AutographsInitialFilters["firstBowman"])}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>

        <label className="block w-full min-w-[110px] sm:w-32">
          <span className="text-xs text-zinc-500">Rookie</span>
          <select
            value={rookie}
            onChange={(e) => setRookie(e.target.value as AutographsInitialFilters["rookie"])}
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-paper"
          >
            <option value="">All</option>
            <option value="yes">Rookie</option>
            <option value="no">Not rookie</option>
          </select>
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

      <p className="py-4 text-sm text-zinc-400">
        <span className="tabular-nums text-paper">{filteredCount}</span> signers
      </p>

      <TierHero
        title="Tier 1 — The Faces"
        description={data.editorial.tierExplanations.tier1}
        signers={tier1.filter((s) => filteredSlugSet.has(s.playerSlug))}
        imagery={imagery}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <TierList
          tier={2}
          title="Tier 2 — Strong Co-Stars"
          description={data.editorial.tierExplanations.tier2}
          signers={tier2.filter((s) => filteredSlugSet.has(s.playerSlug))}
          imagery={imagery}
        />
        <TierList
          tier={3}
          title="Tier 3 — Sleepers"
          description={data.editorial.tierExplanations.tier3}
          signers={tier3.filter((s) => filteredSlugSet.has(s.playerSlug))}
          imagery={imagery}
        />
      </div>

      <section className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl text-paper">Tier 4 — The Rest</h3>
            <p className="mt-1 max-w-3xl text-sm text-zinc-400">{data.editorial.tierExplanations.tier4}</p>
          </div>
          <button
            type="button"
            onClick={() => setTier4Open((v) => !v)}
            className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-300 hover:border-zinc-500"
          >
            {tier4Open ? "Collapse" : `Expand (${tier4Count})`}
          </button>
        </div>

        {tier4Open ? (
          <div className="mt-4">
            <div className="overflow-x-auto rounded-lg border border-zinc-800/80">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-2">Signer</th>
                    <th className="px-3 py-2">Team</th>
                    <th className="px-3 py-2">Sets</th>
                    <th className="px-3 py-2 tabular-nums">Lowest #</th>
                  </tr>
                </thead>
                <tbody>
                  {tier4Slice.map((s) => (
                    <tr key={s.playerSlug} className="border-b border-zinc-900/80 hover:bg-zinc-900/40">
                      <td className="px-3 py-2">
                        <SignerInline signer={s} imagery={imagery} />
                      </td>
                      <td className="px-3 py-2 text-zinc-400">{s.team ?? "—"}</td>
                      <td className="px-3 py-2 text-zinc-500">{s.inSets.length}</td>
                      <td className="px-3 py-2 tabular-nums text-zinc-400">
                        {typeof s.lowestParallelNumbered === "number" ? `/${s.lowestParallelNumbered}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
              <button
                type="button"
                disabled={safeTier4Page <= 1}
                onClick={() => setTier4Page((p) => Math.max(1, p - 1))}
                className="rounded-md border border-zinc-800 px-3 py-1 disabled:opacity-30"
              >
                Previous
              </button>
              <span className="tabular-nums">
                Page {safeTier4Page} / {tier4PageCount} ({TIER4_PAGE_SIZE} per page)
              </span>
              <button
                type="button"
                disabled={safeTier4Page >= tier4PageCount}
                onClick={() => setTier4Page((p) => Math.min(tier4PageCount, p + 1))}
                className="rounded-md border border-zinc-800 px-3 py-1 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-600">
            Tier 4 is intentionally collapsed — 205 names. Expand only when you’re hunting a specific long-tail signer.
          </p>
        )}
      </section>

      <NotableAbsencesCard items={data.notableAbsences ?? []} />

      <AutoSetExplorer sets={allSets} />

      {/* Redemption watch: empty is valid; render nothing */}
      {data.redemptionWatch && data.redemptionWatch.length > 0 ? (
        <section className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5">
          <h3 className="font-serif text-xl text-paper">Redemption watch</h3>
          <p className="mt-2 text-sm text-zinc-500">
            These aren’t confirmed for this release unless present in the data.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {data.redemptionWatch.map((r) => (
              <li key={`${r.player}-${r.autoSet}`} className="rounded-md border border-zinc-800 bg-black/20 p-3">
                <div className="font-medium text-paper">{r.player}</div>
                <div className="text-zinc-500">
                  {r.autoSet} · {r.estimatedLandingWindow}
                </div>
                {r.notes ? <div className="mt-1 text-zinc-400">{r.notes}</div> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mt-10 max-w-3xl text-xs leading-relaxed text-zinc-600">
        Tier UX: Tier 1 is hero-first; Tier 4 stays collapsed and paginated to avoid burying the page in 200+ names.
      </p>
    </div>
  );

  function AutoSetExplorer({ sets }: { sets: AutoSet[] }) {
    return (
      <section className="mt-10">
        <h2 className="font-serif text-2xl text-paper sm:text-3xl">Autograph sets</h2>
        <p className="mt-2 max-w-3xl text-sm text-zinc-400">
          Box guarantees are displayed prominently per set — they’re the format decision signal.
        </p>
        <div className="mt-6 space-y-5">
          {sets.map((set) => (
            <AutoSetCard key={set.slug} set={set} />
          ))}
        </div>
      </section>
    );
  }

  function AutoSetCard({ set }: { set: AutoSet }) {
    const pf = perFormatOddsRows(set.odds);
    return (
      <article className="rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="font-serif text-2xl text-paper">{set.name}</div>
            <div className="mt-2 text-sm text-zinc-500">
              <span className="tabular-nums text-zinc-300">{set.totalSigners}</span> signers ·{" "}
              <span className="text-zinc-400">{set.isHardSigned ? "Hard-signed" : "Sticker"}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {set.isCaseHit ? (
              <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-amber-300 uppercase">
                Case hit
              </span>
            ) : null}
            {set.isNew ? (
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-200 uppercase">
                New
              </span>
            ) : null}
            {set.hasRedemptions ? (
              <span className="rounded-full border border-rose-500/25 bg-rose-500/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-rose-200 uppercase">
                Has redemptions
              </span>
            ) : null}
          </div>
        </div>

        {set.boxGuarantee ? (
          <div className="mt-6 border-t border-zinc-800 pt-6">
            <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Box guarantee</div>
            <div className="mt-3 text-3xl leading-snug text-paper">{set.boxGuarantee}</div>
          </div>
        ) : null}

        {set.description ? <p className="mt-5 text-sm leading-relaxed text-zinc-300">{set.description}</p> : null}
        {set.editorial ? <p className="mt-3 text-sm leading-relaxed text-zinc-400">{set.editorial}</p> : null}

        {pf.length > 0 ? (
          <div className="mt-6">
            <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Pack odds (per format)</div>
            <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-800/80">
              <table className="w-full min-w-[360px] text-left text-xs">
                <thead className="bg-zinc-950/80 text-zinc-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">Format</th>
                    <th className="px-3 py-2 font-medium">Odds</th>
                  </tr>
                </thead>
                <tbody>
                  {pf.map((row) => (
                    <tr key={row.format} className="border-t border-zinc-800/80">
                      <td className="px-3 py-2 text-paper">{row.format}</td>
                      <td className="px-3 py-2 font-mono text-zinc-200">{row.ratioDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : set.odds?.ratioDisplay ? (
          <p className="mt-5 text-sm text-zinc-400">
            Odds: <span className="font-mono text-zinc-200">{set.odds.ratioDisplay}</span>
          </p>
        ) : null}

        {/* Per-set parallels ladder support (schema field) — only render if data exists. */}
        {set.parallels?.length ? (
          <div className="mt-6">
            <div className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Set parallel ladder</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {set.parallels.map((p) => (
                <span key={p.slug} className="rounded-md border border-zinc-800 bg-black/20 px-2 py-1 text-xs text-zinc-300">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </article>
    );
  }

  function NotableAbsencesCard({ items }: { items: AutographData["notableAbsences"] }) {
    if (!items?.length) return null;
    return (
      <section className="mt-10 rounded-2xl border border-zinc-800/80 bg-zinc-950/35 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.28em] text-zinc-500 uppercase">Notable absences</p>
            <h2 className="mt-2 font-serif text-2xl text-paper">Who doesn’t sign here</h2>
            <p className="mt-2 max-w-3xl text-sm text-zinc-400">
              Rip Report angle: absence is signal. These names appear elsewhere in the product ecosystem, but not on any autograph card in this release.
            </p>
          </div>
        </div>
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-800/80">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-3 py-2">Player</th>
                <th className="px-3 py-2">Reason</th>
                <th className="px-3 py-2">Expected in</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.player} className="border-b border-zinc-900/80">
                  <td className="px-3 py-2 font-medium text-paper">{a.player}</td>
                  <td className="px-3 py-2 text-zinc-400">{a.reason}</td>
                  <td className="px-3 py-2 text-zinc-500">{a.expectedIn ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
}

function TierHero({
  title,
  description,
  signers,
  imagery,
}: {
  title: string;
  description: string;
  signers: SignerEntry[];
  imagery: ImageryData | undefined;
}) {
  if (signers.length === 0) return null;
  return (
    <section className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6">
      <p className="text-xs font-medium tracking-[0.28em] text-amber-200/80 uppercase">Signer tiers</p>
      <h2 className="mt-2 font-serif text-3xl text-paper">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-300">{description}</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {signers.map((s) => (
          <SignerHeroCard key={s.playerSlug} signer={s} imagery={imagery} />
        ))}
      </div>
    </section>
  );
}

function TierList({
  tier,
  title,
  description,
  signers,
  imagery,
}: {
  tier: 2 | 3;
  title: string;
  description: string;
  signers: SignerEntry[];
  imagery: ImageryData | undefined;
}) {
  if (signers.length === 0) return null;
  return (
    <section className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-paper">{title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{description}</p>
        </div>
        <span className={cn("shrink-0 rounded px-2 py-1 text-[11px] font-medium", tierBadgeClass(tier))}>
          {tierLabel(tier)}
        </span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {signers.map((s) => (
          <SignerRowCard key={s.playerSlug} signer={s} imagery={imagery} />
        ))}
      </div>
    </section>
  );
}

function SignerHeroCard({ signer: s, imagery }: { signer: SignerEntry; imagery: ImageryData | undefined }) {
  const photo = photoPathForSigner(s, imagery);
  const logo = logoPathForTeam(s.teamSlug, imagery);
  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-zinc-900">
          {photo ? <OverviewImage src={photo} alt={s.player} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0">
          <div className="truncate font-medium text-paper">{s.player}</div>
          <div className="truncate text-xs text-zinc-500">{s.team ?? "—"}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-400">
        {s.isFirstBowmanAuto ? <span className="rounded bg-zinc-900 px-2 py-1">1st Bowman</span> : null}
        {s.isRookie ? <span className="rounded bg-zinc-900 px-2 py-1">Rookie</span> : null}
        {typeof s.lowestParallelNumbered === "number" ? (
          <span className="rounded bg-zinc-900 px-2 py-1 tabular-nums">Down to /{s.lowestParallelNumbered}</span>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="text-xs text-zinc-600">{s.inSets.length} sets</div>
        {logo ? <OverviewImage src={logo} alt="" className="h-6 w-6 rounded object-cover" /> : null}
      </div>
    </div>
  );
}

function SignerRowCard({ signer: s, imagery }: { signer: SignerEntry; imagery: ImageryData | undefined }) {
  const logo = logoPathForTeam(s.teamSlug, imagery);
  return (
    <div className="rounded-lg border border-zinc-800/80 bg-black/10 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium text-paper">{s.player}</div>
          <div className="truncate text-xs text-zinc-500">{s.team ?? "—"}</div>
        </div>
        {logo ? <OverviewImage src={logo} alt="" className="h-7 w-7 shrink-0 rounded object-cover" /> : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-zinc-500">
        {s.isFirstBowmanAuto ? <span className="rounded bg-zinc-900 px-2 py-0.5">1st Bowman</span> : null}
        {s.isRookie ? <span className="rounded bg-zinc-900 px-2 py-0.5">Rookie</span> : null}
        <span className="rounded bg-zinc-900 px-2 py-0.5">{s.inSets.length} sets</span>
      </div>
    </div>
  );
}

function SignerInline({ signer: s, imagery }: { signer: SignerEntry; imagery: ImageryData | undefined }) {
  const logo = logoPathForTeam(s.teamSlug, imagery);
  return (
    <div className="flex items-center gap-2">
      {logo ? <OverviewImage src={logo} alt="" className="h-7 w-7 shrink-0 rounded object-cover" /> : (
        <div className="h-7 w-7 shrink-0 rounded bg-zinc-900" />
      )}
      <div className="min-w-0">
        <div className="truncate font-medium text-paper">{s.player}</div>
        <div className="truncate text-[11px] text-zinc-600">{s.playerSlug}</div>
      </div>
    </div>
  );
}

