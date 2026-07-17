import type { CSSProperties, ReactNode } from "react";

/**
 * Renders inline **bold** markers in a string as <strong> elements.
 * Single implementation for the pattern previously duplicated as
 * RichBody (case-study page) and BoldLead (ExperienceCard).
 */
export function BoldText({
  text,
  strongClassName,
  strongStyle,
}: {
  text: string;
  strongClassName?: string;
  strongStyle?: CSSProperties;
}): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className={strongClassName} style={strongStyle}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
