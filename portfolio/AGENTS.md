# AGENTS.md

Guidance for AI coding agents working in this repository.

## Stack

Next.js (App Router), React, TypeScript (strict), Tailwind CSS v4, GSAP + ScrollTrigger via `@gsap/react`,
`lucide-react`. Package manager: pnpm.

## Rules

- **Never invent facts.** Do not fabricate projects, skills, achievements, metrics, sponsors, attendance figures,
  handles, or URLs. Unknown content stays a `[Bracketed placeholder]`.
- Content lives in `data/*.ts`; presentation lives in `components/`. Do not hard-code content in components.
- Server components by default. Add `"use client"` only for state, browser APIs, or animation.
- Tokens live in `app/globals.css` `:root`. Do not duplicate colours or durations elsewhere (GSAP mirror:
  `lib/motion.ts`). Read `DESIGN.md` before changing visuals.
- Content must remain visible without JavaScript and under `prefers-reduced-motion`. Hiding rules are scoped to
  `.js`; never hide content unconditionally.
- Create GSAP animations inside `useGSAP` so they clean up. No stray scroll listeners.
- Animate `transform` and `opacity`. No blur filters on large animated layers.
- Placeholder links must not render as `<a>`; use `isConfiguredUrl` / `isConfiguredEmail` from `lib/utils.ts`.
- Do not add Persona game assets, logos, characters, or screenshots.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e     # needs: pnpm exec playwright install chromium
```
