import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ReleaseSection({
  eyebrow,
  children,
  className,
  innerClassName,
}: {
  eyebrow: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={cn("border-t border-zinc-900 py-20 md:py-24", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", innerClassName)}>
        <div className="mb-8 text-sm font-medium tracking-[0.28em] text-zinc-500 uppercase">{eyebrow}</div>
        {children}
      </div>
    </section>
  );
}
