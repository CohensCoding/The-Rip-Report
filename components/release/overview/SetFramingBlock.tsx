import { OverviewShell } from "./OverviewShell";

type Props = { framing?: string };

export default function SetFramingBlock({ framing }: Props) {
  if (!framing?.trim()) return null;

  const paras = framing
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <OverviewShell id="overview-mod-set-framing" eyebrow="WHAT YOU NEED TO KNOW">
      <h2 className="font-serif text-2xl text-paper sm:text-3xl">What you need to know about this release</h2>
      <div className="mt-4 max-w-prose space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </OverviewShell>
  );
}

