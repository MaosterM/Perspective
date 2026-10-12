"use client";

import { useMemo, useState, type PointerEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { categoryLabels, type Project, type ProjectCategory } from "@/data/projects";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Copy } from "@/components/ui/Copy";
import { cn, isConfiguredUrl } from "@/lib/utils";

type Filter = ProjectCategory | "all";

/** Different composition per featured slot so the gallery never reads as a wall of identical cards. */
const layouts = [
  { figure: "lg:col-span-8", text: "lg:col-span-4 lg:self-end" },
  { figure: "lg:col-span-7 lg:col-start-6 lg:row-start-1", text: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:self-center" },
  { figure: "lg:col-span-6 lg:col-start-2", text: "lg:col-span-4 lg:col-start-9 lg:mt-16 lg:self-start" },
] as const;

const pad = (n: number) => String(n).padStart(2, "0");

/** Cursor-following highlight: mouse only. Touch and keyboard users lose nothing essential. */
function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const spot = event.currentTarget.querySelector<HTMLElement>(".spot");
  if (!spot) return;
  const rect = spot.getBoundingClientRect();
  spot.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  spot.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

function ExternalLinks({ project }: { project: Project }) {
  const github = isConfiguredUrl(project.github) ? project.github : null;
  const demo = isConfiguredUrl(project.demo) ? project.demo : null;
  if (!github && !demo) return null;

  return (
    <div className="above-stretched mt-5 flex flex-wrap gap-x-5 gap-y-2">
      {github ? (
        <a href={github} target="_blank" rel="noopener noreferrer" className="t-label u-link inline-flex min-h-9 items-center text-ink">
          Source<span className="sr-only">, {project.title} on GitHub (opens in a new tab)</span>
        </a>
      ) : null}
      {demo ? (
        <a href={demo} target="_blank" rel="noopener noreferrer" className="t-label u-link inline-flex min-h-9 items-center text-ink">
          Live demo<span className="sr-only">, {project.title} (opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

function ProjectTitle({ project, className }: { project: Project; className?: string }) {
  if (project.caseStudy) {
    return (
      <h3 className={className}>
        <Link href={`/projects/${project.slug}`} className="stretched outline-offset-4">
          {project.title}
        </Link>
      </h3>
    );
  }
  return <h3 className={className}>{project.title}</h3>;
}

function FeaturedPanel({ project, index, revealNow }: { project: Project; index: number; revealNow: boolean }) {
  const layout = layouts[index % layouts.length]!;

  return (
    <article
      className="project-panel relative grid grid-cols-12 gap-x-8 gap-y-6"
      onPointerMove={trackPointer}
      data-testid="project-featured"
    >
      <figure
        data-reveal="mask"
        className={cn("spot col-span-12 m-0 aspect-[4/3] sm:aspect-[16/11]", layout.figure, revealNow && "is-in")}
      >
        <div data-parallax className="parallax-img">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="project-visual h-full w-full object-cover"
            />
          ) : (
            <ProjectVisual variant={project.visual} id={project.slug} />
          )}
        </div>
        {!project.image || project.image.isArtwork ? (
          <figcaption className="t-label absolute left-3 top-3 z-[2] bg-bg/85 px-2.5 py-1.5 text-ink">
            {project.image ? "Placeholder artwork" : "Placeholder visual"}
          </figcaption>
        ) : null}
      </figure>

      <div data-reveal className={cn("col-span-12 flex flex-col", layout.text, revealNow && "is-in")}>
        <span className="num-outline text-6xl sm:text-7xl" aria-hidden="true">
          {pad(index + 1)}
        </span>
        <p className="tag mt-4">{categoryLabels[project.category]}</p>
        <ProjectTitle project={project} className="t-h3 mt-3" />
        <Copy text={project.summary} className="mt-4 text-mute" />

        {project.technologies.length > 0 ? (
          <ul className="t-label mt-5 flex flex-wrap gap-x-4 gap-y-1" aria-label="Technologies">
            {project.technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        ) : null}

        <ExternalLinks project={project} />

        {project.caseStudy ? (
          <p className="t-label mt-6 inline-flex items-center gap-2 text-ink" aria-hidden="true">
            View case study <ArrowUpRight size={14} />
          </p>
        ) : null}
      </div>
    </article>
  );
}

function ProjectRow({ project, number, revealNow }: { project: Project; number: number; revealNow: boolean }) {
  return (
    <li
      data-reveal
      data-testid="project-row"
      className={cn(
        "project-panel row-link relative grid grid-cols-12 items-center gap-x-4 gap-y-2 border-t border-line px-1 py-6",
        revealNow && "is-in",
      )}
    >
      <span className="num-outline col-span-2 text-4xl sm:col-span-1" aria-hidden="true">
        {pad(number)}
      </span>
      <div className="col-span-10 sm:col-span-6">
        <ProjectTitle project={project} className="t-h3 !text-[length:clamp(1.25rem,1rem+1vw,1.9rem)]" />
        <Copy text={project.summary} className="mt-2 text-[length:var(--fs-small)] text-mute" />
      </div>
      <p className="tag col-span-12 sm:col-span-3">{categoryLabels[project.category]}</p>
      <span className="col-span-12 flex justify-end sm:col-span-2" aria-hidden="true">
        {project.caseStudy ? <ArrowUpRight size={20} /> : null}
      </span>
      <div className="col-span-12">
        <ExternalLinks project={project} />
      </div>
    </li>
  );
}

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  /** After the first interaction, new nodes are revealed immediately instead of waiting for scroll. */
  const [touched, setTouched] = useState(false);

  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category))), [projects]);
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const featured = visible.filter((p) => p.featured);
  const rest = visible.filter((p) => !p.featured);

  const choose = (next: Filter) => {
    setFilter(next);
    setTouched(true);
  };

  return (
    <div>
      {categories.length > 1 ? (
        <div role="group" aria-label="Filter projects by category" className="mb-14 flex flex-wrap gap-2" data-reveal="fade">
          <button type="button" className="chip" aria-pressed={filter === "all"} onClick={() => choose("all")}>
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={filter === category}
              onClick={() => choose(category)}
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "all" ? "" : ` in ${categoryLabels[filter]}`}
      </p>

      <div key={filter} className={cn(touched && "filter-swap")} data-testid="project-list">
        {featured.length > 0 ? (
          <div className="flex flex-col gap-24 md:gap-32">
            {featured.map((project, i) => (
              <FeaturedPanel key={project.slug} project={project} index={i} revealNow={touched} />
            ))}
          </div>
        ) : null}

        {rest.length > 0 ? (
          <div className={cn(featured.length > 0 && "mt-24 md:mt-32")}>
            {featured.length > 0 ? (
              <p className="t-label mb-6" data-reveal="fade">
                More work
              </p>
            ) : null}
            <ul className="m-0 list-none border-b border-line p-0">
              {rest.map((project, i) => (
                <ProjectRow key={project.slug} project={project} number={featured.length + i + 1} revealNow={touched} />
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
