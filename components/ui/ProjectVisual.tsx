import type { VisualVariant } from "@/data/projects";

const BAR_HEIGHTS = [38, 52, 44, 66, 58, 82, 70, 96, 88, 118, 104, 138, 126, 150, 142, 170, 158, 190, 176, 208];

/**
 * Original abstract artwork used when a project has no real image.
 * It is deliberately non-representational: it must never be mistaken for a
 * screenshot of a finished product. Replace it by supplying `image` in
 * data/projects.ts.
 */
export function ProjectVisual({ variant, id }: { variant: VisualVariant; id: string }) {
  const glow = `pv-glow-${id}`;

  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      className="project-visual h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={glow} cx="30%" cy="25%" r="75%">
          <stop offset="0%" style={{ stopColor: "var(--sky)", stopOpacity: 0.28 }} />
          <stop offset="60%" style={{ stopColor: "var(--deep)", stopOpacity: 0.35 }} />
          <stop offset="100%" style={{ stopColor: "var(--bg)", stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="800" height="600" className="fill-bg2" />
      <rect width="800" height="600" fill={`url(#${glow})`} />

      {variant === "lattice" && (
        <g>
          {Array.from({ length: 12 }).map((_, row) =>
            Array.from({ length: 16 }).map((__, col) => (
              <circle key={`${row}-${col}`} cx={50 + col * 46} cy={50 + row * 46} r="1.6" className="fill-sky" opacity="0.4" />
            )),
          )}
          <rect x="120" y="120" width="360" height="240" className="fill-none stroke-sky" strokeWidth="1.2" opacity="0.5" />
          <rect x="220" y="200" width="360" height="240" className="fill-surface stroke-sky" strokeWidth="1.2" opacity="0.9" />
          <rect x="320" y="280" width="360" height="240" className="fill-none stroke-sky" strokeWidth="1.2" opacity="0.5" />
          <polygon points="560,0 640,0 440,600 360,600" className="fill-crimson" opacity="0.9" />
        </g>
      )}

      {variant === "bars" && (
        <g>
          <line x1="40" y1="520" x2="760" y2="520" className="stroke-line-strong" strokeWidth="1" />
          {BAR_HEIGHTS.map((h, i) => (
            <rect
              key={i}
              x={64 + i * 34}
              y={520 - h * 1.9}
              width="18"
              height={h * 1.9}
              className={i === 15 ? "fill-crimson" : "fill-sky"}
              opacity={i === 15 ? 0.95 : 0.2 + i * 0.025}
            />
          ))}
          <polyline
            fill="none"
            className="stroke-ink"
            strokeWidth="1.6"
            opacity="0.7"
            points={BAR_HEIGHTS.map((h, i) => `${73 + i * 34},${500 - h * 1.9 - 30}`).join(" ")}
          />
        </g>
      )}

      {variant === "orbit" && (
        <g>
          <circle cx="400" cy="300" r="250" className="fill-none stroke-sky" strokeWidth="1" opacity="0.25" />
          <circle cx="400" cy="300" r="180" className="fill-none stroke-sky" strokeWidth="1" opacity="0.4" />
          <ellipse cx="400" cy="300" rx="300" ry="90" transform="rotate(-24 400 300)" className="fill-none stroke-sky" strokeWidth="1" opacity="0.5" />
          <circle cx="400" cy="300" r="86" className="fill-sky" opacity="0.9" />
          <circle cx="430" cy="276" r="82" className="fill-bg2" />
          <circle cx="640" cy="196" r="9" className="fill-crimson" />
        </g>
      )}

      {variant === "slash" && (
        <g>
          <polygon points="140,600 380,0 470,0 230,600" className="fill-sky" opacity="0.14" />
          <polygon points="300,600 540,0 590,0 350,600" className="fill-sky" opacity="0.28" />
          <polygon points="470,600 710,0 800,0 800,40 560,600" className="fill-crimson" opacity="0.92" />
          <line x1="0" y1="440" x2="800" y2="140" className="stroke-ink" strokeWidth="1" opacity="0.35" />
        </g>
      )}
    </svg>
  );
}
