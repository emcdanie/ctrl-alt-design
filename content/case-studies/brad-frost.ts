import type { CaseStudy } from "@/lib/content";

const study: CaseStudy = {
  slug: "brad-frost",
  href: "/case-studies/brad-frost",
  title: "Code First",
  category: "DESIGN SYSTEMS",
  year: "2024–2025",
  scope: "Component Architecture, Token Alignment, Figma–Storybook Integration",
  timeline: "Oct 2024 – Jan 2025",
  heroImage: "/images/thumbnails/BradFrostCommandCenter.png",
  heroVideo: "/videos/eddie.mp4",
  metrics: {
    role: "Design System Collaborator",
    team: "Brad Frost Web Maker Program",
    timeline: "Oct 2024 – Jan 2025",
    scope: "Component Architecture, Token Alignment, Figma–Storybook Integration, MCP",
  },
  overview: {
    headline: "Building Brad Frost's component system in reverse — code-first, token-aligned, AI-assisted.",
    body: "Working as part of Brad Frost's Maker Program, I joined a project where the code already existed. The challenge was to understand an existing system deeply enough to contribute meaningfully at the component and token level, bring Figma into alignment with code reality, and use AI tooling to close the loop between the two.",
  },
  images: [],
  problem: {
    title: "Starting From Code",
    body: "Most design system work starts in Figma. This project inverted that entirely. Every decision had to be justified against an existing, principled structure rather than invented from first principles — which turned out to be enormously useful.",
  },
  process: {
    title: "Component Archaeology",
    steps: [
      {
        number: "01",
        title: "System Investigation",
        description: "Reading Storybook stories, tracing prop structures, and mapping how existing components composed.",
      },
      {
        number: "02",
        title: "Figma Alignment",
        description: "Rebuilding Figma components to match code counterparts — matching variant names to prop names, ensuring token consistency.",
      },
      {
        number: "03",
        title: "AI-Assisted Investigation",
        description: "Using Claude via MCP to surface token relationships and accelerate structural investigation.",
      },
    ],
  },
  outcomes: {
    title: "Aligned, Documented, Maintainable",
    body: "Figma and Storybook components aligned across the system. Token layer documented with explicit primitive → semantic → component chain. MCP workflow established for ongoing system investigation.",
    completionTag: "PROJECT COMPLETE · 2025",
  },
  tags: ["Design Systems", "Atomic Design", "Code-First", "AI Tooling"],
  clientLogo: "/images/logos/bradfrostwebjpeg.jpeg",
  clientName: "Brad Frost Web",
  description: "What Building Brad Frost's Component System in Reverse Taught Me About Design",
};

export default study;
