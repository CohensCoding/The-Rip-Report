export type InsertsInitialFilters = {
  q: string;
  tier: "" | "case-hit" | "standard" | "redundant";
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export function parseInsertsSearchParams(sp: Record<string, string | string[] | undefined>): InsertsInitialFilters {
  const tierRaw = firstString(sp.tier);
  const tier = tierRaw === "case-hit" || tierRaw === "standard" || tierRaw === "redundant" ? tierRaw : "";
  return { q: firstString(sp.q), tier };
}

