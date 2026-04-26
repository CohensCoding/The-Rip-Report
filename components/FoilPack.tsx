"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
  href: string;
  issueKicker: string;
  wordmark: string;
  title: string;
  subtitle: string;
  chipLabel: string;
  chipDotHex: string;
  ctaLabel?: string;
  embossSrc?: string;
  className?: string;
};

function serratedClipPath(teeth = 26, depth = 10): string {
  // Sawtooth top/bottom edge while keeping rounded corners (rounded comes from border-radius).
  const pts: Array<[number, number]> = [];
  const step = 100 / teeth;

  // top edge (0..100)
  pts.push([0, 0]);
  for (let i = 0; i < teeth; i++) {
    const x0 = i * step;
    const x1 = x0 + step / 2;
    const x2 = x0 + step;
    pts.push([x1, depth]);
    pts.push([x2, 0]);
  }

  // right edge
  pts.push([100, 100]);

  // bottom edge (100..0)
  for (let i = teeth; i > 0; i--) {
    const x0 = (i - 1) * step;
    const x1 = x0 + step / 2;
    const x2 = x0;
    pts.push([x1, 100 - depth]);
    pts.push([x2, 100]);
  }

  return `polygon(${pts.map(([x, y]) => `${x}% ${y}%`).join(",")})`;
}

export function FoilPack({
  href,
  issueKicker,
  wordmark,
  title,
  subtitle,
  chipLabel,
  chipDotHex,
  ctaLabel = "Read the breakdown",
  embossSrc,
  className,
}: Props) {
  const id = useId();
  const ref = useRef<HTMLAnchorElement | null>(null);
  const [clip, setClip] = useState<string | null>(null);

  const gradientId = useMemo(() => `foil-grad-${id.replace(/[:]/g, "")}`, [id]);

  useEffect(() => {
    // Hydration: serrated clip-path arrives post-mount (SSR shows rectangle briefly).
    setClip(serratedClipPath(28, 10));
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
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
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
      className={cn("foil-pack block h-full", className)}
      style={clip ? ({ clipPath: clip } as React.CSSProperties) : undefined}
    >
      <div className="foil-pack-inner">
        <div className="foil-pack-top">
          <div className="min-w-0">
            <div className="foil-pack-meta">{issueKicker}</div>
            <div className="foil-pack-wordmark">{wordmark}</div>
          </div>

          {/* Optional emboss art; fallback is just text wordmark (don’t reference public/brand yet). */}
          {embossSrc ? (
            <img src={embossSrc} alt="" className="h-10 w-24 opacity-70" />
          ) : (
            <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden className="shrink-0 opacity-80">
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgba(244,244,245,0.95)" />
                  <stop offset="1" stopColor="rgba(161,161,170,0.5)" />
                </linearGradient>
              </defs>
              <rect x="6" y="6" width="32" height="32" rx="10" fill={`url(#${gradientId})`} opacity="0.16" />
              <path
                d="M14 28c6-2 10-6 16-12"
                stroke={`url(#${gradientId})`}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
              <path
                d="M16 18c3 0 6 1 10 5"
                stroke={`url(#${gradientId})`}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
          )}
        </div>

        <div className="foil-pack-title">{title}</div>
        <div className="foil-pack-subtitle">{subtitle}</div>

        <div className="foil-pack-footer">
          <div className="foil-pack-chip">
            <span className="foil-pack-dot" style={{ backgroundColor: chipDotHex }} aria-hidden />
            <span>{chipLabel}</span>
          </div>
          <div className="foil-pack-cta">{ctaLabel} →</div>
        </div>
      </div>
    </Link>
  );
}

