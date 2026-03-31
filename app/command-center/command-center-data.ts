/**
 * Command Center data sourced from bradfrost/patternlab
 * Atomic Design component inventory + dashboard metrics
 */

export type AtomicLevel = "atom" | "molecule" | "organism" | "template";
export type WorkflowStage = "proposal" | "design-review" | "code-review" | "testing" | "approved";
export type Urgency = "urgent" | "standard";
export type HealthStatus = "passing" | "warning" | "failing";
export type InsightSeverity = "info" | "warning" | "error";

export interface PatternComponent {
  name: string;
  level: AtomicLevel;
  category: string;
  path: string;
}

export interface HealthMetric {
  name: string;
  value: string;
  status: HealthStatus;
}

export interface GovernanceItem {
  name: string;
  author: string;
  stage: WorkflowStage;
  urgency: Urgency;
  updatedAt: string;
}

export interface AIInsight {
  message: string;
  severity: InsightSeverity;
  component?: string;
}

// Real component data from bradfrost/patternlab
export const patternLabComponents: PatternComponent[] = [
  // Atoms — Global
  { name: "Colors", level: "atom", category: "Global", path: "00-Atoms/00-Global/00-Colors" },
  { name: "Fonts", level: "atom", category: "Global", path: "00-Atoms/00-Global/01-Fonts" },
  { name: "Animations", level: "atom", category: "Global", path: "00-Atoms/00-Global/02-Animations" },
  { name: "Visibility", level: "atom", category: "Global", path: "00-Atoms/00-Global/03-Visibility" },
  // Atoms — Text
  { name: "Headings", level: "atom", category: "Text", path: "00-Atoms/00-Text/00-Headings" },
  { name: "Subheadings", level: "atom", category: "Text", path: "00-Atoms/00-Text/00-Subheadings" },
  { name: "Linked Headings", level: "atom", category: "Text", path: "00-Atoms/00-Text/00-With-Links-Headings" },
  { name: "Small Headings", level: "atom", category: "Text", path: "00-Atoms/00-Text/01-Headings-With-Small-Text" },
  { name: "Paragraph", level: "atom", category: "Text", path: "00-Atoms/00-Text/01-Paragraph" },
  { name: "Blockquote", level: "atom", category: "Text", path: "00-Atoms/00-Text/02-Blockquote" },
  { name: "Inline Elements", level: "atom", category: "Text", path: "00-Atoms/00-Text/03-Inline-Text-Elements" },
  { name: "Preformatted", level: "atom", category: "Text", path: "00-Atoms/00-Text/05-Preformatted-Text" },
  { name: "Time", level: "atom", category: "Text", path: "00-Atoms/00-Text/06-Time" },
  { name: "HR", level: "atom", category: "Text", path: "00-Atoms/00-Text/07-HR" },
  // Atoms — Lists
  { name: "Unordered List", level: "atom", category: "Lists", path: "00-Atoms/01-Lists/04-unordered-list" },
  { name: "Ordered List", level: "atom", category: "Lists", path: "00-Atoms/01-Lists/05-ordered-list" },
  { name: "Definition List", level: "atom", category: "Lists", path: "00-Atoms/01-Lists/06-definition-list" },
  // Atoms — Images
  { name: "Logo", level: "atom", category: "Images", path: "00-Atoms/02-Images/00-logo" },
  { name: "Favicon", level: "atom", category: "Images", path: "00-Atoms/02-Images/01-Favicon" },
  { name: "Landscape 16:9", level: "atom", category: "Images", path: "00-Atoms/02-Images/02-Landscape-16x9" },
  { name: "Landscape 4:3", level: "atom", category: "Images", path: "00-Atoms/02-Images/03-Landscape-4x3" },
  { name: "Square", level: "atom", category: "Images", path: "00-Atoms/02-Images/05-Square" },
  { name: "Avatar", level: "atom", category: "Images", path: "00-Atoms/02-Images/07-Avatar" },
  { name: "Loading Icon", level: "atom", category: "Images", path: "00-Atoms/02-Images/09-Loading-Icon" },
  { name: "Social Icons", level: "atom", category: "Images", path: "00-Atoms/02-Images/10-Social-Icons" },
  // Atoms — Forms
  { name: "Text Fields", level: "atom", category: "Forms", path: "00-Atoms/03-Forms/00-Text-Fields" },
  { name: "Select Menu", level: "atom", category: "Forms", path: "00-Atoms/03-Forms/01-Select-Menu" },
  { name: "Checkboxes", level: "atom", category: "Forms", path: "00-Atoms/03-Forms/02-Checkboxes" },
  { name: "Radio Buttons", level: "atom", category: "Forms", path: "00-Atoms/03-Forms/03-Radio-Buttons" },
  { name: "HTML5 Inputs", level: "atom", category: "Forms", path: "00-Atoms/03-Forms/04-HTML5-Inputs" },
  // Atoms — Others
  { name: "Buttons", level: "atom", category: "Buttons", path: "00-Atoms/04-Buttons/00-Buttons" },
  { name: "Table", level: "atom", category: "Table", path: "00-Atoms/05-Table/00-Table" },
  { name: "Video Embed", level: "atom", category: "Media", path: "00-Atoms/06-Media/01-Video-Embed" },
  { name: "Audio", level: "atom", category: "Media", path: "00-Atoms/06-Media/02-Audio" },

  // Molecules — Text
  { name: "Byline (Author)", level: "molecule", category: "Text", path: "01-Molecules/00-Text/01-byline-author-only" },
  { name: "Byline (Author+Time)", level: "molecule", category: "Text", path: "01-Molecules/00-Text/02-byline-author-time" },
  { name: "Caption", level: "molecule", category: "Text", path: "01-Molecules/00-Text/03-Caption" },
  { name: "Blockquote Citation", level: "molecule", category: "Text", path: "01-Molecules/00-Text/04-Blockquote-With-Citation" },
  { name: "Pullquote", level: "molecule", category: "Text", path: "01-Molecules/00-Text/04-Pullquote" },
  { name: "Heading Group", level: "molecule", category: "Text", path: "01-Molecules/00-Text/05-Heading-Group" },
  { name: "Intro Text", level: "molecule", category: "Text", path: "01-Molecules/00-Text/06-Intro-Text" },
  { name: "Emphasis Colors", level: "molecule", category: "Text", path: "01-Molecules/00-Text/07-Emphasis-Colors" },
  { name: "Address", level: "molecule", category: "Text", path: "01-Molecules/00-Text/08-Address" },
  // Molecules — Layout
  { name: "1-Up Layout", level: "molecule", category: "Layout", path: "01-Molecules/01-Layout/00-1-up" },
  { name: "2-Up Layout", level: "molecule", category: "Layout", path: "01-Molecules/01-Layout/01-2-up" },
  { name: "3-Up Layout", level: "molecule", category: "Layout", path: "01-Molecules/01-Layout/02-3-up" },
  { name: "4-Up Layout", level: "molecule", category: "Layout", path: "01-Molecules/01-Layout/03-4-up" },
  // Molecules — Blocks
  { name: "Block Hero", level: "molecule", category: "Blocks", path: "01-Molecules/02-Blocks/00-Block-Hero" },
  { name: "Block Thumb Headline", level: "molecule", category: "Blocks", path: "01-Molecules/02-Blocks/01-Block-Thumb-Headline" },
  { name: "Block Headline Byline", level: "molecule", category: "Blocks", path: "01-Molecules/02-Blocks/02-Block-Headline-Byline" },
  { name: "Block Inset", level: "molecule", category: "Blocks", path: "01-Molecules/02-Blocks/04-Block-Inset" },
  { name: "Block Headline Only", level: "molecule", category: "Blocks", path: "01-Molecules/02-Blocks/05-Block-Headline-Only" },
  // Molecules — Media
  { name: "Image with Caption", level: "molecule", category: "Media", path: "01-Molecules/03-Media/00-Image-With-Caption" },
  { name: "Map", level: "molecule", category: "Media", path: "01-Molecules/03-Media/03-Map" },
  // Molecules — Navigation
  { name: "Primary Nav", level: "molecule", category: "Navigation", path: "01-Molecules/04-Navigation/00-Primary-Nav" },
  { name: "Footer Nav", level: "molecule", category: "Navigation", path: "01-Molecules/04-Navigation/01-Footer-Nav" },
  { name: "Pagination", level: "molecule", category: "Navigation", path: "01-Molecules/04-Navigation/02-Pagination" },
  { name: "Tabs", level: "molecule", category: "Navigation", path: "01-Molecules/04-Navigation/03-Tabs" },
  // Molecules — Forms
  { name: "Search", level: "molecule", category: "Forms", path: "01-Molecules/05-Forms/00-Search" },
  { name: "Newsletter Form", level: "molecule", category: "Forms", path: "01-Molecules/05-Forms/01-Newsletter-Form" },
  { name: "Comment Form", level: "molecule", category: "Forms", path: "01-Molecules/05-Forms/05-Comment-Form" },
  // Molecules — Components
  { name: "Single Comment", level: "molecule", category: "Components", path: "01-Molecules/06-Components/00-Single-Comment" },
  { name: "Accordion", level: "molecule", category: "Components", path: "01-Molecules/06-Components/02-Accordion" },
  { name: "Social Share", level: "molecule", category: "Components", path: "01-Molecules/06-Components/03-Social-Share" },

  // Organisms
  { name: "Header", level: "organism", category: "Global", path: "02-Organisms/00-Global/00-Header" },
  { name: "Footer", level: "organism", category: "Global", path: "02-Organisms/00-Global/01-Footer" },
  { name: "Article Body", level: "organism", category: "Article", path: "02-Organisms/03-Article/00-Article-Body" },
  { name: "Comment Thread", level: "organism", category: "Comments", path: "02-Organisms/03-Comments/00-Comment-Thread" },
  { name: "Carousel List", level: "organism", category: "Components", path: "02-Organisms/04-Components/00-Carousel-List" },
  { name: "Related Posts", level: "organism", category: "Sections", path: "02-Organisms/05-Sections/00-Related-Posts" },
  { name: "Recent Tweets", level: "organism", category: "Sections", path: "02-Organisms/05-Sections/01-Recent-Tweets" },
  { name: "Latest Posts", level: "organism", category: "Sections", path: "02-Organisms/05-Sections/02-Latest-Posts" },

  // Templates
  { name: "Homepage", level: "template", category: "Pages", path: "03-Templates/00-Homepage" },
  { name: "Blog", level: "template", category: "Pages", path: "03-Templates/01-Blog" },
  { name: "Article", level: "template", category: "Pages", path: "03-Templates/02-Article" },
];

export const healthMetrics: HealthMetric[] = [
  { name: "Build Status", value: "Passing", status: "passing" },
  { name: "Test Coverage", value: "96%", status: "passing" },
  { name: "Accessibility", value: "AA Compliant", status: "passing" },
  { name: "Bundle Size", value: "142kb gzip", status: "warning" },
  { name: "Broken References", value: "0 issues", status: "passing" },
  { name: "Outdated Dependencies", value: "3 warnings", status: "warning" },
];

export const governanceItems: GovernanceItem[] = [
  { name: "Button variant: Ghost", author: "Sarah K.", stage: "design-review", urgency: "urgent", updatedAt: "2h ago" },
  { name: "Card: Pricing tier", author: "Mike L.", stage: "code-review", urgency: "standard", updatedAt: "4h ago" },
  { name: "Form: Multi-step wizard", author: "Team Platform", stage: "testing", urgency: "standard", updatedAt: "1d ago" },
  { name: "Navigation: Mega menu", author: "Design Ops", stage: "proposal", urgency: "urgent", updatedAt: "3h ago" },
  { name: "Table: Sortable headers", author: "Alex R.", stage: "approved", urgency: "standard", updatedAt: "6h ago" },
  { name: "Modal: Confirmation dialog", author: "UX Guild", stage: "design-review", urgency: "urgent", updatedAt: "1h ago" },
];

export const aiInsights: AIInsight[] = [
  { message: "Detected 4 button variants with inconsistent border-radius values (4px\u20138px). Consider standardizing to 6px.", severity: "warning", component: "Buttons" },
  { message: "Block-Hero molecule is used in 2 templates but has no responsive breakpoint styles defined.", severity: "warning", component: "Block Hero" },
  { message: "3 form atoms share duplicate input styling \u2014 candidate for a shared mixin or design token.", severity: "info", component: "Text Fields" },
  { message: "2 color combinations in Emphasis-Colors molecule fail WCAG AA contrast ratio.", severity: "error", component: "Emphasis Colors" },
  { message: "Carousel-List organism has no keyboard navigation handlers. Recommend adding ARIA roles.", severity: "error", component: "Carousel List" },
];

// Helpers
export function getComponentsByLevel(level: AtomicLevel) {
  return patternLabComponents.filter((c) => c.level === level);
}

export function getCategoriesForLevel(level: AtomicLevel) {
  const components = getComponentsByLevel(level);
  return [...new Set(components.map((c) => c.category))];
}

export const levelCounts = {
  atom: getComponentsByLevel("atom").length,
  molecule: getComponentsByLevel("molecule").length,
  organism: getComponentsByLevel("organism").length,
  template: getComponentsByLevel("template").length,
};

export const totalComponents = patternLabComponents.length;
