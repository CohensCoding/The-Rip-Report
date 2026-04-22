"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";

function fallbackText(sportLabel: string) {
  return sportLabel.replace(/\s+/g, " ").trim().toUpperCase();
}

export function ReleaseHeroMedia({
  src,
  alt,
  aspectClass,
  tintBgClass,
  sportLabel,
  sizes,
}: {
  src?: string;
  alt: string;
  aspectClass: string;
  tintBgClass: string;
  sportLabel: string;
  sizes: string;
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  const label = useMemo(() => fallbackText(sportLabel), [sportLabel]);

  return (
    <div className={cn("relative w-full overflow-hidden bg-zinc-900", aspectClass)}>
      {showFallback ? (
        <div className={cn("absolute inset-0 grid place-items-center", tintBgClass)}>
          <div className="select-none px-6 text-center">
            <div className="font-serif text-6xl tracking-[0.22em] text-paper/80 opacity-20 uppercase sm:text-7xl">
              {label}
            </div>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1500}
          className="h-full w-full object-cover"
          sizes={sizes}
          onError={() => setFailed(true)}
          priority={false}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink/85" />
    </div>
  );
}

