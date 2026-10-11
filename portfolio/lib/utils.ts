import { site } from "@/data/site";

/** Join class names, ignoring falsy values. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * A value is a placeholder when it is empty or wrapped in square brackets,
 * e.g. "[YOUR EMAIL]" or "[Add a short overview]".
 */
export function isPlaceholder(value?: string | null): boolean {
  if (!value) return true;
  const v = value.trim();
  return v === "" || /^\[.*\]$/.test(v);
}

/** True only for a real http(s) URL. Placeholders never count as links. */
export function isConfiguredUrl(value?: string | null): value is string {
  if (isPlaceholder(value)) return false;
  try {
    const url = new URL(value as string);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isConfiguredEmail(value?: string | null): value is string {
  if (isPlaceholder(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((value as string).trim());
}

/** Two-letter monogram from the display name; falls back to the configured placeholder. */
export function getInitials(name: string, fallback: string): string {
  if (isPlaceholder(name)) return fallback;
  const letters = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase());
  if (letters.length === 0) return fallback;
  if (letters.length === 1) return letters[0]!;
  return letters[0]! + letters[letters.length - 1]!;
}

/** Name for metadata. Never leaks "[YOUR NAME]" into <title>. */
export function ownerName(): string {
  return isPlaceholder(site.name) ? "Portfolio" : site.name;
}

/** Absolute site URL for metadata, sitemap and robots. */
export function getSiteUrl(): string {
  if (isConfiguredUrl(site.siteUrl)) return site.siteUrl.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}
