# Portfolio Planning Report — Run 2
**Generated:** 2026-03-22 (Automated) | **Stack:** Next.js · React · Tailwind CSS · Vercel
**Focus this run:** Deep-dive prompts, interaction patterns, and demo architecture

---

## 1. Reusable Component Inventory (Current Codebase)

### Confirmed existing (from codebase scan)

| Component | File | Reuse Opportunity |
|---|---|---|
| `SurfaceCard` | `components/ui/SurfaceCard.tsx` | Add `variant="dark"` + `size` prop |
| `SectionShell` | `components/ui/SectionShell.tsx` | Add `fullBleed` + `accent` props |
| `SectionHeader` | `components/ui/SectionHeader.tsx` | Add `animate` + `counter` variants |
| `FadeIn` | `components/FadeIn.tsx` | Add `stagger`, `direction` props |
| `MetricsStrip` | `components/MetricsStrip.tsx` | Generalize — move data to `data/metrics.ts` |
| `VideoWalkthrough` | `components/VideoWalkthrough.tsx` | Refactor to accept `projectSlug` prop |
| `CaseStudyGrid` | `components/CaseStudyGrid.tsx` | Extract `TagBadge` + `CategoryPill` inline components |

### Inline patterns to extract immediately

```
components/ui/TagBadge.tsx       — used inline in CaseStudyGrid (CATEGORY_COLORS map)
components/ui/CategoryPill.tsx   — color-coded category badge
components/ui/MetricsRow.tsx     — shared across case study pages
components/ui/ProcessStepper.tsx — extract from inline ProcessSection usage
```

---

## 2. Priority Build Queue (New Components)

Ordered by impact-to-effort ratio:

```
HIGH IMPACT / LOW EFFORT
  ├── TagBadge (extract only, already exists inline)
  ├── GlassCard dark variant (SurfaceCard + CSS var swap)
  └── VideoWalkthrough refactor (add projectSlug prop)

HIGH IMPACT / MEDIUM EFFORT
  ├── MediaCard (Apple TV-style hover expand)
  ├── ProjectTimeline (Git commit-style)
  ├── ResponsivePreview (desktop/mobile split viewer)
  └── WalkthroughVideoSection (scrubable full-bleed video)

HIGH IMPACT / HIGH EFFORT
  ├── AskAboutProject (AI assistant sidebar/drawer)
  ├── DesignSystemCommandCenter (Brad Frost-style browser)
  └── Demo environments (travel, UN dashboard)
```

---

## 3. Recommended File Structure (additions only)

```
app/
  demos/
    travel/page.tsx
    un-dashboard/page.tsx
    design-system/page.tsx
  api/
    ask-project/route.ts           ← AI assistant endpoint

components/
  ui/
    TagBadge.tsx                   ← extract from CaseStudyGrid
    CategoryPill.tsx               ← extract from CaseStudyGrid
    GlassCard.tsx                  ← composable dark/light variant
    MetricsRow.tsx                 ← extract from case study pages
    ProcessStepper.tsx             ← extract from ProcessSection
  media/
    MediaCard.tsx                  ← new: Apple TV style
    ResponsivePreview.tsx          ← new: desktop/mobile split
    WalkthroughVideoSection.tsx    ← new: scrubable video
    ProjectTimeline.tsx            ← new: Git commit timeline
  demos/
    DarkDashboardShell.tsx         ← new: demo frame wrapper
    TravelPlatformDemo.tsx         ← new
    UNDashboardDemo.tsx            ← new
  case-study/
    AskAboutProject.tsx            ← new: AI assistant
    DesignCommandCenter.tsx        ← new: Brad Frost style

data/
  metrics.ts                       ← extract from MetricsStrip.tsx
```

---

## 4. Claude Code Prompts (Ready to Paste)

---

### PROMPT A — MediaCard (Apple TV Style)

```
Create a React component at components/media/MediaCard.tsx for my Next.js portfolio.

Stack: Next.js, React, Tailwind CSS, TypeScript.
Design system: cream glass editorial — see components/ui/SurfaceCard.tsx and app/globals.css for the glass-card class and CSS variables (--color-cream, --color-ink, etc.)

Component name: MediaCard
File: components/media/MediaCard.tsx

Props:
  - title: string
  - category: string
  - year: string
  - imageSrc: string
  - videoSrc?: string   (optional looping preview video, plays on hover)
  - href: string
  - tags?: string[]
  - featured?: boolean  (spans 2 columns when true)

Behaviour:
  - At rest: shows image with title, category badge at top-left, year at bottom-right
  - On hover: card scales up slightly (scale-105), video fades in over image (if videoSrc provided), a frosted glass overlay slides up from bottom revealing tags + arrow CTA
  - Clicking navigates to href
  - Apple TV parallax tilt effect on mouse move (use CSS transform perspective, track mousemove)
  - Use the existing glass-card CSS class from globals.css for the card surface
  - Category badge should use the CATEGORY_COLORS map (import or accept colorScheme prop)
  - Transition timing: 300ms ease for hover, 200ms for overlay slide

Variants:
  - Default: 1-column card
  - featured=true: render at full width with image on right half

Use the existing FadeIn component from components/FadeIn.tsx for entrance animation.
Export as default. No external libraries (no Framer Motion — CSS transitions only).
```

---

### PROMPT B — ProjectTimeline (Git Commit Style)

```
Create a React component at components/media/ProjectTimeline.tsx for my Next.js portfolio.

Stack: Next.js, React, Tailwind CSS, TypeScript.
Design system: cream glass editorial (see app/globals.css). CSS vars available: --color-ink, --color-ink-muted, --color-cream, --color-card.

Component: ProjectTimeline
Props:
  - entries: TimelineEntry[]
  - projectColor?: string   (accent color for the timeline line, defaults to --color-ink)

TimelineEntry type:
  {
    date: string            // e.g. "Feb 2024"
    commitHash?: string     // short hash shown in monospace, e.g. "a3f8c2d"
    label: string           // e.g. "Research" | "Wireframes" | "Shipped"
    description: string
    phase: "research" | "design" | "build" | "shipped" | "iteration"
    artifact?: {
      label: string
      href?: string
    }
  }

Visual design:
  - Vertical timeline line on the left (2px, colored with projectColor or ink)
  - Each entry: dot on the line (filled circle for "shipped", ring for others)
  - Commit hash displayed in monospace font (font-mono, small, muted) — like a git log
  - Date in section-label style (uppercase, tracked, muted)
  - Description in body text
  - Artifact link (if present): small pill button with arrow
  - Smooth FadeIn stagger as user scrolls (use IntersectionObserver, no library)
  - "shipped" phase: dot pulses with a subtle ring animation (CSS @keyframes)
  - Phase color coding via a small left-border on the entry card

Export TimelineEntry type. Export component as default.
Keep it accessible — use <ol> with <li> items, proper aria-labels.
```

---

### PROMPT C — ResponsivePreview (Desktop / Mobile Split)

```
Create a React component at components/media/ResponsivePreview.tsx.

Stack: Next.js, React, Tailwind CSS, TypeScript.

Component: ResponsivePreview
Shows a side-by-side or toggled preview of a design in desktop and mobile frames simultaneously.

Props:
  - desktopImageSrc: string
  - mobileImageSrc: string
  - desktopAlt?: string
  - mobileAlt?: string
  - caption?: string
  - layout?: "split" | "overlay"   (default: "split")
    - split: desktop on left (70%), mobile frame on right (30%) — both visible at once
    - overlay: desktop full width with floating mobile frame overlapping bottom-right corner

Behaviour:
  - Desktop: rendered inside a minimal browser chrome frame (3 dots + URL bar placeholder)
  - Mobile: rendered inside a phone frame (rounded rect, notch at top, home indicator at bottom)
    - Phone frame uses pure CSS/SVG — no images
  - On hover: subtle parallax shift (mobile frame lifts slightly, desktop dims 5%)
  - Below 768px: stacks vertically, shows only desktop by default, toggle button reveals mobile
  - Caption renders below in muted section-label style
  - Use the CSS variable --color-ink-muted for frame chrome colours
  - Frames use glass-card class for subtle surface treatment

No external libraries. Export as default.
```

---

### PROMPT D — AskAboutProject (AI Assistant)

```
Create two files for an AI "Ask about this project" feature in my Next.js portfolio:

FILE 1: app/api/ask-project/route.ts
  - POST handler accepting { question: string, projectSlug: string }
  - Calls Anthropic Claude API (claude-3-haiku-20240307 — fast + cheap)
  - System prompt: "You are a portfolio assistant for a product designer named Elleta. Answer questions about her design projects concisely and helpfully. Only answer questions related to her work. If asked something unrelated, redirect to her projects."
  - Per-project context: import the matching CaseStudy from data/caseStudies.ts by slug, inject overview + problem + outcomes + process steps as context
  - Streaming response using ReadableStream
  - Rate limit: check request headers for x-forwarded-for, allow max 10 req/min per IP (use a simple in-memory Map — not Redis, keep it serverless-compatible with a note about cold start resets)
  - Return: streaming text response

FILE 2: components/case-study/AskAboutProject.tsx
  - "use client" component
  - Props: { projectSlug: string, projectTitle: string }
  - UI: A collapsed trigger button at bottom of case study page — "Ask about this project →"
  - Expands into a floating panel (fixed bottom-right, z-50, glass-card style)
  - Panel contains:
      - Header with project title + close button
      - Scrollable message thread (user + assistant bubbles)
      - Textarea input + send button
      - 3 suggested starter questions shown as pills before first message
  - Starter questions examples: "What was the main design challenge?", "What tools were used?", "What were the outcomes?"
  - Streams response tokens into the assistant bubble as they arrive (fetch + ReadableStream)
  - Loading state: animated dots in assistant bubble
  - Error state: "Something went wrong — try again" in muted text
  - Keyboard: Enter sends, Shift+Enter newline, Escape closes panel
  - Accessible: focus trap inside panel when open, aria-live for streaming content

Design: use --color-cream, glass-card, and existing font variables from globals.css.
No external AI SDK — use raw fetch to /api/ask-project.
```

---

### PROMPT E — DarkDashboardShell (Demo Wrapper)

```
Create a React component at components/demos/DarkDashboardShell.tsx.

This is a full-viewport dark UI shell that wraps interactive demo content for case studies in my portfolio.
It should feel like a real product — a productivity/enterprise dashboard.

Stack: Next.js, React, Tailwind CSS, TypeScript.

Props:
  - children: ReactNode
  - appName: string        (e.g. "BizAway Analytics", "UN Operational Command")
  - logoSrc?: string
  - navItems?: { label: string; icon?: string; active?: boolean }[]
  - statusBadge?: string   (e.g. "Live Demo", "Prototype")
  - accentColor?: string   (CSS color, default "#5B8DEF")

Visual design:
  - Background: #0A0A0F (near-black)
  - Sidebar: 240px wide, #111118, subtle border-right rgba(255,255,255,0.06)
  - Top bar: 52px, #0D0D14, border-bottom rgba(255,255,255,0.06)
  - Main content area: scrollable, uses children
  - Nav items: 14px, icon left, label, active state = left accent bar + bg rgba(accentColor, 0.12)
  - Status badge: top-right of topbar, pill, accentColor background, white text
  - Monospace clock in top-bar right side (updates every second with setInterval)
  - CSS variables used: --dash-accent, --dash-bg, --dash-surface — set via inline style on root

Variants (via CSS data attribute [data-theme]):
  - data-theme="dark": default dark (above)
  - data-theme="travel": teal accent, slightly warmer dark bg
  - data-theme="un": UN blue (#009EDB) accent

Export as default. Export DashboardCard (a surface card for use inside the shell):
  DashboardCard props: children, title?, span?: 1|2|3 (grid columns), noPad?: boolean
```

---

### PROMPT F — DesignSystemCommandCenter (Brad Frost Style)

```
Create a page at app/demos/design-system/page.tsx and supporting component at components/demos/DesignCommandCenter.tsx.

This is an interactive design system browser — inspired by Brad Frost's Atomic Design methodology.
It should demonstrate a design system from my BizAway case study.

Stack: Next.js, React, Tailwind CSS, TypeScript. No external component libraries.

DesignCommandCenter component:
  Props: none (self-contained with mock data)

Data model (hardcode realistic mock data):
  - Atoms: Button (variants: primary, secondary, ghost, danger), Input, Badge, Avatar, Tooltip, Spinner
  - Molecules: SearchField, FormGroup, NotificationItem, MetricCard, TagGroup
  - Organisms: DataTable, NavigationBar, FilterPanel, SummaryCard

UI Layout:
  - Left sidebar (280px): tree navigation — Atoms / Molecules / Organisms as collapsible groups
    - Each item shows component name + token count badge
  - Main panel: shows selected component
    - Component preview area (white + dark background toggle)
    - Variant switcher row (pills for each variant)
    - Props table: Name | Type | Default | Description
    - Token usage: list of design tokens consumed (e.g. --color-primary, --spacing-4)
    - "Copy code" button (copies a JSX snippet to clipboard)
  - Right panel (240px, collapsible): Token inspector
    - Shows raw CSS variable values (color swatches, spacing scale)
    - Search tokens input

Interaction:
  - Clicking a component in sidebar: updates main panel with fade transition
  - Variant switcher: live re-renders the preview
  - Dark/light preview toggle: flips background behind component preview only
  - Token inspector search: filters token list live

Components to actually render (not images):
  - Button component: render real interactive buttons in the preview using Tailwind
  - Badge: render coloured pill badges
  - Others: show styled placeholder blocks with the correct shape/colour

The page (app/demos/design-system/page.tsx) should:
  - Use DarkDashboardShell with appName="Design System Command Center" and statusBadge="Live Demo"
  - Render DesignCommandCenter as main content
  - Add metadata (title, description)
```

---

### PROMPT G — VideoWalkthrough Refactor

```
Refactor components/VideoWalkthrough.tsx in my Next.js portfolio.

Current state: hardcoded to Guardian project with a single video.
Target: generic, data-driven component that can be used for any project.

New props interface:
  - quote: string
  - videoSrc: string
  - posterSrc?: string
  - projectLabel: string        // e.g. "FEATURED PROJECT"
  - projectTitle: string
  - projectDescription: string
  - tags: string[]
  - caseStudyHref: string
  - accentColor?: string        // for tag badges, defaults to #1A1814

Keep the existing visual design exactly as-is. Only change hardcoded values to props.
Update the usage in app/page.tsx to pass these props explicitly from the Guardian case study data.
Export the new props type as VideoWalkthroughProps.
```

---

### PROMPT H — TagBadge Extraction

```
Extract the inline tag/category badge pattern from components/CaseStudyGrid.tsx into a standalone component.

Create components/ui/TagBadge.tsx with:
  - Props: { label: string; colorScheme?: "auto" | { bg: string; color: string } }
  - When colorScheme="auto" (default), look up from the CATEGORY_COLORS map (move that map into this file as a const)
  - When colorScheme is an object, use those exact values
  - Small size: px-2 py-0.5 text-[11px] font-medium tracking-wide rounded-full uppercase
  - Export CATEGORY_COLORS from this file too

Create components/ui/TagList.tsx:
  - Props: { tags: string[]; className?: string }
  - Renders a flex-wrap row of TagBadge components

Update CaseStudyGrid.tsx to import and use TagBadge and TagList instead of inline implementations.
```

---

## 5. Architecture Improvements

### A — Route Architecture

Add a `/demos` prefix for all standalone demo experiences:

```
app/demos/
  page.tsx               ← demos hub / index page
  travel/page.tsx        ← BizAway travel platform
  un-dashboard/page.tsx  ← UN operational dashboard
  design-system/page.tsx ← Brad Frost command center
```

Add a shared `DemoPageLayout` that wraps demos with:
- "Exit demo" breadcrumb back to case study
- Full-viewport, overflow-hidden treatment
- `statusBadge` indicating prototype vs live

### B — Data Layer Improvement

The `CaseStudy` type in `data/caseStudies.ts` is well-structured. Extend it:

```typescript
// Add to CaseStudy interface:
demoUrl?: string              // e.g. "/demos/travel"
timelineEntries?: TimelineEntry[]   // for ProjectTimeline
askContext?: string           // extra context string for AI assistant
videoWalkthrough?: {
  src: string
  poster?: string
  quote: string
}
```

### C — CSS Variable Extension

Add dark-mode-compatible surface variables to `globals.css`:

```css
/* Add to :root */
--color-demo-bg: #0A0A0F;
--color-demo-surface: #111118;
--color-demo-border: rgba(255, 255, 255, 0.06);
--color-demo-text: rgba(255, 255, 255, 0.9);
--color-demo-text-muted: rgba(255, 255, 255, 0.45);
```

This lets dark demo shells use consistent tokens without inline styles.

### D — Performance: Image & Video Lazy Loading

Current `VideoWalkthrough` and `CaseStudyGrid` load eagerly. Add:

```tsx
// In CaseStudyGrid: use Next.js Image with priority={i === 0}
<Image priority={i === 0} loading={i === 0 ? "eager" : "lazy"} ... />

// In VideoWalkthrough: defer video load until IntersectionObserver fires
// Add loading="lazy" and only set src after intersection
```

### E — MetricsStrip Data Extraction

Move `MetricsStrip`'s hardcoded `metrics` array to `data/metrics.ts`. Then import it.
This enables the metrics to be updated from one place and used in other layouts.

---

## 6. Interaction Design Ideas

### MetricsStrip Enhancements
- **Animated number counters**: on first scroll into view, stats count up from 0 using `requestAnimationFrame`
- **Click-to-navigate on hover items**: the hover links already exist — add a subtle swipe-in micro-animation on the hover reveal
- **Mobile accordion**: on < 640px, make each MetricCard tappable to expand/collapse (currently shows all on hover only)

### CaseStudyGrid Enhancements
- **Filter bar**: add category filter pills above the grid — clicking "DESIGN SYSTEMS" filters to matching cards with a smooth height animation
- **Cursor trail**: the existing `CustomCursor` data-cursor="card" attribute is already in the grid — verify it's wired up globally
- **Skeleton loading**: add a skeleton shimmer loader for the grid while case study data loads (helpful for any future server components)

### Case Study Page Enhancements
- **Reading progress bar**: thin `accentColor` line at top of viewport that fills as user scrolls the case study
- **Section anchors**: add `id` attrs to major sections + a floating "jump to" dot nav on the right side (like Medium's estimated read positions)
- **Image lightbox**: clicking case study images should open a full-screen lightbox with keyboard navigation (prev/next)

### Demo Environment Interactions
- **"I'm a designer, show me the real thing" CTA**: on each case study, add a CTA that jumps to the `/demos/[project]` page
- **Demo annotation layer**: overlay numbered circles on demo screenshots that expand with designer notes on click
- **Prototype mode toggle**: in `DarkDashboardShell`, add a subtle "prototype indicators" toggle that highlights interactive zones with a pulsing border

### VideoWalkthrough Enhancements
- **Chapter markers**: add a `chapters: { time: number; label: string }[]` prop — renders marker dots on the video progress bar
- **Transcript toggle**: "Show transcript" button that slides in a scrollable text panel alongside the video
- **Autoplay on scroll into viewport**: use IntersectionObserver — video plays when 60% visible, pauses when it leaves

---

## 7. Visual Hierarchy Improvements

### Homepage

| Issue | Fix |
|---|---|
| MetricsStrip sits between Hero and Case Studies without visual breathing room | Add 64px gap section with a thin horizontal rule using `--color-ink-muted` at 15% opacity |
| VideoWalkthrough quote and video compete for attention | Make quote italic at 20% larger, add a decorative left-border using `--color-ink` |
| CaseStudyGrid items all the same height | Introduce alternating card sizes — first card full-width, then 2-column, etc. |
| No clear visual priority between case studies | Add a `featured: true` flag to 1-2 case studies; render them with a stronger glass surface and hero image |

### Case Study Pages

| Issue | Fix |
|---|---|
| Process steps feel like a plain list | Use `ProcessStepper` with step numbers as large decorative numerals in cream bg |
| Metrics at top don't draw the eye | Use `MetricsRow` with large animated stat numbers (count-up on enter) |
| Narrative sections have no visual rhythm | Alternate pull-quote callouts with `NarrativeBlock` — every 3rd paragraph becomes a blockquote-style pull |

---

## 8. Component Pattern Summary

Three reusable patterns that cover most of the portfolio's UI needs:

### Pattern 1 — Editorial Surface (cream glass)
`GlassCard + SectionShell + SectionHeader + FadeIn`
Use for: homepage sections, case study narrative blocks, about section.

### Pattern 2 — Media Card (dark hover)
`MediaCard + TagBadge + FadeIn`
Use for: case study grid, featured projects, walkthrough sections.

### Pattern 3 — Dashboard Shell (dark productivity)
`DarkDashboardShell + DashboardCard + [demo-specific components]`
Use for: travel demo, UN dashboard demo, design system command center.

All three patterns share the same type system and data layer (`data/caseStudies.ts`).

---

## 9. Quick Wins (Do These First)

```
1. Extract TagBadge — use PROMPT H — 20 min
2. Add dark variant to SurfaceCard — add variant prop, swap CSS vars — 15 min
3. Refactor VideoWalkthrough — use PROMPT G — 20 min
4. Move MetricsStrip data to data/metrics.ts — 10 min
5. Add count-up animation to MetricCard stats — 30 min
6. Add /demos directory and placeholder pages — 10 min
```

---

*Generated by portfolio-planning-agent scheduled task. Paste any PROMPT section directly into Claude Code to execute.*
