/**
 * Central, editable site configuration.
 *
 * Anything wrapped in [SQUARE BRACKETS] is a placeholder. Placeholder URLs and
 * emails are never rendered as working links; they appear as clearly marked
 * "set in data/site.ts" items until replaced with real values.
 */

export interface NavItem {
  label: string;
  /** Section id on the home page. */
  id: string;
}

export const site = {
  /** Shown in the hero, contact section and footer. */
  name: "Ming",
  /** Used for the monogram only while `name` is still a [placeholder]. */
  monogramFallback: "YN",

  title: "Computer Science Undergraduate",
  specialization: "Data Science",
  minor: "Finance",

  /** Production URL, e.g. "https://yourname.dev". Enables canonical metadata and sitemap URLs. */
  siteUrl: "[YOUR SITE URL]",

  metaDescription:
    "Computer Science undergraduate specializing in Data Science, with a minor in Finance. Software, data, and finance explored through creative technology.",

  contact: {
    email: "[YOUR EMAIL]",
    github: "[YOUR GITHUB URL]",
    linkedin: "[YOUR LINKEDIN URL]",
    instagram: "[YOUR INSTAGRAM URL]",
    resume: "[YOUR RESUME URL]",
  },

  hero: {
    eyebrow: "Computer Science · Data Science · Finance",
    /** Plain display lines, then one emphasised (serif, italic) closing line. */
    headlineLines: ["Turning", "data into"],
    headlineAccent: "perspective.",
    support:
      "Building thoughtful digital experiences, exploring meaningful insights, and connecting technology with the real world.",
    primaryCta: "Explore my work",
    secondaryCta: "Get in touch",
  },

  /** Computer Science undergraduate specializing in Data Science with a Finance minor. */
  positioning:
    "Computer Science undergraduate specializing in Data Science, with a minor in Finance. Exploring how technology, analytical thinking, and creative problem-solving can turn complex ideas into useful digital experiences.",

  about: {
    headline: [
      { text: "Curious by nature." },
      { text: "Analytical by training.", em: true },
    ],
    facts: [
      { label: "Degree", value: "Bachelor's in Computer Science" },
      { label: "Specialization", value: "Data Science" },
      { label: "Minor", value: "Finance" },
    ],
    paragraphs: [
      "I'm pursuing a Bachelor's degree in Computer Science, specializing in Data Science, with a minor in Finance.",
      "The three overlap more than they first appear to. Software is how an idea becomes something people can use. Data is how that idea gets tested against the real world. Finance contributes a vocabulary for value, risk, and trade-offs.",
    ],
    /** Replace with a genuine personal introduction. Shown as a marked placeholder until then. */
    personalNote:
      "[Add a short, specific personal introduction: what pulled you toward this combination of subjects, and what you want to build next.]",
    /** Optional portrait. Leave undefined to show the abstract diagram instead. */
    portrait: undefined as undefined | { src: string; alt: string; width: number; height: number },
  },

  contactCopy: {
    headline: [
      { text: "Have something" },
      { text: "interesting", em: true },
      { text: "in mind?" },
    ],
    support:
      "I'm open to meaningful conversations, interesting projects, and opportunities to learn and collaborate.",
  },

  /** Order here is the order in the navbar. Ids must match section ids on the home page. */
  nav: [
    { label: "Projects", id: "projects" },
    { label: "About", id: "about" },
    { label: "Experience", id: "experience" },
    { label: "Contact", id: "contact" },
  ] satisfies NavItem[],

  /**
   * Maps every home-page section id to the nav item it should highlight.
   * `null` means no nav item is active (the hero).
   */
  sectionNav: {
    top: null,
    projects: "projects",
    about: "about",
    skills: "about",
    experience: "experience",
    beyond: "experience",
    contact: "contact",
  } as Record<string, string | null>,
};

export type Site = typeof site;
