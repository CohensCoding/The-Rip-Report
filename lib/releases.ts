import fs from "node:fs";
import path from "node:path";

import type { Brand, Sport } from "@/types/common";
import type { Manifest, ReleaseManifestEntry } from "@/types/manifest";
import type { LegacyRelease } from "@/types/legacy-release";
import { isV2ReleaseBundle, loadV2ReleaseBundle } from "@/lib/v2-release";
import { v2BundleToLegacyRelease } from "@/lib/v2-to-legacy-release";

const RELEASES_DIR = path.join(process.cwd(), "content", "releases");

function safeJsonParse<T>(filePath: string, raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(
      `[releases] Failed to parse JSON: ${path.relative(process.cwd(), filePath)} (${err instanceof Error ? err.message : String(err)})`,
    );
    return null;
  }
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return safeJsonParse<T>(filePath, raw);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    console.warn(
      `[releases] Failed to read file: ${path.relative(process.cwd(), filePath)} (${err instanceof Error ? err.message : String(err)})`,
    );
    return null;
  }
}

function dateKey(isoDate: string | undefined): number {
  if (!isoDate) return 0;
  const t = Date.parse(isoDate);
  return Number.isFinite(t) ? t : 0;
}

function sortByReleaseDateDesc<T extends { releaseDate: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => dateKey(b.releaseDate) - dateKey(a.releaseDate));
}

export function getManifest(): Manifest {
  const filePath = path.join(RELEASES_DIR, "manifest.json");
  const manifest = readJsonFile<Manifest>(filePath);
  if (!manifest) {
    console.warn(
      `[releases] Missing or invalid manifest: ${path.relative(process.cwd(), filePath)}`,
    );
    return { releases: [] };
  }
  return manifest;
}

export function getAllReleaseSlugs(): string[] {
  return getManifest().releases.map((r) => r.slug);
}

export function getReleaseBySlug(slug: string): LegacyRelease | null {
  if (isV2ReleaseBundle(slug)) {
    const bundle = loadV2ReleaseBundle(slug);
    if (!bundle) return null;
    return v2BundleToLegacyRelease(bundle);
  }
  const filePath = path.join(RELEASES_DIR, `${slug}.json`);
  const release = readJsonFile<LegacyRelease>(filePath);
  if (!release) return null;
  return release;
}

export function getAllReleases(): LegacyRelease[] {
  const manifest = getManifest();
  const releases: LegacyRelease[] = [];

  for (const entry of manifest.releases) {
    const r = getReleaseBySlug(entry.slug);
    if (!r) {
      console.warn(
        `[releases] Manifest entry has no matching JSON file: ${entry.slug}.json`,
      );
      continue;
    }
    releases.push(r);
  }

  return sortByReleaseDateDesc(releases);
}

export function getFeaturedReleases(): LegacyRelease[] {
  const featuredSlugs = new Set(
    getManifest()
      .releases.filter((r) => r.featured === true)
      .map((r) => r.slug),
  );

  return getAllReleases().filter((r) => featuredSlugs.has(r.slug));
}

export function getReleasesBySport(sport: Sport): LegacyRelease[] {
  return getAllReleases().filter((r) => r.sport === sport);
}

export function getReleasesByBrand(brand: Brand): LegacyRelease[] {
  return getAllReleases().filter((r) => r.brand === brand);
}

export function getReleaseManifestEntries(): ReleaseManifestEntry[] {
  const { releases } = getManifest();
  return sortByReleaseDateDesc(releases);
}

