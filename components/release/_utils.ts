import type { LegacyParallel } from "@/types/legacy-release";

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(d)
    .toUpperCase();
}

export function parallelBarWidthPercent(parallel: LegacyParallel): number {
  const pr = parallel.printRun;

  if (typeof pr === "number" && Number.isFinite(pr) && pr > 0) {
    // Rarer (lower print run) → narrower bar; higher print runs → wider bar.
    // This is intentionally a simple monotonic curve (not a literal log-scale width).
    const x = Math.log10(pr); // 0..~2.4 for 1..250
    const width = 18 + x * 28;
    return Math.min(88, Math.max(14, width));
  }

  // Unnumbered / odds-only / string print runs: treat as mid-tier width.
  if (pr === undefined) return 58;
  if (typeof pr === "string") {
    const lowered = pr.toLowerCase();
    if (lowered.includes("ssp")) return 22;
    if (lowered.includes("sp")) return 40;
    return 52;
  }

  return 52;
}

export function printRunLabel(parallel: LegacyParallel): string {
  if (typeof parallel.printRun === "number" && Number.isFinite(parallel.printRun)) {
    return `/${parallel.printRun}`;
  }
  if (typeof parallel.printRun === "string" && parallel.printRun.trim().length > 0) {
    return parallel.printRun.trim();
  }
  return "UNNUMBERED";
}

export function printRunDisplay(parallel: LegacyParallel): {
  kind: "slash" | "text";
  value: string;
} {
  if (typeof parallel.printRun === "number" && Number.isFinite(parallel.printRun)) {
    return { kind: "slash", value: `/${parallel.printRun}` };
  }
  if (typeof parallel.printRun === "string" && parallel.printRun.trim().length > 0) {
    return { kind: "text", value: parallel.printRun.trim() };
  }
  return { kind: "text", value: "UNNUMBERED" };
}
