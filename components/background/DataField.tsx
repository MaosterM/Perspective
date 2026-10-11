"use client";

import { useEffect, useRef } from "react";

interface DataFieldProps {
  /** Dominant hue. A small share of nodes is always crimson. */
  tone?: "cyan" | "crimson";
  className?: string;
}

interface FieldNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  accent: boolean;
}

/**
 * Hero/contact background: a quiet network of drifting data points joined by
 * fine lines, gently drawn toward the pointer on desktop.
 *
 * Performance and accessibility:
 *  - 2D canvas, device pixel ratio capped at 1.5, node count scaled to area
 *  - fewer nodes and a 30fps cap on coarse (touch) pointers
 *  - pauses when off-screen or when the tab is hidden
 *  - reduced motion: a single static frame, no loop
 *  - decorative only: aria-hidden, no pointer events
 */
export function DataField({ tone = "cyan", className }: DataFieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const base = tone === "cyan" ? "145, 202, 255" : "214, 64, 80";
    const accent = tone === "cyan" ? "214, 64, 80" : "145, 202, 255";

    let width = 0;
    let height = 0;
    let nodes: FieldNode[] = [];
    let linkDistance = 140;
    let frame = 0;
    let lastTime = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;
    const pointer = { x: -9999, y: -9999 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]!;
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.28;
            ctx.strokeStyle = `rgba(${a.accent || b.accent ? accent : base}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const pdx = a.x - pointer.x;
        const pdy = a.y - pointer.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < 170) {
          ctx.strokeStyle = `rgba(${base}, ${(1 - pdist / 170) * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.accent ? accent : base}, ${n.accent ? 0.9 : 0.6})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = (time: number) => {
      frame = 0;
      if (!onScreen || !tabVisible || reduceQuery.matches) return;
      frame = requestAnimationFrame(step);

      if (coarse && time - lastTime < 33) return;
      lastTime = time;

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = width + 10;
        if (n.x > width + 10) n.x = -10;
        if (n.y < -10) n.y = height + 10;
        if (n.y > height + 10) n.y = -10;
      }
      draw();
    };

    const start = () => {
      if (!frame && onScreen && tabVisible && !reduceQuery.matches) {
        frame = requestAnimationFrame(step);
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      linkDistance = Math.min(150, Math.max(90, width / 7));
      const count = Math.round(Math.min(72, Math.max(20, (width * height) / (coarse ? 24000 : 15000))));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.3 + 0.6,
        accent: i % 13 === 0,
      }));
      draw();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      tabVisible = !document.hidden;
      start();
    };
    const onReduceChange = () => {
      if (reduceQuery.matches) draw();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const intersection = new IntersectionObserver(([entry]) => {
      onScreen = entry?.isIntersecting ?? true;
      start();
    });
    intersection.observe(canvas);

    const host = canvas.parentElement ?? window;
    host.addEventListener("pointermove", onPointerMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    reduceQuery.addEventListener("change", onReduceChange);

    resize();
    start();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      host.removeEventListener("pointermove", onPointerMove as EventListener);
      host.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceQuery.removeEventListener("change", onReduceChange);
    };
  }, [tone]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
