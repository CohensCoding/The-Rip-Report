import Link from "next/link";

import { cn } from "@/lib/utils";

const COMING = ["Checklist", "Parallels", "Autographs", "Inserts", "Teams", "Insights", "Resources"] as const;

type Props = { slug: string; activeBorderClass: string };

export function OverviewStickyNav({ slug, activeBorderClass }: Props) {
  return (
    <nav
      className="sticky top-0 z-30 border-b border-zinc-800/90 bg-ink/90 backdrop-blur-md"
      aria-label="Release sections"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-5 py-2.5 text-sm sm:px-8">
        <Link
          href={`/releases/${slug}#overview-top`}
          className={cn(
            "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium text-paper",
            "border-b-2 pb-1",
            activeBorderClass,
          )}
        >
          Overview
        </Link>
        {COMING.map((label) => (
          <span
            key={label}
            className="shrink-0 cursor-not-allowed whitespace-nowrap rounded-md px-2.5 py-1.5 text-zinc-500"
            title="Sub-page not wired yet"
          >
            {label}
          </span>
        ))}
      </div>
    </nav>
  );
}
