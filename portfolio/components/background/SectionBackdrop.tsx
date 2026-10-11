import type { CSSProperties } from "react";
import { r1, seeded } from "@/lib/seeded";

/**
 * Per-section animated backdrops. Server components, pure CSS/SVG: no client
 * JavaScript, no canvas. Every variant is decorative (aria-hidden), animates
 * only transform/opacity/stroke-dashoffset, and has a static fallback under
 * prefers-reduced-motion (see globals.css, "Section backdrops").
 *
 * Each section picks the motif that matches its content:
 *   market  Projects    a price line that draws itself, candles that breathe
 *   sonar   About       rings radiating from the intersection diagram
 *   digits  Skills      faint columns of falling digits
 *   clock   Experience  a slowly turning tick ring with a radar sweep
 *
 * Layout: `.backdrop` spans the whole section; `.backdrop-stick` is
 * viewport-tall and sticky inside it, so the motif stays in view while the
 * section's content scrolls past (free parallax, no scroll listeners).
 */
export type BackdropVariant = "market" | "sonar" | "digits" | "clock";

const vars = (v: Record<string, string | number>): CSSProperties => v as CSSProperties;

/* ---------------------------------------------------------------- market */

const MARKET_W = 1200;
const MARKET_H = 520;

function buildMarket() {
  const rand = seeded(7);
  const n = 40;
  let level = 0.45;
  const points: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    level = Math.min(0.88, Math.max(0.14, level + (rand() - 0.43) * 0.13));
    points.push([(i / (n - 1)) * MARKET_W, MARKET_H - 36 - level * (MARKET_H - 110)]);
  }
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${r1(x)} ${r1(y)}`).join(" ");

  const candles = Array.from({ length: 26 }, (_, i) => {
    const x = 28 + (i * (MARKET_W - 56)) / 25;
    const anchor = points[Math.min(n - 1, Math.round((i / 25) * (n - 1)))]![1];
    const body = 10 + rand() * 44;
    const top = anchor - body / 2 + (rand() - 0.5) * 30;
    return {
      x,
      top,
      body,
      wickUp: 6 + rand() * 22,
      wickDown: 6 + rand() * 22,
      falling: rand() < 0.32,
    };
  });

  return { path, candles, tip: points[n - 1]! };
}

const MARKET = buildMarket();

function Market() {
  return (
    <svg
      className="market"
      viewBox={`0 0 ${MARKET_W} ${MARKET_H}`}
      preserveAspectRatio="xMidYMax slice"
      focusable="false"
    >
      <g className="market-grid">
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line key={f} x1="0" x2={MARKET_W} y1={r1(MARKET_H * f)} y2={r1(MARKET_H * f)} />
        ))}
      </g>
      {MARKET.candles.map((c, i) => (
        <g
          key={i}
          className="market-candle"
          data-falling={c.falling || undefined}
          style={vars({ "--i": i })}
        >
          <line x1={r1(c.x)} x2={r1(c.x)} y1={r1(c.top - c.wickUp)} y2={r1(c.top + c.body + c.wickDown)} />
          <rect x={r1(c.x - 5)} y={r1(c.top)} width="10" height={r1(c.body)} />
        </g>
      ))}
      <path className="market-line" d={MARKET.path} pathLength={1} />
      <circle className="market-tip" cx={r1(MARKET.tip[0])} cy={r1(MARKET.tip[1])} r="5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- sonar */

function Sonar() {
  return (
    <div className="sonar">
      {[0, 1, 2, 3].map((i) => (
        <i key={i} data-tone={i === 2 ? "crimson" : undefined} style={vars({ "--i": i })} />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- digits */

const DIGIT_LINES = 64;

const DIGIT_COLUMNS = Array.from({ length: 16 }, (_, i) => {
  const rand = seeded(100 + i * 31);
  return {
    left: (i / 15) * 97 + 1,
    duration: 46 + rand() * 54,
    delay: -rand() * 90,
    accent: i === 3 || i === 11,
    text: Array.from({ length: DIGIT_LINES }, () => String(Math.floor(rand() * 10))).join("\n"),
  };
});

function Digits() {
  return (
    <div className="digits">
      {DIGIT_COLUMNS.map((col, i) => (
        <div
          key={i}
          className="digit-col"
          data-accent={col.accent || undefined}
          style={vars({ "--l": r1(col.left), "--dur": `${r1(col.duration)}s`, "--dly": `${r1(col.delay)}s` })}
        >
          <div className="digit-run">
            <span>{col.text}</span>
            <span>{col.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- clock */

const CLOCK_TICKS = Array.from({ length: 60 }, (_, i) => {
  const angle = (i / 60) * Math.PI * 2;
  const major = i % 5 === 0;
  const inner = major ? 316 : 331;
  const outer = 348;
  return {
    major,
    x1: (400 + Math.sin(angle) * inner).toFixed(2),
    y1: (400 - Math.cos(angle) * inner).toFixed(2),
    x2: (400 + Math.sin(angle) * outer).toFixed(2),
    y2: (400 - Math.cos(angle) * outer).toFixed(2),
  };
});

function Clock() {
  return (
    <div className="clock">
      <div className="clock-sweep" />
      <svg viewBox="0 0 800 800" focusable="false">
        <g className="clock-ticks">
          {CLOCK_TICKS.map((t, i) => (
            <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} data-major={t.major || undefined} />
          ))}
        </g>
        <g className="clock-dials">
          <circle cx="400" cy="400" r="296" className="clock-dash" />
          <circle cx="400" cy="400" r="252" className="clock-thin" />
        </g>
        <polygon className="clock-marker" points="394,18 414,18 407,30 387,30" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------- streaks */

const STREAKS = [
  { top: 6, len: 38, duration: 11, delay: 3.2, tone: "sky" },
  { top: 30, len: 30, duration: 14, delay: 7.5, tone: "crimson" },
  { top: 58, len: 44, duration: 12, delay: 10.5, tone: "sky" },
] as const;

/**
 * Hero only: a few thin diagonal light streaks that cross the frame on long,
 * staggered loops (one every few seconds). Echoes the sharp diagonals of the
 * identity without competing with the headline.
 */
export function HeroStreaks() {
  return (
    <div className="hero-streaks" aria-hidden="true">
      {STREAKS.map((s, i) => (
        <span
          key={i}
          className="hero-streak"
          data-tone={s.tone}
          style={vars({ "--top": `${s.top}%`, "--len": `${s.len}vw`, "--dur": `${s.duration}s`, "--dly": `${s.delay}s` })}
        />
      ))}
    </div>
  );
}

/* ----------------------------------------------------------------- root */

export function SectionBackdrop({ variant }: { variant: BackdropVariant }) {
  return (
    <div className="backdrop" data-backdrop={variant} aria-hidden="true">
      <div className="backdrop-stick">
        {variant === "market" && <Market />}
        {variant === "sonar" && <Sonar />}
        {variant === "digits" && <Digits />}
        {variant === "clock" && <Clock />}
      </div>
    </div>
  );
}
