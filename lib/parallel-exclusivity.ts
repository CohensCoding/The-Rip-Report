import type { BoxFormatName } from "@/types/common";
import type { ExclusivityMatrix } from "@/types/parallels";

/**
 * Editorial exclusivity buckets from `exclusivityMatrix` (name → list).
 * Order: most distinctive / Rip Report angles first (Breaker, Mega, Sapphire, Hobby, …).
 */
export type MatrixExclusivityKey =
  | "breaker-only"
  | "mega-only"
  | "sapphire-only"
  | "hobby-only"
  | "retail-only"
  | "jumbo-only"
  | "hobby-jumbo-only";

export function matrixExclusivityForParallel(name: string, matrix: ExclusivityMatrix): MatrixExclusivityKey | null {
  if (matrix.breakerOnly.includes(name)) return "breaker-only";
  if (matrix.megaOnly?.includes(name)) return "mega-only";
  if (matrix.sapphireOnly?.includes(name)) return "sapphire-only";
  if (matrix.hobbyOnly.includes(name)) return "hobby-only";
  if (matrix.retailOnly.includes(name)) return "retail-only";
  if (matrix.jumboOnly?.includes(name)) return "jumbo-only";
  if (matrix.hobbyAndJumboOnly?.includes(name)) return "hobby-jumbo-only";
  return null;
}

export const MATRIX_EXCLUSIVITY_LABEL: Record<MatrixExclusivityKey, string> = {
  "breaker-only": "Breaker's Delight",
  "mega-only": "Mega only",
  "sapphire-only": "Sapphire box",
  "hobby-only": "Hobby only",
  "retail-only": "Retail",
  "jumbo-only": "Jumbo only",
  "hobby-jumbo-only": "Hobby + Jumbo",
};

/** Row accent + chip styling — format exclusivity is a core editorial signal. */
export const MATRIX_ROW_BORDER: Record<MatrixExclusivityKey, string> = {
  "breaker-only": "border-l-teal-400/95",
  "mega-only": "border-l-fuchsia-500/95",
  "sapphire-only": "border-l-sky-400/95",
  "hobby-only": "border-l-amber-400/95",
  "retail-only": "border-l-emerald-500/90",
  "jumbo-only": "border-l-orange-400/90",
  "hobby-jumbo-only": "border-l-violet-400/95",
};

export const MATRIX_BADGE_CLASS: Record<MatrixExclusivityKey, string> = {
  "breaker-only": "bg-teal-500/15 text-teal-100 ring-1 ring-teal-400/35",
  "mega-only": "bg-fuchsia-600/20 text-fuchsia-100 ring-1 ring-fuchsia-500/40",
  "sapphire-only": "bg-sky-600/20 text-sky-100 ring-1 ring-sky-400/40",
  "hobby-only": "bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/40",
  "retail-only": "bg-emerald-600/15 text-emerald-100 ring-1 ring-emerald-500/35",
  "jumbo-only": "bg-orange-500/15 text-orange-100 ring-1 ring-orange-400/40",
  "hobby-jumbo-only": "bg-violet-600/20 text-violet-100 ring-1 ring-violet-400/40",
};

export function formatBadgesFromExclusiveTo(formats: BoxFormatName[] | undefined): string[] {
  if (!formats?.length) return [];
  return [...formats];
}
