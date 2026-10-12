import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { categoryLabels, getProject, projects, type Project } from "@/data/projects";
import { AnimatedHeading } from "@/components/motion/AnimatedHeading";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { Copy } from "@/components/ui/Copy";
import { isConfiguredUrl } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.filter((p) => p.caseStudy).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.isPlaceholder ? "Case study template." : project.summary,
    // Template pages must not be indexed as if they were real work.
    ...(project.isPlaceholder ? { robots: { index: false, follow: false } } : {}),
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-10 lg:grid-cols-12 lg:gap-8" data-reveal>
      <h2 className="t-label text-ink lg:col-span-3">{title}</h2>
      <div className="prose-measure space-y-4 text-mute lg:col-span-9">{children}</div>
    </section>
  );
}

function Links({ project }: { project: Project }) {
  const github = isConfiguredUrl(project.github) ? project.github : null;
  const demo = isConfiguredUrl(project.demo) ? project.demo : null;
  if (!github && !demo) {
    return <p className="ph">Add a repository and live demo URL in data/projects.ts. Links appear here once they are real.</p>;
  }
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {github ? (
        <a href={github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
          <span>Repository</span>
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}
      {demo ? (
        <a href={demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          <span>Live demo</span>
          <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || !project.caseStudy) notFound();

  const caseStudies = projects.filter((p) => p.caseStudy);
  const position = caseStudies.findIndex((p) => p.slug === project.slug);
  const prev = position > 0 ? caseStudies[position - 1] : undefined;
  const next = position < caseStudies.length - 1 ? caseStudies[position + 1] : undefined;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <article className="wrap pb-24 pt-32 sm:pt-40">
        <Link href="/#projects" className="t-label u-link mb-10 inline-flex min-h-11 items-center gap-2 text-ink">
          <ArrowLeft size={14} aria-hidden="true" />
          All projects
        </Link>

        <header>
          <p className="tag">{categoryLabels[project.category]}</p>
          <AnimatedHeading
            as="h1"
            lines={[{ text: project.title }]}
            className="t-display mt-5 max-w-5xl text-[length:var(--fs-h2)]"
          />
          {project.isPlaceholder ? (
            <p className="ph mt-8 max-w-2xl">
              This is a case-study template with placeholder content. Replace it in data/projects.ts. Nothing on this
              page describes real work yet.
            </p>
          ) : (
            <Copy text={project.summary} className="t-lead prose-measure mt-8 text-mute" />
          )}
        </header>

        <figure className="spot relative mt-14 aspect-[16/9] w-full" data-reveal="mask">
          {project.image ? (
            <Image
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              priority
              sizes="(min-width: 1440px) 1344px, 100vw"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <ProjectVisual variant={project.visual} id={`${project.slug}-hero`} />
              <figcaption className="t-label absolute left-3 top-3 z-[2] bg-bg/85 px-2.5 py-1.5 text-ink">
                Placeholder visual
              </figcaption>
            </>
          )}
        </figure>

        <div className="mt-6">
          <Section title="Technologies">
            {project.technologies.length > 0 ? (
              <ul className="t-label flex flex-wrap gap-x-5 gap-y-2">
                {project.technologies.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            ) : (
              <p className="ph">Add the technologies you actually used.</p>
            )}
          </Section>

          <Section title="Overview">
            <Copy text={project.overview} />
          </Section>
          <Section title="Problem">
            <Copy text={project.problem} />
          </Section>
          <Section title="Goals & constraints">
            <ul className="space-y-3">
              {project.goalsAndConstraints.map((item) => (
                <Copy key={item} as="li" text={item} className="list-disc pl-1 ml-4" />
              ))}
            </ul>
          </Section>
          <Section title="My contribution">
            <Copy text={project.contribution} />
          </Section>
          <Section title="Architecture & process">
            <Copy text={project.approach} />
          </Section>
          <Section title="Technical decisions">
            <ul className="space-y-3">
              {project.technicalDecisions.map((item) => (
                <Copy key={item} as="li" text={item} className="list-disc pl-1 ml-4" />
              ))}
            </ul>
          </Section>
          <Section title="Challenges & solutions">
            <dl className="space-y-6">
              {project.challenges.map((c) => (
                <div key={c.challenge}>
                  <dt className="text-ink">
                    <Copy text={c.challenge} />
                  </dt>
                  <dd className="m-0 mt-2">
                    <Copy text={c.solution} />
                  </dd>
                </div>
              ))}
            </dl>
          </Section>
          <Section title="Results & lessons">
            <Copy text={project.outcome} />
          </Section>
          <Section title="Links">
            <Links project={project} />
          </Section>
        </div>

        <nav aria-label="More projects" className="mt-16 grid gap-6 border-t border-line pt-10 sm:grid-cols-2">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="group flex flex-col gap-2">
              <span className="t-label inline-flex items-center gap-2">
                <ArrowLeft size={14} aria-hidden="true" /> Previous
              </span>
              <span className="t-h3 u-link w-fit">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="group flex flex-col gap-2 sm:items-end sm:text-right">
              <span className="t-label inline-flex items-center gap-2">
                Next <ArrowRight size={14} aria-hidden="true" />
              </span>
              <span className="t-h3 u-link w-fit">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>
    </main>
  );
}
