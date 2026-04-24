export interface ImageryData {
  images: Record<string, ImageAsset>;
}

export interface ImageAsset {
  slug: string;
  type:
    | "box"
    | "pack"
    | "card"
    | "team-logo"
    | "brand-logo"
    | "player-photo"
    | "insight-icon"
    | "other";
  path: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
  license?: "official" | "editorial-use" | "public" | "ugc-permission-granted";
}
