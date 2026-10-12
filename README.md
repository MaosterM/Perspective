# Portfolio

A cinematic, editorial developer portfolio for a Computer Science undergraduate (Data Science, minor in Finance),
built with Next.js (App Router), React, TypeScript (strict), Tailwind CSS v4 and GSAP + ScrollTrigger.

> **Status: written but not yet built or run.** This project was authored in an environment where the npm
> registry was blocked, so dependencies were never installed. It has not been compiled, linted, type-checked,
> built, visually inspected, or tested in a browser. Run the commands below and expect to fix small issues.
> See "What has and has not been verified".

## Run locally

Requires Node 20.9+ (Node 22 recommended) and pnpm.

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Other commands:

```bash
pnpm lint
pnpm typecheck
pnpm build && pnpm start
pnpm exec playwright install chromium
pnpm test:e2e       # starts the dev server on :3100 and runs tests/e2e
```

## Deploy to Vercel

1. Push the repository to GitHub.
2. In Vercel: **Add New, Project**, import the repo. The Next.js preset is detected automatically; no env vars needed.
3. Deploy.
4. Set `siteUrl` in `data/site.ts` to the production URL and redeploy. This enables canonical metadata and absolute
   sitemap URLs. (Until then, `VERCEL_PROJECT_PRODUCTION_URL` is used when available.)

## Placeholders to replace

All personal content is in `data/`. Anything in `[SQUARE BRACKETS]` is a placeholder. Placeholder URLs and emails are
never rendered as working links; they show as "Not set" until replaced.

| File | What to set |
| --- | --- |
| `data/site.ts` | `name` (currently "Ming"; change it if you want a full name), `siteUrl`, `contact.email`, `contact.github`, `contact.linkedin`, `contact.instagram`, `contact.resume`, `about.personalNote`, optional `about.portrait` |
| `data/projects.ts` | Replace the four placeholder projects with real ones (see below) |
| `data/experience.ts` | Fill the detail groups for **Sync Night** and **XRJam** with real responsibilities and outcomes |
| `data/skills.ts` | Add only tools and skills you can stand behind |
| `data/beyond.ts` | Optional. Leave empty and the section is omitted |

Confirmed facts already in place: Computer Science undergraduate, Data Science specialization, Finance minor; XRJam
(Hackathon, Sponsorship Committee Member, previous experience); Sync Night (Taylor's University event organized by
TRE Club, Marketing Committee Member, current involvement). Nothing else about either role is claimed.

### Adding or changing projects

Edit the `projects` array in `data/projects.ts`. Array order is display order. Set `featured: true` for large panels,
`caseStudy: true` for a `/projects/[slug]` page, supply `image` (put the file in `public/images/`) to replace the
placeholder artwork (the four `artwork-*.webp` files are original abstract images, flagged `isArtwork: true` so the
site labels them "Placeholder artwork"; drop that flag once you use a real screenshot), and delete `isPlaceholder`. Placeholder case studies are `noindex` and excluded from the
sitemap.

## Structure

```
app/                 layout, home page, /projects/[slug], sitemap, robots, icon, Open Graph image
components/
  background/        Atmosphere (global CSS layers), SectionBackdrop (per-section motifs), MatrixRain (code-rain canvas)
  layout/            Navbar, Footer
  motion/            MotionRoot, Intro, AnimatedHeading
  sections/          Hero, Projects(+Explorer), About, Skills, Experience, Beyond, Contact
  ui/                Monogram, ProjectVisual, SectionHeading, Copy, CopyEmailButton, BackToTop
data/                site, projects, experience, skills, beyond (all editable content)
lib/                 utils (helpers), motion (GSAP setup + tokens), seeded (deterministic randomness for backgrounds)
tests/e2e/           Playwright spec
DESIGN.md            design system
```

## Notes

- Nav order follows page order (Projects, About, Experience, Contact), which differs slightly from the order the brief
  listed.
- Motion for React was deliberately not added: CSS and GSAP cover every effect here.
- Fonts (Anton, Instrument Serif, Manrope, JetBrains Mono) load through `next/font/google`, which fetches at build
  time; the build machine needs network access to Google Fonts.
- Versions in `package.json` were set from memory, not looked up. Run `pnpm outdated` after installing.

## What has and has not been verified

Done (in the authoring environment):

- WCAG contrast ratios for the palette were computed (see `DESIGN.md`).
- Source files were checked for TypeScript/TSX syntax errors, and `package.json` for valid JSON.

Animated backgrounds (added later; the package registry was blocked in that session too). The real
`Atmosphere`, `MatrixRain`, `SectionBackdrop`, `Skills`, `Experience` components and the real `globals.css` were
bundled, server-rendered and hydrated in Chromium with Playwright (a standalone harness, not the Next app). In that
harness: there were no hydration or console errors, the code rain paints, animates, tints crimson on request and stays
one still frame under reduced motion, the four project artworks load, every other background layer animates, each section's backdrop stays pinned while the section scrolls, there is no horizontal
overflow at 1440px or 390px, mobile trims the heavy layers, reduced motion settles into the static states described in
`DESIGN.md`, and there were no console errors. The new files also pass `tsc --strict` against stubbed React types.

Not done, because dependencies could not be installed:

- `pnpm install`, `pnpm build`, `pnpm lint`, full type-check
- Running the actual Next app: the scroll-driven slash drift (GSAP `[data-drift]`) and the section "mood" shift were
  not exercised, and the harness mocks the Projects and About section content (their real backdrops are used)
- The Playwright tests in `tests/e2e` (written, never executed; the spec itself type-checks against Playwright types)
- Verification of third-party API details (Next 16, Tailwind v4, `@gsap/react`, `eslint-config-next` 16 flat-config
  imports) against current documentation
- The design reference sites listed in the brief were not consulted
