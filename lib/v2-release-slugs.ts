import { getAllReleaseSlugs } from "@/lib/releases";
import { isV2ReleaseBundle } from "@/lib/v2-release";

export function getV2ReleaseSlugs(): string[] {
  return getAllReleaseSlugs().filter((slug) => isV2ReleaseBundle(slug));
}
