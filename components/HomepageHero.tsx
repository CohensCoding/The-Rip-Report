"use client";

/**
 * Rip Report homepage — three floating iridescent foil packs.
 *
 * SELF-CONTAINED. All styles are inlined in a <style> tag with `rr-` prefixed
 * class names so nothing conflicts with Tailwind, global CSS, or any other
 * styling pipeline. Drop this file in, render <HomepageHero /> from app/page.tsx,
 * and delete the old FoilPack.tsx + homepage.css. No other files needed.
 */

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";

// ─── Sport tinting ─────────────────────────────────────────────────────
type Sport = "baseball" | "basketball" | "football";
const SPORT_HUE: Record<Sport, number> = {
  baseball: 210, // navy-blue halo
  basketball: 24, // refractor-orange halo
  football: 355, // crimson halo
};

// ─── Inline styles (all rr- prefixed, immune to external CSS) ──────────
const STYLES = `
  .rr-shell { background: radial-gradient(1400px 900px at 50% 8%, #16161D 0%, #0A0A0B 55%, #050507 100%); min-height: 100vh; perspective: 2400px; color: #F4F1E7; }

  /* Masthead */
  .rr-masthead { text-align: left; padding: 80px 64px 24px; max-width: 1400px; margin: 0 auto; }
  .rr-kicker   { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; letter-spacing: .32em; text-transform: uppercase; color: #7A7770; margin-bottom: 28px; }
  .rr-wordmark { font-family: "Fraunces", Georgia, serif; font-weight: 900; font-size: 96px; line-height: .92; letter-spacing: -.02em; color: #F4F1E7; margin: 0 0 18px; }
  .rr-subhead  { font-family: "Fraunces", Georgia, serif; font-weight: 400; font-size: 18px; color: #C9C6BC; max-width: 540px; line-height: 1.5; margin: 0; }
  .rr-rule           { max-width: 1400px; margin: 56px auto 0; height: 1px; background: #2A2A2F; }
  .rr-section-label  { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 11px; letter-spacing: .32em; text-transform: uppercase; color: #7A7770; max-width: 1400px; margin: 56px auto 24px; padding: 0 64px; }

  /* Stage + columns */
  .rr-stage        { display: flex; gap: 88px; justify-content: center; align-items: flex-start; padding: 80px 40px 200px; flex-wrap: wrap; transform-style: preserve-3d; }
  .rr-pack-column  { width: 320px; display: flex; flex-direction: column; }

  /* Pack wrapper (idle float) */
  .rr-pack-wrap    { --rr-lift: 0px; --rr-float-amp: 1; width: 100%; position: relative; transform-style: preserve-3d; will-change: transform; text-decoration: none; color: inherit; display: block; }
  .rr-pack-card    { width: 100%; height: 460px; position: relative; animation: rr-float 5.5s ease-in-out infinite; transition: transform 600ms cubic-bezier(.2,.8,.2,1); }
  .rr-pack-column:nth-child(1) .rr-pack-card { animation-delay: -0.2s; }
  .rr-pack-column:nth-child(2) .rr-pack-card { animation-delay: -1.8s; }
  .rr-pack-column:nth-child(3) .rr-pack-card { animation-delay: -3.4s; }
  .rr-pack-column:nth-child(1) .rr-pedestal  { animation-delay: -0.2s; }
  .rr-pack-column:nth-child(2) .rr-pedestal  { animation-delay: -1.8s; }
  .rr-pack-column:nth-child(3) .rr-pedestal  { animation-delay: -3.4s; }

  @keyframes rr-float {
    0%   { transform: translateY(calc(var(--rr-float-amp) * 0px))   rotate(calc(var(--rr-float-amp) * -.4deg)); }
    50%  { transform: translateY(calc(var(--rr-float-amp) * -14px)) rotate(calc(var(--rr-float-amp) *  .4deg)); }
    100% { transform: translateY(calc(var(--rr-float-amp) * 0px))   rotate(calc(var(--rr-float-amp) * -.4deg)); }
  }

  /* Pedestal shadow */
  .rr-pedestal { position: absolute; left: 50%; bottom: -24px; width: 240px; height: 28px; transform: translateX(-50%); background: radial-gradient(ellipse at center, rgba(0,0,0,.55) 0%, rgba(0,0,0,.25) 45%, rgba(0,0,0,0) 75%); filter: blur(6px); animation: rr-pedestal 5.5s ease-in-out infinite; pointer-events: none; }
  @keyframes rr-pedestal {
    0%, 100% { transform: translateX(-50%) scale(1);   opacity: .85; }
    50%      { transform: translateX(-50%) scale(.78); opacity: .55; }
  }

  /* Halo (sport-tinted) */
  .rr-halo { position: absolute; inset: -50px; z-index: -1; background: radial-gradient(ellipse at center, hsla(var(--rr-ambient-hue, 210), 90%, 55%, .26) 0%, hsla(var(--rr-ambient-hue, 210), 90%, 50%, .12) 35%, transparent 70%); filter: blur(28px); animation: rr-halo 3.6s ease-in-out infinite; pointer-events: none; transition: opacity 400ms ease; }
  @keyframes rr-halo {
    0%, 100% { opacity: .6; transform: scale(1); }
    50%      { opacity: 1;  transform: scale(1.08); }
  }

  /* The card itself (cursor tilt) */
  .rr-card {
    --rr-rx: 0deg; --rr-ry: 0deg; --rr-mx: 50%; --rr-my: 50%; --rr-pointer: 0; --rr-hue: 0;
    width: 100%; height: 100%; position: relative; transform-style: preserve-3d;
    transform: rotateX(var(--rr-rx)) rotateY(var(--rr-ry)) translateZ(var(--rr-lift, 0px));
    transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 300ms ease;
    cursor: pointer;
    box-shadow: 0 30px 60px -20px rgba(0,0,0,.7), 0 18px 30px -18px rgba(0,0,0,.5);
    isolation: isolate;
    border-radius: 0;
    clip-path: var(--rr-pack-clip, none);
  }
  .rr-card:hover {
    transition: transform 80ms linear, box-shadow 300ms ease;
    box-shadow:
      0 60px 120px -20px rgba(0,0,0,.9),
      0 35px 70px -30px rgba(0,0,0,.75),
      0 0 80px -10px hsla(var(--rr-ambient-hue, 210), 90%, 55%, calc(.55 * var(--rr-pointer))),
      0 0 28px -4px hsla(var(--rr-ambient-hue, 210), 90%, 70%, .35);
  }
  .rr-pack-wrap.rr-hovered .rr-pack-card { --rr-float-amp: .4; animation-duration: 7s; }
  .rr-pack-wrap.rr-hovered .rr-card      { --rr-lift: 40px; }
  .rr-pack-wrap.rr-hovered .rr-halo      { opacity: 1.4; animation-duration: 1.8s; }
  .rr-pack-wrap.rr-hovered .rr-pedestal  { transform: translateX(-50%) scale(1.15); opacity: .95; }

  /* Click bounce */
  .rr-pack-wrap.rr-bounce .rr-pack-card {
    animation: rr-bounce 700ms cubic-bezier(.34, 1.56, .64, 1), rr-float 5.5s ease-in-out infinite 700ms;
  }
  @keyframes rr-bounce {
    0%   { transform: translateY(0)     scale(1); }
    30%  { transform: translateY(-38px) scale(1.06); }
    60%  { transform: translateY(-8px)  scale(.98); }
    100% { transform: translateY(0)     scale(1); }
  }

  /* Layered effects */
  .rr-layer { position: absolute; inset: 0; pointer-events: none; }
  .rr-art   { overflow: hidden; background: #c8c8c8; }
  .rr-art svg { width: 100%; height: 100%; display: block; filter: grayscale(1) contrast(1.05) brightness(.92); }

  .rr-iridescent {
    background: conic-gradient(from calc(var(--rr-hue) * 1deg), #ff5e8a, #ffd84d, #5cffb1, #4dc8ff, #b066ff, #ff5e8a);
    background-size: 200% 200%;
    background-position: var(--rr-mx) var(--rr-my);
    mix-blend-mode: color-dodge;
    opacity: calc(.28 + .22 * var(--rr-pointer));
    filter: saturate(1.1) blur(.3px);
  }
  .rr-sheen {
    background: linear-gradient(115deg, transparent 30%, hsla(calc(var(--rr-hue) + 40), 100%, 75%, .35) 45%, hsla(calc(var(--rr-hue) + 120), 100%, 80%, .55) 50%, hsla(calc(var(--rr-hue) + 200), 100%, 75%, .35) 55%, transparent 70%);
    background-size: 200% 200%;
    background-position: var(--rr-mx) var(--rr-my);
    mix-blend-mode: color-dodge;
    opacity: calc(.2 + .35 * var(--rr-pointer));
  }
  .rr-specular {
    background: radial-gradient(circle at var(--rr-mx) var(--rr-my), rgba(255,255,255,.55) 0%, rgba(255,255,255,.18) 12%, rgba(255,255,255,0) 35%);
    mix-blend-mode: screen;
    opacity: calc(.3 + .7 * var(--rr-pointer));
  }
  .rr-noise {
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
    background-size: 160px 160px;
    mix-blend-mode: overlay;
    opacity: .35;
  }
  .rr-frame { box-shadow: inset 0 0 0 1px rgba(0,0,0,.4), inset 0 18px 22px -10px rgba(0,0,0,.55), inset 0 -18px 22px -10px rgba(0,0,0,.55); }

  /* Embossed mark */
  .rr-emboss-slot { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; text-align: center; padding: 40px 32px; }
  .rr-emboss-mark {
    font-family: "Fraunces", Georgia, serif; font-weight: 900; font-style: italic;
    font-size: 44px; line-height: .9; letter-spacing: -.02em;
    color: rgba(244,241,231,.82);
    text-shadow:
      1px 1px 0 rgba(0,0,0,.55),
      2px 2px 1px rgba(0,0,0,.4),
      -1px -1px 0 rgba(255,255,255,.25),
      0 0 calc(8px + 22px * var(--rr-pointer, 0)) hsla(var(--rr-ambient-hue, 210), 90%, 75%, calc(.3 + .5 * var(--rr-pointer, 0)));
    transform: skewX(-6deg);
    margin-bottom: 14px;
  }
  .rr-emboss-divider { width: 64px; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); margin-bottom: 14px; }
  .rr-emboss-sub {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 11px; letter-spacing: .42em; text-transform: uppercase;
    color: rgba(244,241,231,.78);
    text-shadow:
      0 1px 0 rgba(0,0,0,.5),
      0 0 calc(4px + 10px * var(--rr-pointer, 0)) hsla(var(--rr-ambient-hue, 210), 90%, 75%, calc(.2 + .4 * var(--rr-pointer, 0)));
  }
  .rr-emboss-year {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 9px; letter-spacing: .36em; text-transform: uppercase;
    color: rgba(244,241,231,.55);
    margin-top: 18px;
    text-shadow: 0 1px 0 rgba(0,0,0,.5);
  }

  /* Tile metadata (BELOW the pack, no container) */
  .rr-meta { margin-top: 56px; padding: 0 4px; }
  .rr-meta-chips { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; }
  .rr-chip {
    font-family: "JetBrains Mono", ui-monospace, monospace;
    font-size: 10px; letter-spacing: .12em; text-transform: uppercase;
    font-weight: 500; padding: 4px 10px; border-radius: 999px;
    border: 1px solid;
  }
  .rr-chip-brand     { border-color: rgba(255,255,255,.18); color: #C9C6BC; }
  .rr-chip-baseball  { border-color: rgba(45,90,143,.4);   color: #7BA8DD; background: rgba(45,90,143,.1);  }
  .rr-chip-basketball{ border-color: rgba(242,106,28,.4);  color: #FFA868; background: rgba(242,106,28,.1); }
  .rr-chip-football  { border-color: rgba(209,51,64,.4);   color: #F08389; background: rgba(209,51,64,.1);  }
  .rr-chip-new       { border-color: rgba(46,165,88,.4);   color: #5BD18A; background: rgba(46,165,88,.1);  }
  .rr-chip-preorder  { border-color: rgba(244,168,37,.4);  color: #F4C25E; background: rgba(244,168,37,.1); }

  .rr-meta-title   { font-family: "Fraunces", Georgia, serif; font-weight: 600; font-size: 28px; line-height: 1.1; color: #F4F1E7; margin: 0 0 8px; }
  .rr-meta-date    { font-family: "JetBrains Mono", ui-monospace, monospace; font-size: 12px; color: #7A7770; margin: 0 0 12px; }
  .rr-meta-tagline { font-family: "Fraunces", Georgia, serif; font-style: italic; font-size: 15px; line-height: 1.45; color: #C9C6BC; margin: 0; }

  @media (prefers-reduced-motion: reduce) {
    .rr-pack-card, .rr-pedestal, .rr-halo { animation: none !important; }
    .rr-card { transition: none !important; }
  }
  @media (max-width: 900px) {
    .rr-masthead       { padding: 56px 24px 16px; text-align: center; }
    .rr-wordmark       { font-size: 64px; }
    .rr-subhead        { margin: 0 auto; }
    .rr-section-label  { padding: 0 24px; text-align: center; }
    .rr-stage          { gap: 64px; padding: 56px 24px 120px; }
    .rr-pack-column    { width: 280px; }
    .rr-pack-card      { height: 400px; }
    .rr-meta           { margin-top: 48px; }
  }
`;

// ═══════════════════════════════════════════════════════════════════════
// HOMEPAGE
// ═══════════════════════════════════════════════════════════════════════

export default function HomepageHero() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <div className="rr-shell">
        <header className="rr-masthead">
          <div className="rr-kicker">Issue 01 · April 2026</div>
          <h1 className="rr-wordmark">Rip Report</h1>
          <p className="rr-subhead">A visual breakdown of the most hyped sports card releases — for the community.</p>
        </header>
        <div className="rr-rule" />
        <div className="rr-section-label">Featured Breakdowns</div>

        <div className="rr-stage">
          <PackColumn
            href="/releases/2026-bowman-baseball"
            sport="baseball"
            hueSeed={0}
            shapeSeed={1337}
            brandLabel="Bowman"
            sportLabel="Baseball"
            yearTag="2026 · 1st Bowman"
            chips={[
              { label: "Bowman", variant: "brand" },
              { label: "Baseball", variant: "baseball" },
              { label: "Preorder", variant: "preorder" },
            ]}
            title="Bowman Baseball"
            date="May 13, 2026"
            tagline="Prospecting's biggest day of the year. Ethan Holliday, Konnor Griffin, and the rest of a stacked 1st Bowman class."
          />
          <PackColumn
            href="/releases/2025-26-bowman-basketball"
            sport="basketball"
            hueSeed={120}
            shapeSeed={2114}
            brandLabel="Bowman"
            sportLabel="Basketball"
            yearTag="2025–26 · NBA Return"
            chips={[
              { label: "Bowman", variant: "brand" },
              { label: "Basketball", variant: "basketball" },
              { label: "New", variant: "new" },
            ]}
            title="Bowman Basketball"
            date="Apr 22, 2026"
            tagline="First NBA Bowman in 17 years. Dual NCAA/NBA format. Here's what actually matters."
          />
          <PackColumn
            href="/releases/2025-topps-chrome-football"
            sport="football"
            hueSeed={240}
            shapeSeed={2891}
            brandLabel="Topps"
            sportLabel="Chrome Football"
            yearTag="2025 · NFL"
            chips={[
              { label: "Topps Chrome", variant: "brand" },
              { label: "Football", variant: "football" },
            ]}
            title="Topps Chrome Football"
            date="Nov 19, 2025"
            tagline="The annual chrome flagship — refractor rainbow, the rookie class that defined the year."
          />
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// COLUMN — pack + metadata
// ═══════════════════════════════════════════════════════════════════════

interface ChipDef {
  label: string;
  variant: "brand" | "baseball" | "basketball" | "football" | "preorder" | "new";
}
interface ColumnProps {
  href: string;
  sport: Sport;
  hueSeed: number;
  shapeSeed: number;
  brandLabel: string;
  sportLabel: string;
  yearTag?: string;
  chips: ChipDef[];
  title: string;
  date: string;
  tagline: string;
}

function PackColumn(p: ColumnProps) {
  return (
    <div className="rr-pack-column">
      <FoilPack
        href={p.href}
        sport={p.sport}
        hueSeed={p.hueSeed}
        shapeSeed={p.shapeSeed}
        brandLabel={p.brandLabel}
        sportLabel={p.sportLabel}
        yearTag={p.yearTag}
      />
      <div className="rr-meta">
        <div className="rr-meta-chips">
          {p.chips.map((c) => (
            <span key={c.label} className={`rr-chip rr-chip-${c.variant}`}>
              {c.label}
            </span>
          ))}
        </div>
        <h2 className="rr-meta-title">{p.title}</h2>
        <p className="rr-meta-date">{p.date}</p>
        <p className="rr-meta-tagline">{p.tagline}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FOIL PACK
// ═══════════════════════════════════════════════════════════════════════

interface FoilPackProps {
  href: string;
  sport: Sport;
  hueSeed: number;
  shapeSeed: number;
  brandLabel: string;
  sportLabel: string;
  yearTag?: string;
}

function FoilPack({ href, sport, hueSeed, shapeSeed, brandLabel, sportLabel, yearTag }: FoilPackProps) {
  const wrapRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const ambientHue = SPORT_HUE[sport];
  const artId = `rr-art-${shapeSeed}`;

  // Generate serrated clip-path: TOP + BOTTOM only, sides STRAIGHT.
  // Tooth height = 1.6% of pack height = ~7px on a 460px pack.
  useEffect(() => {
    const pack = cardRef.current;
    if (!pack) return;
    const W = 100,
      H = 100,
      teethCount = 42,
      toothH = 1.6;
    let s = shapeSeed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    const pts: [number, number][] = [];
    for (let i = 0; i <= teethCount; i++) {
      const x = (i / teethCount) * W;
      const j = (rand() - 0.5) * 0.6;
      pts.push([x + j * 0.4, (i % 2 === 0 ? 0 : toothH) + j * 0.3]);
    }
    pts.push([W, H - toothH]);
    for (let i = teethCount; i >= 0; i--) {
      const x = (i / teethCount) * W;
      const j = (rand() - 0.5) * 0.6;
      pts.push([x + j * 0.4, (i % 2 === 0 ? H : H - toothH) + j * 0.3]);
    }
    pts.push([0, toothH]);
    const clip = "polygon(" + pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(", ") + ")";
    pack.style.setProperty("--rr-pack-clip", clip);
  }, [shapeSeed]);

  // Pointer tracking → CSS variables (no React state, no re-renders).
  useEffect(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;
    let raf = 0;
    let lastEvent: PointerEvent | null = null;
    const apply = () => {
      raf = 0;
      if (!lastEvent) return;
      const r = card.getBoundingClientRect();
      const x = (lastEvent.clientX - r.left) / r.width;
      const y = (lastEvent.clientY - r.top) / r.height;
      const ry = (x - 0.5) * 22;
      const rx = (0.5 - y) * 18;
      const d = Math.min(1, Math.hypot(x - 0.5, y - 0.5) * 2);
      const pointer = 1 - Math.min(1, d * 0.5);
      const hue = hueSeed + x * 240 + y * 60;
      card.style.setProperty("--rr-rx", `${rx}deg`);
      card.style.setProperty("--rr-ry", `${ry}deg`);
      card.style.setProperty("--rr-mx", `${x * 100}%`);
      card.style.setProperty("--rr-my", `${y * 100}%`);
      card.style.setProperty("--rr-pointer", pointer.toFixed(3));
      card.style.setProperty("--rr-hue", hue.toFixed(1));
    };
    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onEnter = () => {
      card.style.transition = "";
      wrap.classList.add("rr-hovered");
    };
    const onLeave = () => {
      card.style.transition = "transform 600ms cubic-bezier(.2,.8,.2,1)";
      card.style.setProperty("--rr-rx", "0deg");
      card.style.setProperty("--rr-ry", "0deg");
      card.style.setProperty("--rr-pointer", "0");
      wrap.classList.remove("rr-hovered");
      window.setTimeout(() => {
        card.style.transition = "";
      }, 620);
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerenter", onEnter);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerenter", onEnter);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, [hueSeed]);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    e.preventDefault();
    wrap.classList.remove("rr-bounce");
    void wrap.offsetWidth;
    wrap.classList.add("rr-bounce");
    window.setTimeout(() => {
      window.location.href = href;
    }, 420);
  };

  return (
    <Link
      ref={wrapRef}
      href={href}
      onClick={onClick}
      className="rr-pack-wrap"
      style={{ ["--rr-ambient-hue" as string]: ambientHue } as CSSProperties}
      aria-label={`${brandLabel} ${sportLabel} — open release breakdown`}
    >
      <span className="rr-halo" />
      <div className="rr-pack-card">
        <span className="rr-pedestal" />
        <article ref={cardRef} className="rr-card">
          <div className="rr-layer rr-art">
            <FoilArt id={artId} />
          </div>
          <div className="rr-layer rr-iridescent" />
          <div className="rr-layer rr-sheen" />
          <div className="rr-layer rr-specular" />
          <div className="rr-layer rr-noise" />
          <div className="rr-layer rr-frame" />
          <div className="rr-layer rr-emboss-slot">
            <div className="rr-emboss-mark">{brandLabel}</div>
            <div className="rr-emboss-divider" />
            <div className="rr-emboss-sub">{sportLabel}</div>
            {yearTag && <div className="rr-emboss-year">{yearTag}</div>}
          </div>
        </article>
      </div>
    </Link>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// FOIL ART — silver mylar SVG (gradient IDs scoped per pack via shapeSeed)
// ═══════════════════════════════════════════════════════════════════════

function FoilArt({ id }: { id: string }) {
  const mylar = `${id}-mylar`;
  const crinkle = `${id}-crinkle`;
  return (
    <svg viewBox="0 0 300 440" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={mylar} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#dcdcdc" />
          <stop offset="20%" stopColor="#888" />
          <stop offset="45%" stopColor="#f0f0f0" />
          <stop offset="60%" stopColor="#555" />
          <stop offset="80%" stopColor="#cfcfcf" />
          <stop offset="100%" stopColor="#1d1d1d" />
        </linearGradient>
        <linearGradient id={crinkle} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity=".0" />
          <stop offset="20%" stopColor="#fff" stopOpacity=".25" />
          <stop offset="35%" stopColor="#000" stopOpacity=".3" />
          <stop offset="55%" stopColor="#fff" stopOpacity=".18" />
          <stop offset="70%" stopColor="#000" stopOpacity=".25" />
          <stop offset="100%" stopColor="#fff" stopOpacity=".15" />
        </linearGradient>
      </defs>
      <rect width="300" height="440" fill={`url(#${mylar})`} />
      <rect width="300" height="440" fill={`url(#${crinkle})`} opacity=".55" />
      <g opacity=".25">
        <path d="M -20 80 L 320 30" stroke="white" strokeWidth="1.5" />
        <path d="M -20 180 L 320 140" stroke="white" strokeWidth=".8" />
        <path d="M -20 290 L 320 240" stroke="white" strokeWidth="1.2" />
        <path d="M -20 380 L 320 340" stroke="white" strokeWidth=".6" />
        <path d="M -20 110 L 320 70" stroke="black" strokeWidth="1" />
        <path d="M -20 210 L 320 170" stroke="black" strokeWidth=".7" />
        <path d="M -20 330 L 320 285" stroke="black" strokeWidth="1.2" />
      </g>
      <rect x="0" y="10" width="300" height="2" fill="rgba(255,255,255,.18)" />
      <rect x="0" y="14" width="300" height="1" fill="rgba(0,0,0,.5)" />
      <rect x="0" y="425" width="300" height="2" fill="rgba(255,255,255,.18)" />
      <rect x="0" y="429" width="300" height="1" fill="rgba(0,0,0,.5)" />
    </svg>
  );
}

