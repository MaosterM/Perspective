import { Fragment, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

export interface HeadingLine {
  text: string;
  /** Render this line in the expressive serif italic. */
  em?: boolean;
  className?: string;
}

interface AnimatedHeadingProps {
  as?: "h1" | "h2" | "h3";
  id?: string;
  lines: HeadingLine[];
  className?: string;
  /** Hero headings are released by the intro instead of by scroll. */
  hero?: boolean;
}

/**
 * Word-level mask reveal. Words are real inline text (selectable, readable by
 * assistive tech); the animation is pure CSS driven by the `is-in` class that
 * MotionRoot adds on scroll, or by html.hero-in for the hero.
 */
export function AnimatedHeading({ as: Tag = "h2", id, lines, className, hero = false }: AnimatedHeadingProps) {
  let index = 0;

  return (
    <Tag id={id} className={cn(className, hero && "hero-words")} {...(hero ? {} : { "data-reveal": "words" })}>
      {lines.map((line, lineIndex) => {
        const words = line.text.split(" ");
        return (
          <span key={lineIndex} className={cn("block", line.em && "t-em", line.className)}>
            {words.map((word, wordIndex) => {
              const i = index++;
              return (
                <Fragment key={wordIndex}>
                  <span className="w">
                    <span className="w-i" style={{ "--i": i } as CSSProperties}>
                      {word}
                    </span>
                  </span>
                  {wordIndex < words.length - 1 ? " " : null}
                </Fragment>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
