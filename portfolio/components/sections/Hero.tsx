import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { AnimatedHeading, type HeadingLine } from "@/components/motion/AnimatedHeading";
import { DataField } from "@/components/background/DataField";
import { HeroStreaks } from "@/components/background/SectionBackdrop";
import type { CSSProperties } from "react";

const item = (i: number): CSSProperties => ({ "--i": i }) as CSSProperties;
const depth = (d: number): CSSProperties => ({ "--depth": d }) as CSSProperties;

/** Abstract moon-and-orbit motif: original artwork, two parallax layers. */
function HeroArt() {
  return (
    <div className="hero-art relative mx-auto mb-8 aspect-square w-44 sm:w-56 lg:absolute lg:-right-6 lg:top-1/2 lg:mx-0 lg:mb-0 lg:w-[min(44vw,40rem)] lg:-translate-y-1/2" aria-hidden="true">
      <div className="hero-item absolute inset-0" style={item(2)}>
        <svg data-depth="" style={depth(10)} viewBox="0 0 600 600" className="absolute inset-0 h-full w-full">
          <g className="orbit-spin">
            <ellipse cx="300" cy="300" rx="290" ry="110" transform="rotate(-24 300 300)" fill="none" className="stroke-sky" strokeWidth="1" opacity="0.35" />
            <circle cx="548" cy="214" r="7" className="fill-crimson" />
          </g>
          <g className="orbit-spin orbit-spin-rev">
            <circle cx="300" cy="300" r="236" fill="none" className="stroke-sky" strokeWidth="1" strokeDasharray="2 10" opacity="0.5" />
            <circle cx="64" cy="300" r="4" className="fill-sky" />
          </g>
        </svg>
        <svg data-depth="" style={depth(24)} viewBox="0 0 600 600" className="absolute inset-0 h-full w-full">
          <defs>
            <radialGradient id="hero-moon" cx="35%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#d9ecff" />
              <stop offset="55%" stopColor="#91caff" />
              <stop offset="100%" stopColor="#3a5f94" />
            </radialGradient>
            <mask id="hero-moon-mask">
              <rect width="600" height="600" fill="white" />
              <circle cx="352" cy="276" r="132" fill="black" />
            </mask>
          </defs>
          <circle cx="300" cy="300" r="136" fill="url(#hero-moon)" mask="url(#hero-moon-mask)" opacity="0.92" />
        </svg>
      </div>
    </div>
  );
}

export function Hero() {
  const lines: HeadingLine[] = [
    ...site.hero.headlineLines.map((text) => ({ text })),
    { text: site.hero.headlineAccent, em: true, className: "text-[0.9em] leading-[1.02]" },
  ];

  return (
    <section id="top" data-hero data-atmos="blue" aria-label="Introduction" className="hero">
      <DataField tone="cyan" className="pointer-events-none absolute inset-0 -z-[1] h-full w-full opacity-80" />
      <div className="hero-grid" aria-hidden="true" />
      <HeroStreaks />

      <div className="wrap relative flex min-h-[100svh] flex-col justify-between gap-10 pb-10 pt-28 sm:pt-32">
        <div className="hero-item flex flex-wrap items-start justify-between gap-x-10 gap-y-3" style={item(0)}>
          <p className="t-label max-w-[22rem] text-sky">{site.hero.eyebrow}</p>
          <p className="t-label sm:text-right">
            <span className="text-ink">{site.name}</span>
            <br />
            {site.title}
          </p>
        </div>

        <div className="relative">
          <HeroArt />
          <AnimatedHeading
            as="h1"
            hero
            lines={lines}
            className="t-display relative z-10 text-[length:var(--fs-hero)]"
          />
          <span className="hero-bar relative z-10" aria-hidden="true" />
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-12">
          <a
            href="#projects"
            className="hero-item scroll-cue t-label hidden w-fit lg:col-span-3 lg:inline-flex"
            style={item(5)}
            aria-label="Scroll to projects"
          >
            <span className="scroll-cue-line" aria-hidden="true" />
            Scroll
          </a>

          <div className="hero-item lg:col-span-5 lg:col-start-7" style={item(4)}>
            <p className="t-lead prose-measure text-mute">{site.hero.support}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/#projects" className="btn btn-primary">
                <span>{site.hero.primaryCta}</span>
                <ArrowDown size={16} aria-hidden="true" />
              </Link>
              <Link href="/#contact" className="btn btn-ghost">
                <span>{site.hero.secondaryCta}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
