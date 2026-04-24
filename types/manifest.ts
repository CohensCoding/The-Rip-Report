import type { Brand, Sport, ReleaseStatus } from "./common";

export interface ReleaseManifestEntry {
  slug: string;
  title: string;
  sport: Sport;
  brand: Brand;
  releaseDate: string;
  status: ReleaseStatus;
  /** v1 homepage tiles — v2 may key hero from imagery.json instead */
  heroImage?: string;
  tagline: string;
  featured?: boolean;
}

export interface Manifest {
  releases: ReleaseManifestEntry[];
}
