import { AnimatedHeading, type HeadingLine } from "@/components/motion/AnimatedHeading";

interface SectionHeadingProps {
  index: string;
  label: string;
  lines: HeadingLine[];
  /** Id of the <h2>, referenced by the section's aria-labelledby. */
  id: string;
  className?: string;
}

/** Numbered editorial section opener: "01 / PROJECTS" plus an art-directed headline. */
export function SectionHeading({ index, label, lines, id, className }: SectionHeadingProps) {
  return (
    <header className={className}>
      <p className="t-label mb-6 flex items-center gap-3" data-reveal="fade">
        <span className="text-crimson-text">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-line-strong" />
        <span>{label}</span>
      </p>
      <AnimatedHeading as="h2" id={id} lines={lines} className="t-display t-h2" />
    </header>
  );
}
