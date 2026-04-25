import type { ParallelFamily } from "@/types/parallels";

import type { MatrixExclusivityKey } from "@/lib/parallel-exclusivity";
import { MATRIX_EXCLUSIVITY_LABEL } from "@/lib/parallel-exclusivity";

const FAMILIES: ParallelFamily[] = ["Border", "Chrome", "Reptilian", "Geometric", "Sapphire", "Mojo"];

export type ParallelsInitialFilters = {
  q: string;
  family: "" | ParallelFamily;
  group: string;
  excl: "all" | MatrixExclusivityKey;
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

function isParallelFamily(v: string): v is ParallelFamily {
  return (FAMILIES as string[]).includes(v);
}

export function parseParallelsSearchParams(sp: Record<string, string | string[] | undefined>): ParallelsInitialFilters {
  const fam = firstString(sp.family);
  const family = isParallelFamily(fam) ? fam : "";
  const exRaw = firstString(sp.excl);
  const excl = (Object.keys(MATRIX_EXCLUSIVITY_LABEL) as MatrixExclusivityKey[]).includes(exRaw as MatrixExclusivityKey)
    ? (exRaw as MatrixExclusivityKey)
    : "all";
  return {
    q: firstString(sp.q),
    family,
    group: firstString(sp.group),
    excl,
  };
}
