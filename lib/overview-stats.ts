import type { AutographData } from "@/types/autographs";
import type { Checklist } from "@/types/checklist";
import type { ParallelData } from "@/types/parallels";

/** When checklist metadata omits autoSignerCount, use the signer index (authoritative autographs.json). */
export function resolveAutoSignerCount(
  checklist: Checklist | undefined,
  autographs: AutographData | undefined,
): number | null {
  const m = checklist?.metadata.autoSignerCount;
  if (typeof m === "number" && Number.isFinite(m)) return m;
  const n = autographs?.signerIndex?.length;
  if (typeof n === "number" && n > 0) return n;
  return null;
}

export function parallelVariationCount(parallels: ParallelData | undefined): number | null {
  if (!parallels?.groups?.length) return null;
  let n = 0;
  for (const g of parallels.groups) {
    n += g.parallels?.length ?? 0;
  }
  return n;
}
