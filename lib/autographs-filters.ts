export type AutographsInitialFilters = {
  q: string;
  tier: "" | "1" | "2" | "3" | "4";
  set: string;
  teamSlug: string;
  firstBowman: "" | "yes" | "no";
  rookie: "" | "yes" | "no";
};

function firstString(v: string | string[] | undefined): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return "";
}

export function parseAutographsSearchParams(
  sp: Record<string, string | string[] | undefined>,
): AutographsInitialFilters {
  const tierRaw = firstString(sp.tier);
  const tier = tierRaw === "1" || tierRaw === "2" || tierRaw === "3" || tierRaw === "4" ? tierRaw : "";
  const fbRaw = firstString(sp.firstBowman);
  const firstBowman = fbRaw === "yes" || fbRaw === "no" ? fbRaw : "";
  const rRaw = firstString(sp.rookie);
  const rookie = rRaw === "yes" || rRaw === "no" ? rRaw : "";

  return {
    q: firstString(sp.q),
    tier,
    set: firstString(sp.set),
    teamSlug: firstString(sp.team),
    firstBowman,
    rookie,
  };
}

