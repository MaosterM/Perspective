/**
 * University experience.
 *
 * The role, event, context, and status below are the confirmed facts. Detail
 * groups start empty: the `hint` is shown as a clearly marked placeholder until
 * real items are added. Do not add sponsor names, amounts, attendance figures,
 * engagement metrics, or results unless they are real and verifiable.
 */

export interface ExperienceDetail {
  label: string;
  items: string[];
  /** Shown as a placeholder while `items` is empty. */
  hint: string;
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  /** Short factual context line. */
  context: string;
  status: "current" | "previous";
  statusLabel: string;
  details: ExperienceDetail[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "sync-night",
    organization: "Sync Night",
    role: "Marketing Committee Member",
    context: "Taylor's University event organized by TRE Club",
    status: "current",
    statusLabel: "Current involvement",
    details: [
      { label: "Marketing responsibilities", items: [], hint: "Add what you are responsible for." },
      { label: "Campaign contributions", items: [], hint: "Add campaigns you contributed to." },
      { label: "Content", items: [], hint: "Add content you created or helped produce." },
      { label: "Promotional activities", items: [], hint: "Add promotional work you carried out." },
      { label: "Outcomes", items: [], hint: "Add real outcomes only. No invented metrics." },
    ],
  },
  {
    id: "xrjam",
    organization: "XRJam",
    role: "Sponsorship Committee Member",
    context: "Hackathon",
    status: "previous",
    statusLabel: "Previous experience",
    details: [
      { label: "Responsibilities", items: [], hint: "Add what you were responsible for." },
      { label: "Contributions", items: [], hint: "Add what you contributed." },
      { label: "Deliverables", items: [], hint: "Add what you produced or delivered." },
      { label: "Collaboration", items: [], hint: "Add who you worked with and how." },
      { label: "Outcomes", items: [], hint: "Add real outcomes only. No invented figures." },
    ],
  },
];
