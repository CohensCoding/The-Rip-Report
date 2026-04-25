import type { HolyGrail } from "@/types/release";

/** Row key for matching checklist cards to `release.json` holyGrails (curated list). */
export function holyGrailRowKey(cardNumber: string, player: string): string {
  return `${cardNumber.trim()}||${player.trim().toLowerCase()}`;
}

export function holyGrailKeysFromRelease(grails: HolyGrail[] | undefined): string[] {
  const keys: string[] = [];
  for (const g of grails ?? []) {
    if (!g.cardNumber) continue;
    keys.push(holyGrailRowKey(g.cardNumber, g.player));
  }
  return keys;
}
