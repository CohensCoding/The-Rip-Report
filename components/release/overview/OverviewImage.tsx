"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Local `/images/...` placeholders often 404 until assets ship — hide broken chrome, keep alt in layout.
 */
export function OverviewImage({ src, alt, className }: Props) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-zinc-900/80 p-3 text-center text-[11px] leading-snug text-zinc-500",
          className,
        )}
      >
        {alt}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setOk(false)}
    />
  );
}
