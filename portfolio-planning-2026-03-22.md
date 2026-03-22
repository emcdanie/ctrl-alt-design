# Portfolio Planning Report
**Generated:** 2026-03-22 | **Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · Vercel

---

## 1. Reusable Component Architecture

Based on the existing codebase, the portfolio's components fall into four clear layers. Here's the recommended structure with what already exists vs. what to build:

### Layer 1 — Design Primitives (already solid, minor extensions needed)
| Component | Status | Notes |
|-----------|--------|-------|
| `SurfaceCard` | ✅ exists | Add `variant="dark"` for dashboard demos |
| `SectionShell` | ✅ exists | Extend with `fullBleed` prop |
| `SectionHeader` | ✅ exists | Add animated number counter variant |
| `FadeIn` | ✅ exists | Add `stagger` prop for list children |
| `TagBadge` | ⚠️ inline in CaseStudyGrid | Extract to `components/ui/TagBadge.tsx` |
| `GlassCard` | ⚠️ CSS only | Extract as composable component |

### Layer 2 — Media & Demo Components (mostly new)
| Component | Status | Notes |
|-----------|--------|-------|
| `MediaCard` | 🔲 new | Apple TV-style hover expand card |
| `ResponsivePreview` | 🔲 new | Desktop/mobile split viewer |
| `VideoWalkthrough` | ✅ exists | Refactor to accept `projectSlug` prop |
| `InteractiveDemo` | 🔲 new | Iframe + overlay wrapper for embedded demos |
| `ProjectTimeline` | 🔲 new | Git commit-style vertical timeline |
| `WalkthroughVideoSection` | 🔲 new | Full-bleed scrubable video section |

### Layer 3 — Case Study Page Sections (partially exists)
| Component | Status | Notes |
|-----------|--------|-------|
| `CaseStudyHero` | ✅ exists | Add `variant="dark"` for dashboard projects |
| `CaseStudyLayout` | ✅ exists | Good — keep as shell |
| `NarrativeBlock` | ⚠️ inline | Extract from case study pages |
| `MetricsRow` | ⚠️ inline | Shared across all case studies |
| `ProcessStepper` | ⚠️ inline | Extract as reusable stepper |
| `AskAboutProject` | 🔲 new | AI assistant sidebar/drawer |
| `DesignCommandCenter` | 🔲 new | Brad Frost-style component browser |

### Layer 4 — Demo Environments (new — housed under `/app/demos/`)
| Component | Status | Notes |
|-----------|--------|-------|
| `DarkDashboardShell` | 🔲 new | Productivity dashboard frame |
| `TravelPlatformDemo` | 🔲 new | Embedded in case study or `/demos/travel` |
| `UNDashboardDemo` | 🔲 new | Data vis demo under `/demos/un` |
| `DesignSystemCommandCenter` | 🔲 new | Component browser with token viewer |

---

## 2. Recommended File Structure

```
app/
  page.tsx                     (home)
  case-study/[slug]/page.tsx   (dynamic)
  demos/
    travel/page.tsx
    un-dashboard/page.tsx
    design-system/page.tsx
  api/
    contact/route.ts           (exists)
    ask-project/route.ts       (new — AI assistant)

components/
  ui/
    SurfaceCard.tsx            (exists)
    SectionShell.tsx           (exists)
    SectionHeader.tsx          (exists)
    TagBadge.tsx               (extract)
    GlassCard.tsx              (extract)
    FadeIn.tsx                 (exists)
    MetricsRow.tsx             (extract)
  media/
    MediaCard.tsx              (new)
    ResponsivePreview.tsx      (new)
    VideoWalkthrough.tsx       (refactor)
    WalkthroughVideoSection.tsx (new)
  case-study/
    CaseStudyLayout.tsx        (exists)
    CaseStudyHero.tsx          (exists)
    NarrativeBlock.tsx         (extract)
    ProcessStepper.tsx         (extract)
    ProjectTimeline.tsx        (new)
    AskAboutProject.tsx        (new)
  demos/
    DarkDashboardShell.tsx     (new)
    DesignCommandCenter.tsx    (new)
  home/
    Hero.tsx                   (exists)
    CaseStudyGrid.tsx          (exists)
    MetricsStrip.tsx           (exists)
    Carousel.tsx               (exists)

data/
  caseStudies.ts               (exists — add demoUrl field)
  demos.ts                     (new)

lib/
  tagColor.ts                  (exists)
  useScrollProgress.ts         (new)
  useReducedMotion.ts          (new)
```

---

## 3. UI Architecture Improvements

### 3a. Add `demoUrl` to CaseStudy data type
The `CaseStudy` interface needs a `demoUrl?: string` field so `CaseStudyGrid` and case study pages can automatically render an "Open Demo" CTA linking to `/demos/[slug]`.

### 3b. Dark variant for SurfaceCard
Dashboard and command center demos live in a dark environment. Add a `variant` prop:
```tsx
// components/ui/SurfaceCard.tsx — add variant prop
variant?: "light" | "dark" | "glass"
```

### 3c. Centralise all section spacing
Currently, sections use mixed `py-20 px-6` / `py-24 px-6` inline. Extract to a shared `SectionShell` with a `spacing` prop (`default | tight | loose`). This is already partially done — just enforce usage everywhere.

### 3d. Route structure for demos
Use a dedicated `/demos/[slug]` route segment so demos are:
- Linkable from case study cards
- Indexable independently
- Embeddable via `<InteractiveDemo src="/demos/travel" />`

### 3e. Shared dark theme tokens
Add to `globals.css @theme`:
```css
--color-dark-surface: #0d0d1a;
--color-dark-card: rgba(255,255,255,0.06);
--color-dark-border: rgba(255,255,255,0.1);
--color-dark-text: #e8e4de;
--color-dark-muted: rgba(232,228,222,0.55);
```

---

## 4. Claude Code Prompts — Ready to Paste

### PROMPT A — Apple TV Style MediaCard
```
Create a React component at components/media/MediaCard.tsx.

Props:
  - title: string
  - subtitle?: string
  - category: string
  - year: string
  - heroImage: string
  - heroVideo?: string
  - href: string
  - tags?: string[]

Behaviour:
  - Default state: image with title + category badge visible
  - On hover: card lifts (translate-y-[-6px]), video autoplays with fade-in,
    a frosted glass info drawer slides up from the bottom (bottom-0 translate-y-full
    → translate-y-0, backdrop-blur-md, bg-black/50)
  - The drawer shows: title, subtitle, tags, and an arrow CTA
  - Uses CSS custom properties from globals.css (--color-glass, --shadow-soft etc.)
  - Wrap in Next.js Link
  - Tailwind CSS 4 only — no extra libraries

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT B — Responsive Preview Viewer
```
Create a component at components/media/ResponsivePreview.tsx.

Props:
  - desktopSrc: string  (image or video)
  - mobileSrc?: string
  - caption?: string

Layout:
  - Side-by-side: desktop frame on the left (~65% width), mobile frame on the right (~35%)
  - Desktop frame: rounded-[16px] border border-[var(--color-border-soft)] with a
    thin browser chrome strip (3 dots + URL bar placeholder) at the top
  - Mobile frame: phone bezel shape — rounded-[32px], notch at top, home indicator bar
    at bottom, narrower border
  - Both frames cast shadow-[var(--shadow-soft)]
  - On mobile viewport (<768px): stack vertically, desktop frame first
  - Supports image or <video autoPlay loop muted playsInline> depending on src extension
  - Optional caption renders below with section-label styling

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT C — Git Commit-Style Project Timeline
```
Create a component at components/case-study/ProjectTimeline.tsx.

Props:
  - entries: Array<{
      date: string,
      phase: string,
      title: string,
      description: string,
      tags?: string[],
      milestone?: boolean
    }>

Layout:
  - Vertical timeline down the left side
  - Each entry: a small circle node on the line (filled for milestone, outlined otherwise),
    date + phase label on the left (muted, monospace font), content on the right
  - Milestone entries get a subtle glow on the node and bold phase label
  - Line uses border-l-2 border-[var(--color-border-medium)]
  - Nodes use w-3 h-3 rounded-full, milestone nodes are w-4 h-4 with ring-2 ring-offset-2
  - FadeIn on scroll per entry (use IntersectionObserver)
  - Mobile: full width, date above title

Style: cream glass editorial — warm, not harsh dark/light contrast
Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT D — AI "Ask About This Project" Assistant
```
Create a floating assistant component at components/case-study/AskAboutProject.tsx
AND a route handler at app/api/ask-project/route.ts.

COMPONENT:
  - Floating action button, bottom-right, fixed position
  - Icon: sparkle/star SVG, cream glass style (bg-white/80 backdrop-blur)
  - Click opens a drawer (slides in from right, w-[360px], full height on mobile)
  - Drawer header: "Ask about this project" + close button
  - Input: text field at bottom, send button
  - Messages: scrollable list, user bubbles right (dark fill), AI bubbles left (glass card)
  - Show typing indicator (3-dot pulse) while waiting
  - Props: projectSlug: string, projectContext: string (summary passed from case study page)

API ROUTE (app/api/ask-project/route.ts):
  - POST handler accepting { question: string, context: string }
  - Uses Anthropic SDK (install: npm install @anthropic-ai/sdk)
  - System prompt: "You are a helpful assistant answering questions about a specific
    design project. Only answer based on the provided context. Be concise and friendly."
  - Stream the response using ReadableStream and return as text/event-stream
  - Handle ANTHROPIC_API_KEY from env

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript, @anthropic-ai/sdk
```

### PROMPT E — Dark Productivity Dashboard Shell
```
Create a demo page at app/demos/productivity-dashboard/page.tsx
and a shell component at components/demos/DarkDashboardShell.tsx.

SHELL:
  - Dark theme using custom properties:
    bg-[#0d0d1a], text-[#e8e4de], border-[rgba(255,255,255,0.1)]
  - Left sidebar: 240px, icon + label nav items, active state with accent highlight
  - Top bar: project name left, user avatar + date right
  - Main area: slot for children
  - Sidebar collapses to icons-only on md breakpoint

DEMO PAGE (productivity-dashboard):
  - Header: "Project Board" with sprint selector dropdown (static options)
  - 4 KPI cards in a row: Tasks Done, In Progress, Blocked, Velocity
    Each card: large number, label, sparkline SVG (hardcoded SVG path, no library)
  - Kanban columns: To Do / In Progress / Review / Done
    Each card in column: title, assignee avatar (placeholder initials circle),
    priority dot (red/amber/green), tag badge
  - All data hardcoded — no backend needed
  - Feels like a real SaaS product screenshot

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT F — Design System Command Center
```
Create a demo page at app/demos/design-system/page.tsx.

Layout (Brad Frost "Pattern Lab" inspired):
  - Left panel (260px): component tree navigator
    Grouped: Atoms / Molecules / Organisms / Templates
    Each item is clickable, highlights on select
  - Main panel: selected component renders in an iframe-like preview area
    Toggle buttons: Light / Dark / Mobile
    Show component name, description, usage notes below preview
  - Right panel (240px, collapsible): Design tokens viewer
    Sections: Colors, Typography, Spacing, Shadows
    Each token: swatch/preview + name + value
    Copy-to-clipboard on click

IMPORTANT: All components in the navigator are from the portfolio's own design system
(SurfaceCard, TagBadge, SectionHeader, MetricsRow etc.) — render them statically
inside the preview area, do not use actual iframes.

Top bar: "Design System v1.0" left, search box center, "Export tokens" button right (no-op)

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT G — Travel Platform Demo
```
Create a demo page at app/demos/travel/page.tsx.

UI concept: Premium travel booking interface, dark editorial style.

Sections:
  1. Hero search bar: destination input + date pickers + traveller count + Search CTA
     Floating on a full-bleed background image (use /public/demos/travel-hero.jpg or
     a CSS gradient fallback)
  2. Featured Destinations: horizontal scroll row of MediaCard components
     (reuse from components/media/MediaCard.tsx if built)
     Cards: Kyoto, Patagonia, Amalfi Coast, Rajasthan — use Unsplash srcset URLs
  3. "Your next trip" personalisation block: 3 columns — Recent, Recommended, Trending
  4. Footer strip: airline logos (placeholder SVG rectangles with names)

Style: dark navy (#0a0a1c) base, cream (#f6f1e8) text, gold (#b8956a) accent —
  matches portfolio's espresso/gold tokens but inverted to dark
All data hardcoded. No real booking logic.

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT H — UN Dashboard Demo
```
Create a demo page at app/demos/un-dashboard/page.tsx.

UI concept: Data-rich humanitarian dashboard, clean and authoritative.

Sections:
  1. Top bar: UN logo placeholder + "Global Situation Dashboard" title + date
  2. Region selector: tabs for Global / Africa / Asia / Americas / Europe / MENA
  3. KPI strip: 5 cards — Persons of Concern, Active Crises, Funded %, Volunteers,
     Displaced (all hardcoded realistic numbers with trend indicators ↑↓)
  4. Main content grid (2/3 + 1/3):
     Left: World map placeholder (SVG world outline with ~6 coloured hotspot circles)
           + legend
     Right: Top 5 crises list (crisis name, country flag emoji, severity badge,
            funding bar)
  5. Data table: paginated table of recent situation reports
     (title, region, date, status badge, PDF link placeholder)

Style: white/light grey base, UN blue (#009EDB) accent,
       professional data-dense layout with Inter/system font
All data hardcoded. Accessibility: proper table headers, ARIA roles.

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT I — Refactor VideoWalkthrough to accept props
```
Refactor components/VideoWalkthrough.tsx to accept all content as props
instead of being hardcoded to the Guardian project.

New interface:
  interface VideoWalkthroughProps {
    quote: string
    videoSrc: string
    posterSrc?: string
    projectLabel: string
    title: string
    description: string
    tags: string[]
    href: string
    ctaLabel?: string       // default: "View Full Case Study →"
    background?: string     // default: "#F8F5F0"
  }

Keep all existing visual styles.
Update app/page.tsx to pass Guardian's data as explicit props.
This component can then be reused for other featured projects.

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT J — Extract TagBadge as a reusable component
```
Create components/ui/TagBadge.tsx.

Interface:
  interface TagBadgeProps {
    label: string
    variant?: "default" | "category" | "status"
    color?: { bg: string; color: string }  // overrides automatic color
    size?: "sm" | "md"
  }

Behaviour:
  - "default": uses tagColor() from lib/tagColor.ts for automatic colour assignment
  - "category": uses CATEGORY_COLORS map (import from wherever it lives or accept as prop)
  - "status": uses semantic colours (green for complete, amber for in-progress, red for blocked)
  - size "sm": text-[10px] px-2.5 py-1
  - size "md": text-[11px] px-3.5 py-1.5 (default)

After creating, replace all inline tag rendering in:
  - CaseStudyGrid.tsx
  - VideoWalkthrough.tsx
  - CaseStudyHero.tsx
  - Any case study pages

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript
```

### PROMPT K — WalkthroughVideoSection with scroll scrubbing hint
```
Create components/media/WalkthroughVideoSection.tsx.

A full-bleed section wrapping a video with:
  - Full viewport-width video (object-cover, aspect-video)
  - Gradient overlay top and bottom (for text legibility)
  - Overlay text: large italic headline + subtitle, centred
  - Progress bar at bottom that fills as the video plays (timeupdate event)
  - "Scroll to explore →" hint that fades out after 2s
  - Click to play/pause toggle (shows play icon overlay on pause)
  - Props: videoSrc, headline, subtitle, posterSrc?

Stack: Next.js 16, React 19, Tailwind CSS 4, TypeScript — useRef for video element
```

---

## 5. Interaction Ideas for Demos

### Apple TV Cards (MediaCard)
- **Parallax thumb on hover:** translate the thumbnail image slightly opposite to mouse direction for depth
- **Sound on hover:** subtle `AudioContext` click/swoosh (optional, respects prefers-reduced-motion)
- **Keyboard navigation:** arrow keys cycle through cards, Enter opens link

### Design System Command Center
- **Live token editing:** click a colour swatch, open a mini colour picker, see the component preview update in real time (all local state, no persistence)
- **Diff view:** a "Changes" tab that shows a mock before/after of a token change
- **Search:** filter the component tree by name, highlight matching tokens

### Project Timeline
- **Hover to expand:** each timeline entry collapses to 1 line by default, expands on hover/click to show full description
- **Active phase indicator:** the current phase node pulses with a soft glow animation

### AI Ask About This Project
- **Suggested questions:** show 3 clickable suggestion chips ("What was the biggest challenge?", "What tools were used?", "What was the outcome?") before the user types
- **Copy answer to clipboard** button on each AI message

### Responsive Preview Viewer
- **Live resize handle:** draggable handle between desktop and mobile frames lets user manually resize
- **Rotate mobile:** button to toggle portrait/landscape on the phone frame

### UN Dashboard / Travel Demo
- **Hover row highlights** in data tables
- **Animated number counters** on KPI cards when they scroll into view (requestAnimationFrame count-up)
- **Filter chips** on the travel platform that filter the destination cards client-side

---

## 6. Visual Hierarchy & Layout Improvements

### Home Page
- **Hero:** Add a subtle scroll-activated parallax to the headline (translate slightly on scroll). Currently flat.
- **Carousel:** The `scroll-left` marquee is nice — consider adding a pause-on-hover state for accessibility.
- **CaseStudyGrid:** Cards are well-structured. Consider adding a `featured` flag to `CaseStudy` data that makes the first card span full width at a `min-h-[320px]` on desktop.
- **MetricsStrip:** Numbers are good — add animated count-up using IntersectionObserver when section enters viewport.

### Case Study Pages
- **Consistent hero height:** Enforce `min-h-[60vh]` on `CaseStudyHero` to prevent short/tall variance between projects.
- **Reading width:** Long prose sections should be capped at `max-w-[68ch]` for comfortable reading.
- **Section dividers:** Use a thin `<hr className="border-[var(--color-border-soft)]">` between major sections rather than relying purely on padding.

### Global
- **Skip to content link:** Add an accessible "Skip to main content" link as first child of `<body>` for keyboard users.
- **Focus ring:** Ensure all interactive elements have a visible `:focus-visible` ring using `ring-2 ring-[var(--color-accent-espresso)] ring-offset-2`.

---

## 7. Component Reuse Patterns

### Pattern: Composable Section
Every home section should follow this pattern:
```tsx
<SectionShell id="...">
  <FadeIn>
    <SectionHeader label="..." title="..." description="..." />
  </FadeIn>
  <FadeIn delay={100}>
    {/* section content */}
  </FadeIn>
</SectionShell>
```

### Pattern: Data-driven demo pages
All demo pages (`/demos/*`) should pull from a `data/demos.ts` file with:
```ts
interface DemoConfig {
  slug: string
  title: string
  description: string
  thumbnail: string
  theme: "light" | "dark"
  tags: string[]
  caseStudySlug?: string  // links back to the case study
}
```
This lets the home `CaseStudyGrid` auto-render a "View Demo" button if `demoUrl` is present.

### Pattern: Centralized case-study section blocks
Extract these repeated patterns from current case study pages into shared components:
- `<NarrativeBlock heading="..." paragraphs={[...]} />` — replaces inline `<h2>` + `<p>` sections
- `<MetricsRow metrics={cs.metrics} />` — role / timeline / scope chips
- `<ProcessStepper steps={cs.process.steps} />` — numbered step list
- `<OutcomesBanner body="..." completionTag="..." />` — outcomes section

These will make future case studies very fast to build — just populate a data object in `caseStudies.ts`.

---

## 8. Recommended Build Order

Given the existing foundation, build in this sequence to maximise visible impact per session:

1. **TagBadge extraction** (Prompt J) — quick win, unblocks all card work
2. **MediaCard** (Prompt A) — high visual impact, reusable everywhere
3. **VideoWalkthrough refactor** (Prompt I) — low effort, unlocks reuse
4. **DarkDashboardShell + Productivity Demo** (Prompt E) — shows range
5. **ResponsivePreview** (Prompt B) — adds premium feel to case studies
6. **ProjectTimeline** (Prompt C) — differentiator, unique UX
7. **Design System Command Center** (Prompt F) — Brad Frost reference
8. **Travel Demo** (Prompt G) — polished product showcase
9. **UN Dashboard** (Prompt H) — demonstrates data viz range
10. **AI Ask About Project** (Prompt D) — highest complexity, save for last

---

*Auto-generated by portfolio-planning-agent · Next run will pick up where this leaves off.*
