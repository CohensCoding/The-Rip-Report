"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  href: string;
  brandLabel: string;
  sportLabel: string;
  yearTag: string;
  embossSrc?: string;
  className?: string;
};

/**
 * Clip-path with serration ONLY on top and bottom.
 * Left/right edges remain perfectly straight.
 */
function topBottomSerrationClipPath(teeth = 28, depth = 10): string {
  const pts: Array<[number, number]> = [];
  const step = 100 / teeth;

  // Start at top-left corner.
  pts.push([0, 0]);

  // Top serration (left → right).
  for (let i = 0; i < teeth; i++) {
    const x0 = i * step;
    const xMid = x0 + step / 2;
    const x1 = x0 + step;
    pts.push([xMid, depth]);
    pts.push([x1, 0]);
  }

  // Straight right edge down.
  pts.push([100, 100]);

  // Bottom serration (right → left) while keeping straight sides.
  for (let i = teeth; i > 0; i--) {
    const x0 = (i - 1) * step;
    const xMid = x0 + step / 2;
    pts.push([xMid, 100 - depth]);
    pts.push([x0, 100]);
  }

  // Straight left edge up closes polygon implicitly.
  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
}

export function FoilPack({
  href,
  brandLabel,
  sportLabel,
  yearTag,
  embossSrc,
  className,
}: Props) {
  const id = useId();
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [clip, setClip] = useState<string | null>(null);

  const gradientId = useMemo(() => `foil-grad-${id.replace(/[:]/g, "")}`, [id]);

  useEffect(() => {
    // Hydration: serrated clip-path arrives post-mount (SSR shows rectangle briefly).
    setClip(topBottomSerrationClipPath(28, 10));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      const mx = `${Math.round(px * 100)}%`;
      const my = `${Math.round(py * 100)}%`;

      // Small tilt; keep it subtle so it reads premium, not gimmick.
      const ry = (px - 0.5) * 10; // deg
      const rx = -(py - 0.5) * 8; // deg

      el.style.setProperty("--mx", mx);
      el.style.setProperty("--my", my);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--shine", "0.55");
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    };

    const onLeave = () => {
      el.style.setProperty("--shine", "0.35");
      el.style.transform = "none";
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      className={cn("pack-card foil-pack", className)}
      style={clip ? ({ clipPath: clip } as React.CSSProperties) : undefined}
    >
      <div className="pack-inner">
        <div className="emboss-slot">
          {embossSrc ? (
            <img src={embossSrc} alt={`${brandLabel} ${sportLabel}`} className="emboss-art" />
          ) : (
            <div className="emboss-fallback" aria-label={`${brandLabel} ${sportLabel} ${yearTag}`}>
              <div className="emboss-brand">{brandLabel}</div>
              <div className="emboss-sport">{sportLabel}</div>
              <div className="emboss-year">{yearTag}</div>
              <svg width="1" height="1" aria-hidden className="hidden">
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(244,244,245,0.95)" />
                    <stop offset="1" stopColor="rgba(161,161,170,0.5)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

