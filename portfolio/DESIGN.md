# DESIGN.md

Design system for the portfolio. Source of truth for tokens is `app/globals.css` (`:root`); Tailwind reads them
through `@theme inline`. GSAP-side timing mirrors the CSS motion tokens in `lib/motion.ts`.

> Research note: this system was written from the brief. The reference sites in the brief (Vercel Web Interface
> Guidelines, Awesome DESIGN.md, Refero, React Bits, Aceternity UI, UIverse) and any Taste skill were **not
> consulted** while building: the build environment had no outbound access to them. Treat them as a review
> checklist to run against the finished site, not as sources already applied.

## 1. Concept

An original **interactive dossier**: part cinematic experience, part editorial publication, part developer
portfolio. Roughly 70% polished editorial structure, 30% Persona-inspired mood.

- **Persona 3 Reload influence (foundation):** midnight navy, luminous cyan, slow atmospheric light, calm pacing,
  an abstract moon-and-orbit motif, soft fades, introspective spacing.
- **Persona 5 Royal influence (energy):** crimson used sparingly, hard diagonals (`skewX`, `clip-path`),
  oversized condensed capitals, asymmetric alignment, expressive mask reveals.
- **Not** a game fan page: no game assets, logos, characters, screenshots, or copied layouts. All artwork is
  original SVG/CSS.

### Principles

1. Credibility first. Every flourish must serve hierarchy, wayfinding, or mood.
2. Content before motion. Everything is readable without JavaScript; motion only adds.
3. Crimson means "act or look here" (primary action, active nav state, a few graphic accents).
4. Blue means atmosphere and continuity (light, grid, secondary emphasis).
5. Never invent facts. Unfinished content is visibly marked as a placeholder.

## 2. Colour tokens

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#080B16` | Page background |
| `--bg-2` | `#10182A` | Secondary background, slanted section backdrops |
| `--surface` | `#151D30` | Elevated surfaces, figures |
| `--ink` | `#F5F3EF` | Primary text |
| `--ink-2` | `#A6AFC0` | Secondary text |
| `--sky` | `#91CAFF` | Atmospheric blue, secondary highlights, `.t-em` |
| `--deep` | `#172D56` | Deep blue light fields |
| `--crimson` | `#D64050` | Graphics and large display only |
| `--crimson-strong` | `#C0303F` | Button fills (white text) |
| `--crimson-text` | `#F0606F` | Small crimson text |
| `--line` | `#293349` | Decorative hairlines |
| `--line-strong` | `#3D4A68` | Control outlines |

### Contrast (WCAG 2.x, computed)

| Pair | Ratio |
| --- | --- |
| `--ink` on `--bg` | 17.71:1 |
| `--ink-2` on `--bg` / `--surface` | 8.89:1 / 7.61:1 |
| `--sky` on `--bg` | 11.31:1 |
| `--crimson` `#D64050` on `--bg` | **4.40:1** (fails 4.5:1 for small text) |
| White on `--crimson` `#D64050` | **4.46:1** (fails 4.5:1) |
| White on `--crimson-strong` | 5.62:1 |
| `--crimson-text` on `--bg` / `--surface` | 6.18:1 / 5.28:1 |
| `--line` on `--bg` | 1.56:1 (decorative only, never the sole indicator of a control) |

The brief's crimson was therefore split in three: the original value stays for graphics and large display, a
stronger fill is used behind white button text, and a lighter value is used for small crimson text.

## 3. Typography

| Role | Font | Notes |
| --- | --- | --- |
| Display | Anton | Condensed capitals for headlines. Never body copy. |
| Accent | Instrument Serif (italic) | Emphasised words (`.t-em`), roles, quiet editorial voice |
| Body | Manrope | Variable sans, highly legible |
| Technical | JetBrains Mono | Labels, metadata, indices (`.t-label`) |

All are open-licensed (SIL OFL) and loaded with `next/font/google` (self-hosted at build, `display: swap`,
mono not preloaded).

Fluid scale (`clamp`): label 0.7–0.78rem, small 0.875–0.95rem, body 1–1.125rem, lead 1.15–1.45rem,
h3 1.5–2.5rem, h2 2.6–6.25rem, hero 3.5–12rem. Body measure capped at `62ch`.

## 4. Spacing, grid, radii, elevation

- 4px base spacing scale (`--space-*`); section padding `clamp(5rem, 12vw, 10rem)`.
- Container `.wrap`: max 90rem, side gutter `clamp(1rem, 4vw, 3rem)`. 12-column grid from `lg`.
- Breakpoints: Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280, `2xl` 1536).
- Radii: sharp by default (`0`, `2px`, `6px`); pills are not used. Shape comes from skew and clip, not rounding.
- Elevation: hairline borders and background steps rather than shadows (`--shadow-lift` reserved).

## 5. Components

- **Navbar:** fixed, compact, translucent (`blur(12px)`), hairline border; gains opacity on scroll. Animated crimson
  indicator under the active section. Mobile: disclosure menu (not modal; no scroll lock).
- **Buttons:** `.btn-primary` (crimson, skewed backing), `.btn-ghost` (outlined). The slant lives on `::before`, so
  focus outlines are never clipped. Minimum height 44px.
- **Section opener:** `SectionHeading` = mono index + hairline + label, then a word-masked display headline.
- **Project showcase:** featured projects in three rotating asymmetric compositions; supporting projects as compact
  numbered rows. One stretched link per card; secondary links sit above it. Category filter chips use
  `aria-pressed`.
- **Placeholders:** `.ph` dashed blocks. Bracketed strings in `data/*.ts` render this way automatically.
- **Channels (contact):** typographic rows, not cards. Unconfigured channels render as non-interactive "Not set".

## 6. Motion

### Tokens

| Token | CSS | GSAP |
| --- | --- | --- |
| Micro | `--dur-micro` 180ms | `motion.duration.micro` 0.18 |
| Standard | `--dur-std` 350ms | 0.35 |
| Featured reveal | `--dur-reveal` 650ms (masks 900ms) | 0.6 |
| Stagger | `--stagger` 70ms | `motion.stagger.base` 0.07 |
| Ease out | `--ease-out` `cubic-bezier(.22,1,.36,1)` | `power3.out` / `expo.out` |
| Ease in-out | `--ease-in-out` `cubic-bezier(.65,0,.35,1)` | `power2.inOut` |

### Architecture

- **CSS** does simple reveals: `[data-reveal]` elements gain `.is-in` and transition opacity, transform, or
  `clip-path`. Word reveals translate inner spans inside an `overflow: hidden` mask.
- **GSAP + ScrollTrigger** (`MotionRoot`, `Intro`, `Navbar`) does the intro timeline, batched reveal triggering,
  atmosphere mood shifts, scrubbed parallax and timeline progress, and section tracking. All created inside
  `useGSAP` so they revert on unmount and route change (Strict Mode safe).
- **Reveal categories** (`data-reveal`): default (rise + fade), `fade`, `mask` (diagonal clip), `words`.
- No scroll hijacking; native scrolling only. Nothing waits on an animation to be usable.

### Animated backgrounds

| Layer | Where | Technique | Cost control |
| --- | --- | --- | --- |
| Atmosphere | Global, fixed | Three radial-gradient light fields drifting, one drifting grid, static grain | Transform-only animation; no blur filters; grid cell loop is seamless; crimson field hidden on mobile |
| Mood shift | Global | `html[data-atmos]` set from the section in view; fields cross-fade | Opacity transitions only |
| Data field | Hero, Contact | 2D canvas: drifting nodes, fine links, pointer attraction, a few crimson nodes | DPR ≤ 1.5, node count by area, 30fps cap on touch, pauses off-screen/hidden tab, static frame under reduced motion |
| Hero art | Hero | SVG moon plus orbit rings, slow rotation, two pointer-parallax depths | Transforms only; parallax only on fine pointers |
| Moonlight rays | Global, fixed | One conic-gradient beam (cyan, a trace of crimson) turning once per 180s; apex masked out | Single layer, transform only; hidden below 768px |
| Slashes | Global, fixed | Three skewed lines/bands. Outer element is moved by scroll (`[data-drift]`, scrubbed GSAP `yPercent`); inner `<i>` holds the skew and a slow opacity "breath", so transforms never conflict | 3 elements, transform + opacity; the wide crimson band is hidden on mobile; crimson strengthens when `data-atmos="crimson"` |
| Motes | Global, fixed | 22 small points rising 112vh with fade, deterministic positions (`lib/seeded.ts`, so server and client markup match) | Negative delays so the field is populated on load; 10 shown on mobile |
| Hero streaks | Hero | Three thin diagonal lights crossing the frame on 11–14s staggered loops, travel angle matched to the 24° rotation | `vw` on both axes keeps the angle constant; clipped by the hero |

### Section backdrops

`components/background/SectionBackdrop.tsx`. Server components, pure CSS/SVG, no client JS. Each section gets the
motif that matches its content, and only one motif per section.

| Section | Variant | Motif | Why |
| --- | --- | --- | --- |
| Projects | `market` | A price line that draws itself over 22s with a crimson end-point; candlesticks that breathe (rising blue, falling crimson) | Finance and data, the portfolio's subject matter |
| About | `sonar` | Rings expanding from the intersection diagram (one crimson), 14s cycle | Three disciplines radiating from one point |
| Skills | `digits` | Faint falling digit columns, strongest at the page edges, ~0.04 effective alpha behind text | Data, kept out of the reading column |
| Experience | `clock` | A slowly turning tick ring, a radar sweep, one fixed crimson marker at twelve | Time passing; echoes the timeline |

Conventions:

- `.backdrop` spans the section and fades out over 7rem at each end; `.backdrop-stick` is `position: sticky`,
  `100svh` tall, so the motif stays in view while the content scrolls past (parallax with no scroll listener).
  `overflow: clip` (never `hidden`) on `.backdrop` keeps sticky working.
- Backdrops sit at `z-index: -1` inside the section's isolated stacking context, above the slanted panel.
- Motifs are low-alpha and must never reduce text contrast: check any new one behind real copy.
- Under reduced motion, rays/ticks/digits/candles stop; the price line renders fully drawn with its end-point; motes,
  streaks, sonar and radar sweep (which only make sense in motion) are removed; slashes stay as static lines.
- Add a new variant by adding a function in `SectionBackdrop.tsx`, its CSS in the "Section backdrops" block of
  `globals.css`, its reduced-motion rule in the reduced-motion block, and a row here.

### Reduced motion

If `prefers-reduced-motion: reduce` the inline head script never adds `.js`: no content is hidden, no intro plays,
GSAP effects are skipped via `gsap.matchMedia`, canvas draws one static frame, CSS animations and transitions are
reduced to ~0ms, and smooth scroll is disabled. Background layers settle into the static states described above.
Hierarchy and function are unchanged.

### Failure mode

If scripts stall, a 3.5s failsafe adds `html.reveal-all`, forcing all content visible and removing the intro.

## 7. Responsive rules

- Mobile-first. The asymmetric compositions collapse to a single column; the hero art moves in-flow above the
  headline so text never sits on decoration.
- Parallax is tablet and up. Pointer effects need `(hover: hover) and (pointer: fine)`.
- Touch targets ≥ 44px. No horizontal overflow (`main { overflow-x: clip }`, decorative layers are contained).
- Every essential interaction works without hover (cards are links, the "View case study" cue is always visible).

## 8. Accessibility requirements

- Semantic landmarks, one `h1` per page, ordered headings, skip link, `main` focus target.
- Visible focus: 2px `--sky` outline, 3px offset, on all interactive elements.
- Icon-only controls carry accessible names; external links announce "(opens in a new tab)" and use
  `rel="noopener noreferrer"`.
- Placeholder URLs are never rendered as links. Email uses `mailto:`. Copy-email confirms via `role="status"`.
- Filters expose `aria-pressed` and a live-region count.
- Decorative layers (`Atmosphere`, `DataField`, hero art, outlined numerals) are `aria-hidden`.

## 9. Interaction patterns

- **Section tracking:** one ScrollTrigger per section drives the nav indicator and `aria-current`.
- **Cursor highlight:** mouse only; touch and keyboard lose nothing essential.
- **Filtering:** re-keys the list; incoming nodes are revealed immediately and use a short CSS swap-in.
- **Mobile menu:** `aria-expanded` + `aria-controls`; focus moves to the first link on open; Esc returns focus to
  the toggle; closes on outside press, link press, focus leaving, and resize to desktop.
