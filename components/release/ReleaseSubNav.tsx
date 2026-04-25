import Link from "next/link";

import { cn } from "@/lib/utils";

const TABS = [
  { id: "overview" as const, label: "Overview", href: (slug: string) => `/releases/${slug}` },
  { id: "checklist" as const, label: "Checklist", href: (slug: string) => `/releases/${slug}/checklist` },
  { id: "parallels" as const, label: "Parallels", href: (slug: string) => `/releases/${slug}/parallels` },
  { id: "autographs" as const, label: "Autographs", href: (slug: string) => `/releases/${slug}/autographs` },
  { id: "inserts" as const, label: "Inserts", href: (slug: string) => `/releases/${slug}/inserts` },
  { id: "teams" as const, label: "Teams", href: (slug: string) => `/releases/${slug}/teams` },
  { id: "insights" as const, label: "Insights", href: null },
  { id: "resources" as const, label: "Resources", href: (slug: string) => `/releases/${slug}/resources` },
];

type TabId = (typeof TABS)[number]["id"];

type Props = {
  slug: string;
  current: TabId;
  activeBorderClass: string;
};

export function ReleaseSubNav({ slug, current, activeBorderClass }: Props) {
  return (
    <nav
      className="sticky top-0 z-30 border-b border-zinc-800/90 bg-ink/90 backdrop-blur-md"
      aria-label="Release sections"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-5 py-2.5 text-sm sm:px-8">
        {TABS.map((tab) => {
          const isActive = tab.id === current;
          const href = tab.href?.(slug);
          if (href) {
            return (
              <Link
                key={tab.id}
                href={href}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium transition-colors",
                  isActive ? cn("text-paper", "border-b-2 pb-1", activeBorderClass) : "text-zinc-400 hover:text-paper",
                )}
              >
                {tab.label}
              </Link>
            );
          }
          return (
            <span
              key={tab.id}
              className="shrink-0 cursor-not-allowed whitespace-nowrap rounded-md px-2.5 py-1.5 text-zinc-600"
              title="Sub-page not wired yet"
            >
              {tab.label}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
