import { cn } from "@/lib/utils";

type Props = {
  id: string;
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
};

export function OverviewShell({ id, eyebrow, children, className }: Props) {
  return (
    <section id={id} className={cn("scroll-mt-24 border-t border-zinc-800/80 py-14 sm:py-16", className)}>
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <p className="mb-3 text-xs font-medium tracking-[0.28em] text-zinc-500">{eyebrow}</p>
        {children}
      </div>
    </section>
  );
}
