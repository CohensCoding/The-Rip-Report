import type { LegacyRelease } from "@/types/legacy-release";

import { ReleaseTile } from "./ReleaseTile";

export function ReleaseGrid({ releases }: { releases: LegacyRelease[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {releases.map((r) => (
        <ReleaseTile key={r.slug} release={r} />
      ))}
    </div>
  );
}

