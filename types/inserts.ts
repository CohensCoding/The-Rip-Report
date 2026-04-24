import type { PackOdds } from "./common";
import type { Parallel } from "./parallels";

export interface InsertData {
  sets: InsertSet[];
  editorial: {
    overview: string;
  };
  crossInsertChasers: CrossInsertChaser[];
}

export interface InsertSet {
  name: string;
  slug: string;
  size: number;
  odds?: PackOdds;
  isCaseHit: boolean;
  isNew: boolean;
  description: string;
  editorialNote?: string;
  editorialTier: "chase" | "notable" | "common" | "filler";
  checklist: InsertCard[];
  parallels?: Parallel[];
  imageSlug?: string;
}

export interface InsertCard {
  cardNumber: string;
  player: string;
  playerSlug: string;
  team?: string;
  teamSlug?: string;
  isRookie?: boolean;
}

export interface CrossInsertChaser {
  player: string;
  playerSlug: string;
  insertCount: number;
  inserts: string[];
}
