/* The one skills list (Elleta, 19 Sep 2026, learning build). Work, the
 * /learning library and the skills matrix all read it: a skill added or
 * renamed here moves everywhere at once. */

export const SKILLS = [
  "Design systems",
  "Design tokens",
  "Design system governance",
  "AI-enabled design",
  "Accessibility",
  "Component libraries",
  "Figma ⇄ code",
  "Product design",
  "UX research",
] as const;

export type Skill = (typeof SKILLS)[number];

/** kebab slug for URL params */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[⇄]/g, "to")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
