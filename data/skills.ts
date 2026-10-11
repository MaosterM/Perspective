/**
 * Skills and technical interests, grouped by discipline.
 *
 * Only list tools and skills you can genuinely stand behind. There are no
 * percentages or proficiency bars on purpose. `basis` records a confirmed
 * academic connection; leave it out where none applies.
 */

export interface SkillGroup {
  id: string;
  title: string;
  /** Confirmed academic connection, if any. */
  basis?: string;
  items: string[];
}

export const skillGroups: SkillGroup[] = [
  { id: "software", title: "Programming & Software Engineering", basis: "Bachelor's in Computer Science", items: [] },
  { id: "frontend", title: "Frontend & Web Development", items: [] },
  { id: "data", title: "Data Science & Analytics", basis: "Specialization", items: [] },
  { id: "databases", title: "Databases & Data Engineering", items: [] },
  { id: "finance", title: "Finance & Quantitative Analysis", basis: "Minor", items: [] },
  { id: "collab", title: "Design, Communication & Collaboration", items: [] },
];
