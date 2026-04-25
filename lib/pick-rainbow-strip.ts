import type { Parallel } from "@/types/parallels";

/**
 * Tier-representative rainbow strip for Overview + Parallels summary.
 * We want the ladder shape (rare → common) instead of 14 different /1s.
 *
 * Default tiers (14 bars): /1, /5, /10, /15, /25, /50, /75, /99, /125, /150, /199, /250, /499, unnumbered.
 *
 * Selection within a tier: first match in list order (stable). This avoids \"alphabetical drift\"
 * when upstream JSON ordering encodes editorial intent (e.g. Border ladder order).
 */
export function pickRainbowStrip(parallels: Parallel[], max = 14): Parallel[] {
  const tiers: (number | "unnumbered")[] = [1, 5, 10, 15, 25, 50, 75, 99, 125, 150, 199, 250, 499, "unnumbered"];

  const chosen: Parallel[] = [];
  const picked = new Set<string>();

  const pickFirst = (pred: (p: Parallel) => boolean) => {
    for (const p of parallels) {
      if (picked.has(p.slug)) continue;
      if (!pred(p)) continue;
      chosen.push(p);
      picked.add(p.slug);
      return;
    }
  };

  for (const tier of tiers) {
    if (chosen.length >= max) break;
    if (tier === "unnumbered") {
      pickFirst((p) => typeof p.printRun !== "number" || !Number.isFinite(p.printRun));
    } else {
      pickFirst((p) => typeof p.printRun === "number" && Number.isFinite(p.printRun) && p.printRun === tier);
    }
  }

  // If a release ladder doesn't have all tiers (e.g. no /15), backfill with next-smallest runs
  // to keep the strip visually full.
  if (chosen.length < max) {
    const leftovers = parallels
      .filter((p) => !picked.has(p.slug))
      .map((p) => ({
        p,
        pr: typeof p.printRun === "number" && Number.isFinite(p.printRun) ? p.printRun : Number.POSITIVE_INFINITY,
      }))
      .sort((a, b) => a.pr - b.pr)
      .map((x) => x.p);
    for (const p of leftovers) {
      if (chosen.length >= max) break;
      chosen.push(p);
    }
  }

  return chosen.slice(0, max);
}
