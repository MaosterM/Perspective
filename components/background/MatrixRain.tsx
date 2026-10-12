"use client";

import { useEffect, useRef } from "react";

/**
 * Global "code rain" background: columns of half-width katakana and digits
 * falling at different speeds, each with a bright head and a fading trail.
 *
 * How it draws: one transparent 2D canvas. Each step the previous frame is
 * faded toward transparent (destination-out), the old head cell is redrawn in
 * the trail colour, and a new bright head is drawn one row lower. Because the
 * canvas stays transparent, the light fields in the page background show
 * through it.
 *
 * Colour: cool cyan (the site's --sky family). While the section in view
 * declares data-atmos="crimson" (the contact section), the tint eases toward
 * crimson. To change the base tint edit TONES below.
 *
 * Performance and accessibility:
 *  - 22fps cap (16fps on touch), device pixel ratio capped at 1.5
 *  - pauses while the tab is hidden
 *  - reduced motion: one pre-rolled static frame, no animation loop
 *  - decorative only: aria-hidden, no pointer events (set by .atmos)
 *  - if the system has no katakana font, falls back to digits, A-F and symbols
 *    instead of showing missing-glyph boxes
 */
const KATAKANA = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
const DIGITS = "0123456789";
const FALLBACK_SET = "0123456789ABCDEF:.=*+-<>|";

const FONT_STACK =
  '"MS Gothic", "Yu Gothic UI", "Hiragino Kaku Gothic ProN", "Noto Sans Mono CJK JP", "Noto Sans JP", ui-monospace, "SFMono-Regular", Menlo, monospace';

type RGB = [number, number, number];

/** Base tint, and the tint used while a crimson section is in view. */
const TONES: { base: RGB; crimson: RGB } = {
  base: [112, 210, 255],
  crimson: [226, 78, 94],
};

const FADE = 0.055; // alpha removed from the previous frame per step; higher = shorter trails
const PREROLL_STEPS = 110; // steps simulated up front so the page never starts empty

interface Drop {
  /** Row of the head. Negative means it has not entered the screen yet. */
  row: number;
  /** Advance one row every `period` steps. 1 is fastest. */
  period: number;
  tick: number;
}

/**
 * Draws two different katakana. If a font is missing they both come out as the
 * same "missing glyph" box (or nothing), so identical pixels mean unsupported.
 */
function katakanaSupported(): boolean {
  const probe = document.createElement("canvas");
  probe.width = 24;
  probe.height = 24;
  const c = probe.getContext("2d", { willReadFrequently: true });
  if (!c) return false;
  c.font = `16px ${FONT_STACK}`;
  c.textBaseline = "top";
  c.fillStyle = "#fff";
  const render = (glyph: string) => {
    c.clearRect(0, 0, 24, 24);
    c.fillText(glyph, 2, 2);
    return c.getImageData(0, 0, 24, 24).data;
  };
  const a = render("ｱ");
  const b = render("ﾝ");
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return true;
  }
  return false;
}

export function MatrixRain({ className = "atmos-rain" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const glyphs = (katakanaSupported() ? KATAKANA + DIGITS : FALLBACK_SET).split("");
    const frameMs = 1000 / (coarse ? 16 : 22);

    let width = 0;
    let height = 0;
    let fontSize = 16;
    let colW = 18;
    let rowH = 19;
    let cols = 0;
    let rows = 0;
    let drops: Drop[] = [];
    const tint: RGB = [...TONES.base];

    let frame = 0;
    let last = 0;
    let tabVisible = !document.hidden;

    const randomGlyph = () => glyphs[(Math.random() * glyphs.length) | 0]!;
    const newPeriod = () => 1 + ((Math.random() * 2.6) | 0);

    const stepOnce = () => {
      // Fade what is already there; the canvas stays transparent.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0, 0, 0, ${FADE})`;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      const [r, g, b] = tint;
      const trail = `rgba(${r | 0}, ${g | 0}, ${b | 0}, 0.85)`;
      const head = `rgba(${(r + (255 - r) * 0.72) | 0}, ${(g + (255 - g) * 0.72) | 0}, ${(b + (255 - b) * 0.72) | 0}, 0.95)`;

      ctx.font = `${fontSize}px ${FONT_STACK}`;
      ctx.textBaseline = "top";

      for (let i = 0; i < cols; i++) {
        const drop = drops[i]!;
        if (++drop.tick < drop.period) continue;
        drop.tick = 0;

        const x = i * colW;
        const prev = drop.row - 1;
        if (prev >= 0 && prev < rows) {
          ctx.clearRect(x, prev * rowH, colW, rowH);
          ctx.fillStyle = trail;
          ctx.fillText(randomGlyph(), x, prev * rowH);
        }
        if (drop.row >= 0 && drop.row < rows) {
          ctx.clearRect(x, drop.row * rowH, colW, rowH);
          ctx.fillStyle = head;
          ctx.fillText(randomGlyph(), x, drop.row * rowH);
        }

        drop.row++;
        // Once past the bottom, restart after a random pause so columns never sync up.
        if (drop.row > rows && Math.random() > 0.95) {
          drop.row = -((Math.random() * 28) | 0);
          drop.period = newPeriod();
        }
      }
    };

    const easeTint = () => {
      const target = document.documentElement.dataset.atmos === "crimson" ? TONES.crimson : TONES.base;
      for (let i = 0; i < 3; i++) tint[i] = tint[i]! + (target[i]! - tint[i]!) * 0.05;
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (time - last < frameMs) return;
      last = time;
      easeTint();
      stepOnce();
    };

    const start = () => {
      if (!frame && tabVisible && !reduceQuery.matches) frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Mobile browser bars change the height by small amounts while scrolling.
      // Rebuilding on those would restart the rain, so only react to real changes.
      if (cols > 0 && Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 140) return;

      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      fontSize = width < 768 ? 14 : 16;
      colW = fontSize * 1.15;
      rowH = fontSize * 1.2;
      cols = Math.ceil(width / colW);
      rows = Math.ceil(height / rowH);
      drops = Array.from({ length: cols }, () => ({
        row: -((Math.random() * rows) | 0),
        period: newPeriod(),
        tick: 0,
      }));
      for (let i = 0; i < PREROLL_STEPS; i++) stepOnce();
    };

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) start();
      else stop();
    };
    const onReduceChange = () => {
      if (reduceQuery.matches) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onReduceChange);

    resize();
    start();

    return () => {
      stop();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onReduceChange);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
