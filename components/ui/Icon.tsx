import { ArrowLeft, ArrowRight, ArrowUp, ChatBubbleXmark, Check, Copy, Cube, DotsGrid3x3, Enlarge, Group, HalfMoon, Label, Linkedin, Mail, NavArrowDown, OpenNewWindow, Page, Presentation, Search, SunLight, Xmark } from "iconoir-react";

/* The glyphs the site uses, by name (named imports, 4 Oct 2026): a
   namespace import with a computed key shipped all of Iconoir, about
   375 KB gzipped, on every page. Add a glyph here when a page needs it. */
const ICONS = { ArrowLeft, ArrowRight, ArrowUp, ChatBubbleXmark, Check, Copy, Cube, DotsGrid3x3, Enlarge, Group, HalfMoon, Label, Linkedin, Mail, NavArrowDown, OpenNewWindow, Page, Presentation, Search, SunLight, Xmark } as const;

export type IconName = keyof typeof ICONS;

const SIZE = {
  sm: "var(--icon-sm)",
  md: "var(--icon-md)",
  lg: "var(--icon-lg)",
} as const;

/**
 * The only way BELLA renders an icon. Iconoir glyphs, tokenized:
 * size from --icon-sm/md/lg, stroke from --icon-stroke, and ALWAYS
 * currentColor — icons inherit the themed ink/accent of their text, so
 * dark mode recolours them for free (no hardcoded icon colours, per the
 * conformance contract). Decorative by default (aria-hidden); pass
 * `label` to make it meaningful (role="img" + aria-label).
 *
 * NOTE: size/stroke ride on `style`, not SVG presentation attributes —
 * width="var(--icon-sm)" would NOT resolve (attributes don't evaluate
 * CSS custom properties; the style property does).
 */
export function Icon({
  name,
  size = "md",
  label,
  strokeWidth,
  className,
  style,
}: {
  name: IconName;
  size?: keyof typeof SIZE;
  label?: string;
  /** override only when a glyph genuinely needs it; token otherwise */
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Glyph = ICONS[name] as React.ComponentType<Record<string, unknown>>;
  return (
    <Glyph
      color="currentColor"
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      focusable="false"
      className={className}
      style={{
        width: SIZE[size],
        height: SIZE[size],
        strokeWidth: strokeWidth ?? "var(--icon-stroke)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
