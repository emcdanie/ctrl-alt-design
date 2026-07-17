import { SKILLS, WORK_ITEMS, slugify, type Skill, type WorkItem } from "@/lib/workLibrary";

/* find-your-fit (spec: specs/find-your-fit, amended 2026-07-17).
 * Deterministic, verifiable matching over her own structured data: JD
 * text -> trigger phrases -> skills -> cases, through the same
 * WORK_ITEMS[].skills arrays that drive the library and the matrix.
 * No generated prose in this module; the mapping is kept and shown so
 * a result is verifiable in under ten seconds. */

export const SKILL_TRIGGERS: Record<Skill, string[]> = {
  "Design Systems": ["design system", "design systems", "component library", "ui library", "pattern library"],
  "Design Tokens": ["token", "tokens", "token architecture", "theming", "theme support"],
  "Design System Governance": ["governance", "contribution model", "adoption", "system health", "drift"],
  "AI-enabled Design": ["ai", "llm", "agent", "copilot", "machine learning", "genai", "claude", "gpt"],
  "Accessibility": ["accessibility", "a11y", "wcag", "inclusive", "screen reader", "contrast"],
  "Component Libraries": ["component", "components", "storybook", "variants", "props"],
  "Figma ⇄ Code": ["figma", "handoff", "design to code", "code connect", "parity", "dev mode"],
  "Product Design": ["product design", "product designer", "end to end", "discovery", "b2b", "saas", "enterprise", "dashboard", "booking"],
  "UX Research": ["research", "usability", "interviews", "testing", "insights"],
};

export interface FitMatch {
  matchedSkills: { skill: Skill; phrases: string[] }[];
  cases: (WorkItem & { score: number; matched: Skill[] })[];
}

export function matchFit(jd: string): FitMatch {
  const text = jd.toLowerCase();
  const matchedSkills: { skill: Skill; phrases: string[] }[] = [];
  for (const skill of SKILLS) {
    const phrases = SKILL_TRIGGERS[skill].filter((p) => text.includes(p));
    if (phrases.length) matchedSkills.push({ skill, phrases });
  }
  const skillSet = new Set(matchedSkills.map((m) => m.skill));
  const cases = WORK_ITEMS.filter((i) => i.medium === "case study")
    .map((i) => {
      const matched = i.skills.filter((s) => skillSet.has(s));
      return { ...i, score: matched.length, matched };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score || (a.rank ?? 99) - (b.rank ?? 99))
    .slice(0, 3);
  return { matchedSkills, cases };
}

export { slugify };
