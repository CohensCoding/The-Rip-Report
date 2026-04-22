import { FileText, Link as LinkIcon, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { getReleaseBySlug } from "@/lib/releases";
import type { Release } from "@/types/release";

import { ReleaseSection } from "./Section";

export function Links({ release }: { release: Release }) {
  const { links } = release;

  const isProbablyUrl = (value: string) => /^https?:\/\//i.test(value.trim());

  const hasOdds = Boolean(links.officialOddsPdf?.trim());
  const hasProduct = Boolean(links.officialProductPage?.trim());
  const hasChecklist = Boolean(links.checklistSource?.trim());
  const hasBuys = Boolean(links.buyLinks?.length);
  const hasRelated = Boolean(links.relatedReleases?.length);

  if (!hasOdds && !hasProduct && !hasChecklist && !hasBuys && !hasRelated) return null;

  const buyGroups = new Map<string, NonNullable<typeof links.buyLinks>>();
  for (const bl of links.buyLinks ?? []) {
    const key = bl.retailer.trim();
    const arr = buyGroups.get(key) ?? [];
    arr.push(bl);
    buyGroups.set(key, arr);
  }

  const related = (links.relatedReleases ?? []).map((r) => {
    const full = getReleaseBySlug(r.slug);
    return { entry: r, full };
  });

  return (
    <ReleaseSection eyebrow="RESOURCES">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          {hasOdds ? (
            isProbablyUrl(links.officialOddsPdf!) ? (
              <a
                href={links.officialOddsPdf}
                className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85 transition hover:border-zinc-800"
                target="_blank"
                rel="noreferrer"
              >
                <FileText className="h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Official odds PDF</span>
                  <span className="mt-1 block truncate">{links.officialOddsPdf}</span>
                </span>
              </a>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85">
                <FileText className="mt-0.5 h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Official odds PDF</span>
                  <span className="mt-1 block text-sm text-zinc-300">{links.officialOddsPdf}</span>
                </span>
              </div>
            )
          ) : null}

          {hasProduct ? (
            isProbablyUrl(links.officialProductPage!) ? (
              <a
                href={links.officialProductPage}
                className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85 transition hover:border-zinc-800"
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Official product page</span>
                  <span className="mt-1 block truncate">{links.officialProductPage}</span>
                </span>
              </a>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85">
                <LinkIcon className="mt-0.5 h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Official product page</span>
                  <span className="mt-1 block text-sm text-zinc-300">{links.officialProductPage}</span>
                </span>
              </div>
            )
          ) : null}

          {hasChecklist ? (
            isProbablyUrl(links.checklistSource!) ? (
              <a
                href={links.checklistSource}
                className="flex items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85 transition hover:border-zinc-800"
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Checklist source</span>
                  <span className="mt-1 block truncate">{links.checklistSource}</span>
                </span>
              </a>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-zinc-900 bg-zinc-950/25 px-4 py-3 text-sm text-paper/85">
                <LinkIcon className="mt-0.5 h-4 w-4 text-zinc-400" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Checklist source</span>
                  <span className="mt-1 block text-sm text-zinc-300">{links.checklistSource}</span>
                </span>
              </div>
            )
          ) : null}
        </div>

        <div className="space-y-8">
          {hasBuys ? (
            <div>
              <div className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Buy links</div>
              <div className="mt-4 space-y-6">
                {[...buyGroups.entries()].map(([retailer, items]) => (
                  <div key={retailer}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-paper">
                      <ShoppingBag className="h-4 w-4 text-zinc-400" />
                      {retailer}
                    </div>
                    <div className="mt-3 space-y-2">
                      {items.map((bl, idx) => (
                        isProbablyUrl(bl.url) ? (
                          <a
                            key={`${retailer}:${bl.url}:${idx}`}
                            href={bl.url}
                            className="block truncate rounded-lg border border-zinc-900 bg-zinc-950/25 px-3 py-2 text-sm text-zinc-200 transition hover:border-zinc-800"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {bl.format ? `${bl.format}: ` : ""}
                            {bl.url}
                          </a>
                        ) : (
                          <div
                            key={`${retailer}:${bl.url}:${idx}`}
                            className="rounded-lg border border-zinc-900 bg-zinc-950/25 px-3 py-2 text-sm text-zinc-300"
                          >
                            {bl.format ? `${bl.format}: ` : ""}
                            {bl.url}
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {hasRelated ? (
            <div>
              <div className="text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase">Related releases</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {related.map(({ entry, full }) => (
                  <Link
                    key={entry.slug}
                    href={`/releases/${entry.slug}`}
                    className="group overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/25 transition hover:border-zinc-800"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
                      {full?.heroImage ? (
                        <Image
                          src={full.heroImage}
                          alt={full.title}
                          width={640}
                          height={360}
                          className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-ink" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="font-serif text-base leading-snug text-paper">{full?.title ?? entry.title}</div>
                        <div className="mt-2 text-[10px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
                          {entry.relationship.split("-").join(" ")}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ReleaseSection>
  );
}
