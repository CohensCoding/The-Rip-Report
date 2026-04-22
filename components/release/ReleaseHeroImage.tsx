"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

function fallbackText(sportLabel: string) {
  return sportLabel.replace(/\s+/g, " ").trim().toUpperCase();
}

export function ReleaseHeroImage({
  src,
  alt,
  tintBgClass,
  sportLabel,
}: {
  src?: string;
  alt: string;
  tintBgClass: string;
  sportLabel: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;
  const label = useMemo(() => fallbackText(sportLabel), [sportLabel]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-900 bg-zinc-950/40 aspect-[16/9]">
      {showFallback ? (
        <div className={cn("absolute inset-0 grid place-items-center", tintBgClass)}>
          <div className="select-none px-8 text-center">
            <div className="font-serif text-7xl tracking-[0.22em] text-paper/80 opacity-20 uppercase sm:text-8xl">
              {label}
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={900}
          className="h-full w-full object-cover"
          sizes="(min-width: 1280px) 1152px, 100vw"
          onError={() => setFailed(true)}
          priority={false}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/70" />
    </div>
  );
}
