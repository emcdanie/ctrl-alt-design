/* The glossary behind <Term> (components/ui/Term.tsx): what a word
   means on this site, and when it matters. Copy is Elleta's, verbatim.
   Keys are what a <Term id="..."> points at. */
export type GlossaryEntry = {
  /** the word as the popover names it */
  word: string;
  definition: string;
  /** completes "When: ..." */
  when: string;
};

export const GLOSSARY = {
  bella: {
    word: "Bella",
    definition:
      "My dog and my design partner. She's the name and the face behind BELLA, the design system this whole site is built on.",
    when: "you want to meet the boss. She's in the illustrations too.",
  },
  rulebook: {
    word: "rulebook",
    definition:
      "A rulebook tells people what they can't do. A shared language helps them say what they mean. I build the second kind.",
    when: "a team keeps breaking the rules because nobody understands why they exist.",
  },
  been: {
    word: "been",
    definition: "Five teams since 2023, from banking and fashion to the UN. Open any row for the details.",
    when: "you want the short version of my CV without opening the PDF.",
  },
  words: {
    word: "words",
    definition: "Quoted from LinkedIn recommendations. Trimmed where you see …, never reworded.",
    when: "you want to read all fifteen: the link is under the quotes.",
  },
  ai: {
    word: "AI",
    definition:
      "Claude writes most of the code. I design the rules it works inside: contracts, skills and gates that check accessibility and best practice on every change, drawing on my system and my knowledge base. I make the calls.",
    when: "a team wants AI speed without dropping its standards.",
  },
  care: {
    word: "care",
    definition: "The four things I bring to every team, whatever the job title.",
    when: "you're wondering what I'm like to work with on a Friday afternoon.",
  },
  tokens: {
    word: "tokens",
    definition: "Named design decisions, like color.primary, stored once and used in both Figma and code.",
    when: "a brand colour changes and you update one value, not 400 screens.",
  },
  "source-of-truth": {
    word: "source of truth",
    definition: "The one place a decision officially lives.",
    when: "design and code disagree and you need to know which one is right.",
  },
  "figma-mcp": {
    word: "Figma MCP",
    definition: "A connection that lets AI tools read a Figma file directly.",
    when: "asking an AI to check a design against the system's tokens.",
  },
  "code-connect": {
    word: "Code Connect",
    definition: "Links a Figma component to the real code behind it.",
    when: "a developer inspects a design and sees the exact component to import.",
  },
  storybook: {
    word: "Storybook",
    definition: "A workshop where coded components live, with every state documented.",
    when: "a developer wants to see every version of a button before using it.",
  },
  governance: {
    word: "governance",
    definition: "How changes to a system get proposed, reviewed and shipped.",
    when: "a team needs a new component and wants to know who says yes.",
  },
  "bella-system": {
    word: "BELLA",
    definition: "My open design system. This site is built on it.",
    when: "you want to see the tokens and components behind what you're reading.",
  },
} satisfies Record<string, GlossaryEntry>;

export type TermId = keyof typeof GLOSSARY;
