import type { CSSProperties } from "react";
import { r1, seeded } from "@/lib/seeded";

/**
 * Global animated background, fixed behind every section. Pure CSS (see
 * "Atmosphere" in globals.css); only transforms and opacity animate, so it
 * stays on the compositor.
 *
 * Layers, back to front:
 *   blobs   three slow-drifting light fields (blue, deep blue, crimson)
 *   rays    a wide conic moonlight beam that turns once every ~3 minutes
 *   grid    a coordinate grid that drifts exactly one cell per loop
 *   slashes crimson/blue diagonal lines whose depth shifts with page scroll
 *           (MotionRoot drives [data-drift] with a scrubbed GSAP tween)
 *   motes   small data points that rise and fade
 *   grain   static film grain
 *
 * html[data-atmos] (set by MotionRoot from the section in view) changes which
 * layers are strongest.
 */
const MOTES = Array.from({ length: 22 }, (_, i) => {
  const rand = seeded(900 + i * 17);
  return {
    x: rand() * 100,
    size: 1.5 + rand() * 2.2,
    duration: 24 + rand() * 28,
    delay: -rand() * 52,
    sway: (rand() - 0.5) * 9,
    accent: i % 7 === 2,
  };
});

const vars = (v: Record<string, string | number>): CSSProperties => v as CSSProperties;

export function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos-blob atmos-a" />
      <div className="atmos-blob atmos-b" />
      <div className="atmos-blob atmos-c" />
      <div className="atmos-rays" />
      <div className="atmos-grid" />

      <div className="atmos-slash atmos-slash-1" data-drift="16">
        <i />
      </div>
      <div className="atmos-slash atmos-slash-2" data-drift="-10">
        <i />
      </div>
      <div className="atmos-slash atmos-slash-3" data-drift="24">
        <i />
      </div>

      <div className="atmos-motes">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="atmos-mote"
            data-accent={m.accent || undefined}
            style={vars({
              "--x": r1(m.x),
              "--s": r1(m.size),
              "--dur": `${r1(m.duration)}s`,
              "--dly": `${r1(m.delay)}s`,
              "--sway": `${r1(m.sway)}vw`,
            })}
          />
        ))}
      </div>

      <div className="atmos-grain" />
    </div>
  );
}
