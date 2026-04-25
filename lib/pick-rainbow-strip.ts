import type { Parallel } from "@/types/parallels";

/** Rarest-first slice for the overview / parallels summary strip (hex bars). */
export function pickRainbowStrip(parallels: Parallel[], max = 14): Parallel[] {
  const scored = parallels.map((p) => ({
    p,
    pr: typeof p.printRun === "number" && Number.isFinite(p.printRun) ? p.printRun : Number.POSITIVE_INFINITY,
  }));
  scored.sort((a, b) => a.pr - b.pr);
  return scored.slice(0, max).map((x) => x.p);
}
