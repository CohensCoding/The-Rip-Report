import type { Release } from "@/types/release";

import { ReleaseTile } from "./ReleaseTile";

export function ReleaseGrid({ releases }: { releases: Release[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {releases.map((r) => (
        <ReleaseTile key={r.slug} release={r} />
      ))}
    </div>
  );
}

