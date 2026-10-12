import { cn, isPlaceholder } from "@/lib/utils";

interface CopyProps {
  text: string;
  className?: string;
  as?: "p" | "span" | "li" | "div";
}

/**
 * Renders copy from the data files. Bracketed placeholders such as
 * "[Add a short overview]" are shown as clearly marked dashed "to do" blocks
 * (brackets stripped) so unfinished content can never pass as real content.
 */
export function Copy({ text, className, as: Tag = "p" }: CopyProps) {
  if (isPlaceholder(text)) {
    const label = text.trim().replace(/^\[|\]$/g, "") || "Add content in the data files.";
    return <Tag className="ph">{label}</Tag>;
  }
  return <Tag className={cn(className)}>{text}</Tag>;
}
