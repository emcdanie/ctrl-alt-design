/* Testimonials on /about, in order. Quotes are copied verbatim from
   LinkedIn recommendations (exact substrings; "…" marks a cut between
   sentences). Never reword or fix them. `href` is each person's
   LinkedIn profile: TODO until Elleta sends the URLs; without it the
   name renders as plain text, never a dead link. */
export type Testimonial = {
  quote: string;
  /** the one key phrase set in bold: an exact substring of `quote` */
  bold: string;
  name: string;
  role: string;
  company?: string;
  href?: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Straight up: Elleta is awesome. … She's now with us on the bleeding edge of AI & design systems, embracing new tools and ways of working. … Any team would be lucky to have Elleta join their crew.",
    bold: "bleeding edge of AI & design systems",
    name: "Brad Frost",
    role: "Author of Atomic Design",
    company: "Brad Frost Web",
    // TODO(elleta): LinkedIn profile URL
  },
  {
    quote: "During her time with the team, she introduced valuable AI-driven automations and shared recommendations that helped us explore new ways of working.",
    bold: "AI-driven automations",
    name: "Xavier Boluda",
    role: "Design System Designer",
    company: "Mango",
    // TODO(elleta): LinkedIn profile URL
  },
  {
    quote: "She delivers impeccably organized, developer-friendly design files, proactively communicates her intent, anticipates edge cases, and treats technical constraints as creative opportunities rather than obstacles.",
    bold: "developer-friendly design files",
    name: "Mario Mezini",
    role: "Frontend Tech Lead, B2B travel platform",
    // TODO(elleta): LinkedIn profile URL
  },
  {
    quote: "Her Figma files were clean, well-structured, and edge cases were already handled, which made implementation feel like a natural extension of the design rather than a negotiation.",
    bold: "edge cases were already handled",
    name: "Davide J. Spiga",
    role: "Frontend Engineer",
    // TODO(elleta): LinkedIn profile URL
  },
  {
    quote: "While Elleta is very creative and a great design systems person, she’s an even better human being. She brings enthusiasm to the table with care, humor, and respect to top it off.",
    bold: "an even better human being",
    name: "Ian Frost",
    role: "Frontend architect",
    company: "Brad Frost Web",
    // TODO(elleta): LinkedIn profile URL
  },
  {
    quote: "The impact of her work as a UX/UI Designer continues to resonate within our banking projects, such as those for Riyad Bank.",
    bold: "continues to resonate",
    name: "Roberto Arpón",
    role: "Senior Product Designer",
    company: "VML",
    // TODO(elleta): LinkedIn profile URL
  },
];
