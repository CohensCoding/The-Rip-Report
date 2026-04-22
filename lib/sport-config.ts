import type { Brand, Sport } from "@/types/release";

export const sportConfig: Record<
  Sport,
  {
    hex: string;
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  football: {
    hex: "#9A1B2F",
    label: "Football",
    bgClass: "bg-sport-football",
    textClass: "text-sport-football",
    borderClass: "border-sport-football",
  },
  basketball: {
    hex: "#E06A17",
    label: "Basketball",
    bgClass: "bg-sport-basketball",
    textClass: "text-sport-basketball",
    borderClass: "border-sport-basketball",
  },
  baseball: {
    hex: "#0C2340",
    label: "Baseball",
    bgClass: "bg-sport-baseball",
    textClass: "text-sport-baseball",
    borderClass: "border-sport-baseball",
  },
  hockey: {
    hex: "#4A90B8",
    label: "Hockey",
    bgClass: "bg-sport-hockey",
    textClass: "text-sport-hockey",
    borderClass: "border-sport-hockey",
  },
  soccer: {
    hex: "#046A38",
    label: "Soccer",
    bgClass: "bg-sport-soccer",
    textClass: "text-sport-soccer",
    borderClass: "border-sport-soccer",
  },
  racing: {
    hex: "#004225",
    label: "Racing",
    bgClass: "bg-sport-racing",
    textClass: "text-sport-racing",
    borderClass: "border-sport-racing",
  },
  ufc: {
    hex: "#B45309",
    label: "UFC",
    bgClass: "bg-sport-ufc",
    textClass: "text-sport-ufc",
    borderClass: "border-sport-ufc",
  },
  wrestling: {
    hex: "#7C3AED",
    label: "Wrestling",
    bgClass: "bg-sport-wrestling",
    textClass: "text-sport-wrestling",
    borderClass: "border-sport-wrestling",
  },
  "multi-sport": {
    hex: "#64748B",
    label: "Multi-Sport",
    bgClass: "bg-sport-multi-sport",
    textClass: "text-sport-multi-sport",
    borderClass: "border-sport-multi-sport",
  },
  "non-sport": {
    hex: "#52525B",
    label: "Non-Sport",
    bgClass: "bg-sport-non-sport",
    textClass: "text-sport-non-sport",
    borderClass: "border-sport-non-sport",
  },
};

export const brandLabels: Record<Brand, string> = {
  topps: "Topps",
  "topps-chrome": "Topps Chrome",
  "topps-heritage": "Topps Heritage",
  "topps-finest": "Topps Finest",
  "topps-stadium-club": "Stadium Club",
  bowman: "Bowman",
  "bowman-chrome": "Bowman Chrome",
  "bowman-draft": "Bowman Draft",
  "panini-prizm": "Prizm",
  "panini-select": "Select",
  "panini-donruss": "Donruss",
  "panini-national-treasures": "National Treasures",
  "upper-deck": "Upper Deck",
  "upper-deck-artifacts": "Artifacts",
  "upper-deck-mvp": "MVP",
  other: "Other",
};

