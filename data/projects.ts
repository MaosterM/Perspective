/**
 * Project content.
 *
 * - Add, remove, or reorder projects by editing the `projects` array. Array order is display order.
 * - `featured: true` projects get large editorial panels; the rest appear as compact rows.
 * - `caseStudy: true` generates /projects/[slug].
 * - Values wrapped in [SQUARE BRACKETS] are placeholders and are rendered as clearly marked
 *   "to do" text. Nothing here describes real work yet.
 * - Remove `isPlaceholder` (and replace the content) once a project is real. Placeholder
 *   projects are excluded from the sitemap and marked noindex.
 */

export type ProjectCategory =
  | "software-engineering"
  | "web-development"
  | "data-science"
  | "analytics"
  | "finance-quant"
  | "creative-technology"
  | "academic-collab";

export const categoryLabels: Record<ProjectCategory, string> = {
  "software-engineering": "Software Engineering",
  "web-development": "Web Development",
  "data-science": "Data Science",
  analytics: "Analytics",
  "finance-quant": "Finance & Quantitative Exploration",
  "creative-technology": "Creative Technology",
  "academic-collab": "Academic & Collaborative",
};

/** Abstract placeholder artwork used when no real image is supplied. */
export type VisualVariant = "lattice" | "orbit" | "bars" | "slash";

export interface ProjectImage {
  /** Path under /public, e.g. "/images/my-project.png". */
  src: string;
  /** Meaningful alternative text describing the screenshot. */
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  category: ProjectCategory;
  technologies: string[];
  image?: ProjectImage;
  /** Abstract artwork shown when `image` is missing. */
  visual: VisualVariant;

  /** Case-study fields. */
  overview: string;
  problem: string;
  goalsAndConstraints: string[];
  contribution: string;
  approach: string;
  technicalDecisions: string[];
  challenges: { challenge: string; solution: string }[];
  outcome: string;

  github?: string;
  demo?: string;

  featured?: boolean;
  caseStudy?: boolean;
  isPlaceholder?: boolean;
}

export const projects: Project[] = [
  {
    slug: "web-project-placeholder",
    title: "Your Web Project",
    summary: "[Add a one or two sentence description of a software engineering or web development project.]",
    category: "web-development",
    technologies: [],
    visual: "lattice",
    overview: "[Add a short overview: what the project is and who it is for.]",
    problem: "[Add the problem this project set out to solve.]",
    goalsAndConstraints: [
      "[Add a goal.]",
      "[Add a constraint such as time, team size, or tooling.]",
    ],
    contribution: "[Add exactly what you built or decided. Be specific about your part.]",
    approach: "[Add how the project was structured and how work was organised.]",
    technicalDecisions: ["[Add an important technical decision and why it was made.]"],
    challenges: [
      { challenge: "[Add a real challenge you hit.]", solution: "[Add how it was resolved.]" },
    ],
    outcome: "[Add the real outcome or what you learned. Only include numbers you can back up.]",
    featured: true,
    caseStudy: true,
    isPlaceholder: true,
  },
  {
    slug: "data-finance-placeholder",
    title: "Your Data & Finance Project",
    summary: "[Add a one or two sentence description of a data science, analytics, or finance project.]",
    category: "finance-quant",
    technologies: [],
    visual: "bars",
    overview: "[Add a short overview: the question asked and the data used.]",
    problem: "[Add the question or decision the analysis supports.]",
    goalsAndConstraints: [
      "[Add a goal.]",
      "[Add a constraint such as data quality, size, or time.]",
    ],
    contribution: "[Add exactly which parts of the analysis or pipeline you did.]",
    approach: "[Add the method: data preparation, modelling, and evaluation.]",
    technicalDecisions: ["[Add a modelling or tooling decision and why it was made.]"],
    challenges: [
      { challenge: "[Add a real challenge you hit.]", solution: "[Add how it was resolved.]" },
    ],
    outcome: "[Add the real result and what you learned. Only include figures you can back up.]",
    featured: true,
    caseStudy: true,
    isPlaceholder: true,
  },
  {
    slug: "creative-tech-placeholder",
    title: "Your Creative Technology Experiment",
    summary: "[Add a one or two sentence description of an interactive or experimental piece.]",
    category: "creative-technology",
    technologies: [],
    visual: "orbit",
    overview: "[Add a short overview of the experiment and what it explores.]",
    problem: "[Add the idea or question behind it.]",
    goalsAndConstraints: ["[Add a goal.]", "[Add a constraint.]"],
    contribution: "[Add exactly what you made.]",
    approach: "[Add how you built it.]",
    technicalDecisions: ["[Add a technical decision and why it was made.]"],
    challenges: [
      { challenge: "[Add a real challenge you hit.]", solution: "[Add how it was resolved.]" },
    ],
    outcome: "[Add what came of it and what you learned.]",
    featured: true,
    caseStudy: true,
    isPlaceholder: true,
  },
  {
    slug: "academic-placeholder",
    title: "Your Academic or Team Project",
    summary: "[Add a one or two sentence description of a university or collaborative project.]",
    category: "academic-collab",
    technologies: [],
    visual: "slash",
    overview: "[Add a short overview, including the course or team context.]",
    problem: "[Add the brief or problem statement.]",
    goalsAndConstraints: ["[Add a goal.]", "[Add a constraint.]"],
    contribution: "[Add your role within the team and what you delivered.]",
    approach: "[Add how the team worked.]",
    technicalDecisions: ["[Add a decision and why it was made.]"],
    challenges: [
      { challenge: "[Add a real challenge you hit.]", solution: "[Add how it was resolved.]" },
    ],
    outcome: "[Add the real outcome and what you learned.]",
    caseStudy: true,
    isPlaceholder: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
