export type InsightsInitialFilters = {
  q: string;
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export function parseInsightsSearchParams(sp: Record<string, string | string[] | undefined>): InsightsInitialFilters {
  return { q: firstString(sp.q) };
}

