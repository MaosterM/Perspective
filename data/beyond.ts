/**
 * "Beyond the screen": interests, experiments, learning goals, current explorations.
 *
 * Intentionally empty. The section renders only when this array has entries, so
 * nothing is invented. To enable it, add real entries, e.g.:
 *
 *   { id: "reading", title: "Currently reading", body: "…" }
 *
 * To remove the section entirely, leave the array empty.
 */

export interface BeyondEntry {
  id: string;
  title: string;
  body: string;
}

export const beyondEntries: BeyondEntry[] = [];
