import { cn } from "@/lib/utils";

/** Small skewed monogram mark. The letters come from site config. */
export function Monogram({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex h-9 min-w-9 items-center justify-center px-2 font-display text-lg leading-none tracking-wide text-ink",
        className,
      )}
    >
      <span aria-hidden="true" className="absolute inset-0 -skew-x-12 border border-line-strong bg-surface" />
      <span aria-hidden="true" className="absolute -bottom-px left-1 right-1 h-[2px] -skew-x-[30deg] bg-crimson" />
      <span className="relative">{initials}</span>
    </span>
  );
}
