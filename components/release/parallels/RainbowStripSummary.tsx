import type { Parallel } from "@/types/parallels";

import { cn } from "@/lib/utils";

type Props = {
  strip: Parallel[];
  className?: string;
};

/**
 * Shared teaser strip used on Overview (Module 5) and Parallels page summary —
 * same hex bars; full ladder lives in the explorer below.
 */
export function RainbowStripSummary({ strip, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-end gap-1 sm:gap-1.5", className)}>
      {strip.length === 0 ? (
        <p className="text-sm text-zinc-500">No parallel color data available.</p>
      ) : null}
      {strip.map((p) => (
        <div key={p.slug} className="flex flex-col items-center" title={p.name}>
          <div
            className="w-5 rounded-t sm:w-6"
            style={{
              height: `${12 + Math.min(48, typeof p.printRun === "number" ? 320 / p.printRun : 20)}px`,
              backgroundColor: p.color.hex,
            }}
          />
          <div className="mt-1 max-w-[3.5rem] truncate text-center text-[9px] tabular-nums text-zinc-500 sm:text-[10px]">
            {typeof p.printRun === "number" ? `/${p.printRun}` : (p.printRunLabel ?? "—")}
          </div>
        </div>
      ))}
    </div>
  );
}
