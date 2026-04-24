import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

import type { AutographData } from "@/types/autographs";
import type { Checklist } from "@/types/checklist";
import type { ImageryData } from "@/types/imagery";
import type { InsightsData } from "@/types/insights";
import type { InsertData } from "@/types/inserts";
import type { ParallelData } from "@/types/parallels";
import type { Release } from "@/types/release";
import type { ResourcesData } from "@/types/resources";
import type { TeamsData } from "@/types/teams";

const RELEASE_ROOT = path.join(process.cwd(), "content", "releases");

export function releaseBundleDir(slug: string): string {
  return path.join(RELEASE_ROOT, slug);
}

export function isV2ReleaseBundle(slug: string): boolean {
  try {
    return fs.existsSync(path.join(releaseBundleDir(slug), "release.json"));
  } catch {
    return false;
  }
}

function readJson<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function loadV2ReleaseBundleUncached(slug: string): Release | null {
  const dir = releaseBundleDir(slug);
  const rootPath = path.join(dir, "release.json");
  const root = readJson<Release>(rootPath);
  if (!root) return null;

  const loaded: NonNullable<Release["_loaded"]> = {
    checklist: readJson<Checklist>(path.join(dir, "checklist.json")) ?? undefined,
    parallels: readJson<ParallelData>(path.join(dir, "parallels.json")) ?? undefined,
    autographs: readJson<AutographData>(path.join(dir, "autographs.json")) ?? undefined,
    inserts: readJson<InsertData>(path.join(dir, "inserts.json")) ?? undefined,
    teams: readJson<TeamsData>(path.join(dir, "teams.json")) ?? undefined,
    insights: readJson<InsightsData>(path.join(dir, "insights.json")) ?? undefined,
    resources: readJson<ResourcesData>(path.join(dir, "resources.json")) ?? undefined,
    imagery: readJson<ImageryData>(path.join(dir, "imagery.json")) ?? undefined,
  };

  return { ...root, _loaded: loaded };
}

/** Full v2 bundle for Overview + future sub-pages (deduped per request). */
export const loadV2ReleaseBundle = cache(loadV2ReleaseBundleUncached);
