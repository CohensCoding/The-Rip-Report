import type {
  LegacyAutographSet,
  LegacyBaseSet,
  LegacyBoxFormat,
  LegacyChaseCard,
  LegacyCommentary,
  LegacyInsertSet,
  LegacyLinks,
  LegacyParallelGroup,
  LegacyRelease,
  LegacyReleaseStatus,
} from "@/types/legacy-release";
import type { Release } from "@/types/release";

function mapStatus(s: string): LegacyReleaseStatus {
  if (s === "released" || s === "preorder" || s === "announced" || s === "dropped") return s;
  return "released";
}

/**
 * LegacyRelease for homepage tiles + legacy code paths.
 * Pass the full bundle (`_loaded.imagery`) so `heroImage` can resolve from `imagery.json`.
 */
export function v2BundleToLegacyRelease(root: Release): LegacyRelease {
  const heroSlug = root.heroImagery?.boxShotsSlug;
  const heroImage =
    heroSlug && root._loaded?.imagery?.images?.[heroSlug]?.path
      ? root._loaded.imagery.images[heroSlug].path
      : undefined;

  const baseSet: LegacyBaseSet = {
    size: root.baseSetSummary.totalCards,
    rookieCount: root.baseSetSummary.rookieCount,
    subsets: root.baseSetSummary.subsets?.map((s) => ({
      name: s.name,
      size: s.size,
      notes: s.description,
    })),
    variations: root.baseSetSummary.variations?.map((v) => ({
      name: v.name,
      description: v.description,
      odds: v.odds,
      printRun: v.printRun,
    })),
    notes: root.baseSetSummary.notes,
  };

  const commentary: LegacyCommentary = {
    whatMatters: root.synopsis,
    whatsNew: root.commentary.whatsNew,
    formatAdvice: root.commentary.formatAdvice,
    compToLastYear: root.commentary.compToLastYear,
    redFlags: root.commentary.redFlags,
    bullCase: root.commentary.bullCase,
    bearCase: root.commentary.bearCase,
  };

  const chaseCards: LegacyChaseCard[] | undefined = root.holyGrails?.map((g) => ({
    player: g.player,
    team: g.team,
    cardName: g.cardName,
    reason: g.reason,
    estimatedValue: g.estimatedValue,
  }));

  const boxFormats: LegacyBoxFormat[] = root.boxFormats.map((b) => ({
    name: b.name,
    cardsPerPack: b.cardsPerPack,
    packsPerBox: b.packsPerBox,
    boxesPerCase: b.boxesPerCase,
    msrp: b.msrp,
    guarantees: b.guarantees,
    exclusives: b.exclusives,
    notes: b.notes,
  }));

  const links: LegacyLinks = {};

  return {
    slug: root.slug,
    title: root.title,
    shortTitle: root.shortTitle,
    year: root.year,
    sport: root.sport,
    brand: root.brand,
    manufacturer: root.manufacturer,
    releaseDate: root.releaseDate,
    preorderDate: root.preorderDate ?? undefined,
    status: mapStatus(root.status),
    heroImage,
    tagline: root.tagline,
    summary: root.synopsis,
    verdict: {
      oneLineTake: root.verdict.oneLineTake,
      whoThisIsFor: root.verdict.whoThisIsFor,
      keyChaseCard: root.verdict.keyChaseCard,
      rating: root.verdict.rating,
    },
    boxFormats,
    baseSet,
    parallels: [] as LegacyParallelGroup[],
    inserts: [] as LegacyInsertSet[],
    autographs: [] as LegacyAutographSet[],
    commentary,
    chaseCards,
    links,
    lastUpdated: root.lastUpdated ?? root.releaseDate,
    author: root.author ?? "Rip Report",
  };
}
