/* The one skills list (Elleta, 19 Sep 2026, learning build). Work, the
 * /learning library and the skills matrix all read it: a skill added or
 * renamed here moves everywhere at once. */

export const SKILLS = [
  "Design Systems",
  "Design Tokens",
  "Design System Governance",
  "AI-enabled Design",
  "Accessibility",
  "Component Libraries",
  "Figma ⇄ Code",
  "Product Design",
  "UX Research",
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
