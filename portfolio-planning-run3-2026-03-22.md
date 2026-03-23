# Portfolio Planning Report — Run 3
**Generated:** 2026-03-22 (Automated) | **Stack:** Next.js · React · Tailwind CSS · Vercel
**Focus this run:** Demo content architecture, homepage bento upgrade, animation system, mobile pass, production readiness

> **Status check from Runs 1 & 2:** The `components/media/`, `components/demos/`, `components/case-study/`, and `app/demos/` directories have not been created yet. Run 3 treats all Run 2 prompts as the active build queue and adds the next layer of detail — particularly for the two demo environments, homepage layout, and production concerns.

---

## 1. Build Queue Status (from previous runs)

```
NOT STARTED — build these first (from Run 2):
  ├── components/ui/TagBadge.tsx          (PROMPT H — 20 min)
  ├── components/media/MediaCard.tsx      (PROMPT A — 45 min)
  ├── components/media/ProjectTimeline.tsx (PROMPT B — 60 min)
  ├── components/media/ResponsivePreview.tsx (PROMPT C — 45 min)
  ├── components/demos/DarkDashboardShell.tsx (PROMPT E — 60 min)
  ├── components/case-study/AskAboutProject.tsx (PROMPT D — 90 min)
  ├── app/api/ask-project/route.ts        (PROMPT D — 30 min)
  └── components/demos/DesignCommandCenter.tsx (PROMPT F — 90 min)

NEW this run:
  ├── TravelPlatformDemo content (PROMPT I)
  ├── UNDashboardDemo content (PROMPT J)
  ├── Homepage bento grid upgrade (PROMPT K)
  ├── Animation orchestration system (PROMPT L)
  └── Vercel + SEO production pass (PROMPT M)
```

---

## 2. New Claude Code Prompts (Run 3)

---

### PROMPT I — TravelPlatformDemo (BizAway)

```
Create a self-contained interactive demo component at components/demos/TravelPlatformDemo.tsx.

This represents the BizAway corporate travel platform — the product I redesigned in my case study.
It should feel like a real B2B SaaS product, not a mockup.

Stack: Next.js, React, Tailwind CSS, TypeScript.
Wrap with: DarkDashboardShell (components/demos/DarkDashboardShell.tsx, data-theme="travel")
  - appName="BizAway Analytics"
  - statusBadge="Live Demo"
  - navItems: Dashboard, Trips, Expenses, Approvals, Reports, Settings

Demo content — render these 4 panels as a CSS grid (2×2):

PANEL 1 — "Active Trips" (DashboardCard, span=2)
  - Table of 5 mock trips:
    Traveller | Route | Dates | Status | Cost
    "Sofia R." | BCN → LHR | Mar 24–26 | In transit | €342
    "Marco B." | MXP → CDG | Mar 25 | Booked | €189
    "Ana T."   | MAD → AMS | Mar 28–30 | Pending approval | €521
    "James K." | LHR → JFK | Apr 2–5 | Booked | €1,204
    "Lea N."   | BCN → BER | Apr 4 | Draft | €267
  - Status badges: colour-coded pills (In transit=teal, Booked=blue, Pending=amber, Draft=muted)
  - Row hover: subtle bg highlight rgba(255,255,255,0.04)
  - "New trip" button top-right (non-functional, visual only)

PANEL 2 — "Monthly Spend" (DashboardCard, span=1)
  - Simple bar chart rendered with pure CSS (no chart library)
  - 6 months of data: Oct €12.4k, Nov €9.8k, Dec €6.1k, Jan €14.2k, Feb €11.7k, Mar €8.3k
  - Each bar: div with height proportional to max value, accent color (#0E9B8A)
  - Month label below, value above bar on hover (CSS :hover only)
  - Y-axis: 3 horizontal dashed lines at 0, €7.5k, €15k

PANEL 3 — "Approval Queue" (DashboardCard, span=1)
  - 3 pending items with Approve/Decline buttons
  - Item format: avatar circle (initials) + name + trip summary + cost
  - "Ana T. · MAD → AMS · €521" — [Approve] [Decline]
  - "Rui P. · LIS → CDG · €340" — [Approve] [Decline]
  - "Kim S. · SEA → SFO · €892" — [Approve] [Decline]
  - Buttons are interactive — clicking Approve removes item with a fade-out animation
  - When all approved: show "All caught up ✓" message

PANEL 4 — "Policy Compliance" (DashboardCard, span=2)
  - 4 compliance metric cards in a row:
    "Advance booking rate" 78% (green if >70%)
    "Policy violations" 3 (red if >0)
    "Avg trip cost" €487 (neutral)
    "CO₂ saved vs fly" 2.1t (green)
  - Each card: large number, label below, trend arrow (↑↓→) with percentage change

No external chart libraries. All visual elements via Tailwind + inline styles.
Export as default.
```

---

### PROMPT J — UNDashboardDemo (UNOG Operational Command)

```
Create a self-contained interactive demo at components/demos/UNDashboardDemo.tsx.

This represents the UNOG operational coordination dashboard I prototyped in my case study.
It should feel like a serious enterprise ops tool — calm, information-dense, high-trust design.

Stack: Next.js, React, Tailwind CSS, TypeScript.
Wrap with: DarkDashboardShell (data-theme="un")
  - appName="UN Operational Command"
  - statusBadge="Prototype"
  - navItems: Overview, Operations, Resources, Alerts, Reports, Settings

Demo content layout — 3-column asymmetric grid (5fr 4fr 3fr):

LEFT COLUMN — "Active Operations" (full height)
  - Title row: "Active Operations" + count badge "12"
  - Scrollable list of 8 operations:
    Each item: status dot + operation name + location + staff count + urgency
    OP-2024-031 | Syria Relief | Damascus | 148 staff | HIGH
    OP-2024-029 | Climate Response | Jakarta | 67 staff | MEDIUM
    OP-2024-028 | Food Security | Nairobi | 203 staff | HIGH
    OP-2024-025 | Displacement | Kabul | 89 staff | CRITICAL
    OP-2024-022 | Water Access | Dakar | 44 staff | LOW
    OP-2024-019 | Health Crisis | Kinshasa | 112 staff | MEDIUM
    OP-2024-017 | Reconstruction | Kyiv | 76 staff | MEDIUM
    OP-2024-014 | Refugee Support | Amman | 155 staff | HIGH
  - Urgency dot colors: CRITICAL=red, HIGH=amber, MEDIUM=blue, LOW=green
  - Clicking an operation highlights it and updates the right panel (simple state)
  - Selected state: left border accent + bg rgba(0,158,219,0.08)

CENTRE COLUMN — "Resource Overview" (top) + "Today's Alerts" (bottom)

Resource Overview (top half):
  - 4 resource utilization bars (label + % bar + value):
    Staff Deployed: 894 / 1200 (74%)
    Vehicles Active: 312 / 450 (69%)
    Supply Requests: 23 pending
    Budget Utilized: $14.2M / $22M (65%)
  - Bars: rounded, accent color fill, bg rgba(255,255,255,0.08)

Today's Alerts (bottom half):
  - 4 alerts with severity icon + message + time:
    🔴 CRITICAL: Supply convoy delayed — OP-2024-025 · 2h ago
    🟡 WARNING: Staff rotation overdue — OP-2024-031 · 5h ago
    🔵 INFO: New resource request submitted · 8h ago
    🟢 RESOLVED: Communication restored — OP-2024-022 · 12h ago
  - Each alert dismissable with × button (removes from list with fade)

RIGHT COLUMN — Operation Detail Panel
  - Shows detail for the selected operation (or OP-2024-025 by default)
  - Sections: Operation ID + name + status + location
  - Key contacts: 3 staff names + roles + avatar initials
  - Recent activity: 3 timestamped log entries
  - Quick actions: 3 buttons (Request Resources, Flag Urgent, Add Note) — visual only

No external libraries. All CSS via Tailwind + inline styles for dark vars.
Export as default.
```

---

### PROMPT K — Homepage Bento Grid Upgrade

```
Refactor the case study grid in components/CaseStudyGrid.tsx to use a bento-style layout.

Current state: all case studies render in a uniform vertical list (flex-col).
Target: editorial bento grid — varying card sizes based on featured flag + position.

Rules:
  - First case study: full-width (100%) — hero bento cell
  - Second + third case study: side by side (50% / 50%) as a pair
  - Fourth case study: full-width
  - Fifth+: side by side pairs again
  - On mobile (<768px): all cards full-width, stacked vertically

Full-width card changes:
  - Layout: image RIGHT (40% width), content LEFT (60%) — horizontal flex
  - Image fills full height of card (object-cover)
  - Show 2-line description text (currently hidden on list cards)
  - Show tags row below description
  - Card min-height: 260px

Half-width card (existing list layout):
  - Keep existing glass-card vertical layout
  - Show tags (currently not shown on small cards)

New prop needed on CaseStudy type (data/caseStudies.ts):
  - featured?: boolean — already intended, add if not present
  - Mark the first 2 case studies as featured: true

Bento grid uses CSS grid:
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 24px (md:28px)

Full-width cells: grid-column: 1 / -1

Keep all existing: FadeIn animations, hover states, cursor="card", glass-card class, category badges.
Do not change routing or data fetching.
```

---

### PROMPT L — Animation Orchestration System

```
Create a lightweight animation utility system for my Next.js portfolio.

Files to create:

1. components/AnimationOrchestrator.tsx
   "use client"
   A context provider + hook that manages staggered entrance animations across a page.

   Exports:
     - AnimationOrchestrator: wraps a page, resets animation state on route change
     - useAnimationReady(): returns boolean — true after a short delay (configurable, default 100ms)
     - useStaggerDelay(index: number, baseDelay?: number): returns delay string (e.g. "200ms")
       - baseDelay default: 60ms per item
       - maximum stagger cap: 600ms total

   Usage: wrap app/layout.tsx children with <AnimationOrchestrator>

2. lib/animations.ts
   Pure animation utility functions (no React):

   export const EASINGS = {
     editorial: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",   // soft ease-out
     snappy:    "cubic-bezier(0.34, 1.56, 0.64, 1)",       // slight bounce
     crisp:     "cubic-bezier(0.4, 0, 0.2, 1)",            // material-style
   } as const

   export function fadeInUpStyle(delay: string, duration = "600ms", easing = EASINGS.editorial) {
     // Returns a React CSSProperties object for a fade-in-up animation
     // Uses opacity + transform: translateY(20px) → translateY(0)
     // Returns the "end state" style — depends on AnimationReady context being true
   }

   export function revealStyle(delay: string, direction: "up"|"left"|"right" = "up") {
     // Returns clip-path reveal style (from hidden to full)
     // up:    clipPath: "inset(100% 0 0 0)" → "inset(0% 0 0 0)"
     // left:  clipPath: "inset(0 0 0 100%)" → "inset(0 0 0 0%)"
   }

3. Update components/FadeIn.tsx:
   - Add direction prop: "up" | "down" | "left" | "right" (default "up")
   - Add easing prop: keyof typeof EASINGS (default "editorial")
   - Use useStaggerDelay internally if no delay prop provided + index prop given
   - Keep backward compatibility (existing usage with delay={number} still works)

No Framer Motion. All animations via CSS transitions + style props.
TypeScript strict mode.
```

---

### PROMPT M — Vercel + SEO Production Pass

```
Perform a production-readiness pass on my Next.js portfolio.

FILE CHANGES NEEDED:

1. app/layout.tsx — Update metadata:
   Replace the current metadata export with a comprehensive one:

   export const metadata: Metadata = {
     title: {
       default: "Elleta Mc — Product Designer",
       template: "%s | Elleta Mc"
     },
     description: "Product designer specialising in design systems, enterprise UX, and complex B2B platforms. Based in Barcelona.",
     keywords: ["product designer", "UX designer", "design systems", "B2B", "Barcelona"],
     authors: [{ name: "Elleta Mc" }],
     creator: "Elleta Mc",
     openGraph: {
       type: "website",
       locale: "en_GB",
       url: "https://ctrl-alt-design.vercel.app",
       siteName: "Elleta Mc Portfolio",
       title: "Elleta Mc — Product Designer",
       description: "...",
       images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "..." }]
     },
     twitter: {
       card: "summary_large_image",
       title: "...",
       description: "...",
       images: ["/og-image.png"]
     },
     robots: {
       index: true,
       follow: true,
       googleBot: { index: true, follow: true, "max-image-preview": "large" }
     }
   }

2. app/case-studies/[slug]/page.tsx — Add generateMetadata:
   export async function generateMetadata({ params }): Promise<Metadata> {
     const cs = caseStudies.find(c => c.slug === params.slug)
     if (!cs) return {}
     return {
       title: cs.title,
       description: cs.overview.headline,
       openGraph: {
         title: cs.title,
         description: cs.overview.headline,
         images: [{ url: cs.heroImage }]
       }
     }
   }

3. app/sitemap.ts — Create this file:
   Generate a sitemap with:
   - "/" (homepage)
   - "/case-studies/[slug]" for each case study in caseStudies array
   - "/demos/travel", "/demos/un-dashboard", "/demos/design-system"
   Use: MetadataRoute.Sitemap type

4. app/robots.ts — Create this file:
   Standard robots config allowing all crawlers, pointing to sitemap.

5. next.config.ts — Add:
   - images.remotePatterns: allow images.unsplash.com (already used in caseStudies.ts)
   - experimental.optimizePackageImports if not already set

6. public/ — Note for manual action:
   Create a 1200×630 OG image as /public/og-image.png
   Suggested design: cream background, "Elleta Mc" in Clash Display, tagline below, small grid of case study images right side.

Keep all existing functionality. TypeScript only.
```

---

### PROMPT N — WalkthroughVideoSection with Chapters

```
Refactor components/VideoWalkthrough.tsx (after PROMPT G has been applied) to add chapter navigation.

New features to add:

1. Chapter markers on the video progress bar
   - Add prop: chapters?: { time: number; label: string }[]
     - time: seconds from start
     - label: chapter name (e.g. "Problem", "Research", "Solution")
   - Render chapters as small dots on a custom progress bar overlay
   - On hover over dot: tooltip showing chapter label + timestamp (mm:ss)
   - Clicking dot: seeks video to that time (videoRef.current.currentTime = chapter.time)

2. Custom video controls (replace native browser controls)
   Replace controls attribute with custom overlay controls:
   - Play/pause button (bottom-left)
   - Custom progress bar (full width, bottom) with chapter dots
   - Current time / duration display (bottom-right)
   - Mute toggle
   - Controls auto-hide after 2s of inactivity (mousemove resets timer)
   - Always visible while paused

3. Transcript toggle panel
   - Add prop: transcript?: { time: number; text: string }[]
   - "Show transcript" button (top-right of video)
   - Clicking opens a slide-in panel to the right (or below on mobile)
   - Panel scrolls in sync with video playback — active line highlighted in accent color
   - Clicking a transcript line seeks video to that time
   - Panel close button

4. Autoplay on scroll
   - Use IntersectionObserver: play when 50% visible, pause when leaving viewport
   - Only autoplay if user has not manually paused (track intent flag)
   - Muted on autoplay (required by browsers)

Keep all existing visual design. Use videoRef with useRef<HTMLVideoElement>.
"use client" — all interactions are client-side.
```

---

## 3. Architecture Additions (Run 3)

### Demo Pages — `app/demos/` Route Setup

```
Create these files to scaffold the demo section:

app/demos/layout.tsx
  - A layout that wraps all demo pages
  - Full viewport height (h-screen overflow-hidden)
  - No portfolio Header/Footer — demos are self-contained
  - "← Back to case study" link (top-left, absolutely positioned, z-50)
    - Uses searchParams to get returnTo=?returnTo=/case-studies/bizaway
    - Renders as a glass pill button in cream/ink colours

app/demos/page.tsx
  - Hub page listing all available demos
  - Uses portfolio's main layout (Header/Footer present)
  - Grid of 3 demo preview cards (travel, un-dashboard, design-system)
  - Each card: screenshot placeholder + demo title + "Launch demo →" link

app/demos/travel/page.tsx
  - Uses DemoPageLayout (not portfolio layout)
  - Renders TravelPlatformDemo
  - Metadata: title "BizAway Travel Platform — Demo"

app/demos/un-dashboard/page.tsx
  - Uses DemoPageLayout
  - Renders UNDashboardDemo
  - Metadata: title "UN Operational Command — Demo"
```

### Case Study → Demo Link Component

```
Create components/case-study/DemoCallout.tsx

A component placed at the top of qualifying case study pages.
Shows a banner: "This project is interactive — explore the working prototype →"

Props:
  demoUrl: string     // e.g. "/demos/travel"
  demoLabel: string   // e.g. "Explore the BizAway prototype"

Design:
  - Banner position: below CaseStudyHero, above first content section
  - Glass surface with a subtle teal/accent left border
  - Icon: small play triangle or arrow
  - Subtle pulse animation on the icon (CSS @keyframes, 2s loop)
  - "View demo" button (ghost style, right-aligned)
  - Passes returnTo parameter: href={`${demoUrl}?returnTo=/case-studies/${slug}`}

Add to: app/case-studies/bizaway/page.tsx and app/case-studies/un-operational-dashboard/page.tsx
```

---

## 4. Visual Hierarchy — Specific Fixes

### Fix 1 — CaseStudyGrid Tag Visibility

Currently no tags render on case study grid cards. Tags are defined in `caseStudies.ts` but not displayed.

```
In CaseStudyGrid.tsx, inside each card's content area, add after the description:
  <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
    {cs.tags.slice(0, 3).map(tag => (
      <TagBadge key={tag} label={tag} />  {/* after PROMPT H */}
    ))}
  </div>
```

### Fix 2 — Hero Section Typographic Scale

The hero uses `clamp(48px, 7vw, 88px)` for the headline. On large monitors (1440px+) this can feel small. Suggested adjustment:

```css
/* In Hero.tsx or inline style: */
font-size: clamp(52px, 6.5vw, 96px);
line-height: 1.05;
letter-spacing: -0.04em;
```

Also add a second line to the hero subheading — current single-line reads flat. Suggest: split into `[role]` + `[specialisation]` on two lines with different weights.

### Fix 3 — ProcessSection Number Treatment

The process step numbers currently render as plain text. Elevate to decorative:

```
In ProcessSection.tsx, change step number rendering:
  From: <span className="text-sm font-mono">{step.number}</span>
  To:   <span
          className="absolute -left-8 top-0 font-display font-black opacity-8 select-none"
          style={{ fontSize: "clamp(48px, 6vw, 72px)", color: "var(--color-ink)", lineHeight: 1 }}
        >
          {step.number}
        </span>
Add: position-relative to the step container.
```

### Fix 4 — MetricsStrip on Mobile

On mobile, the 4 MetricCards compress into an illegible row. Add a horizontal scroll on `<640px`:

```
In MetricsStrip.tsx wrapper div, add:
  className="... overflow-x-auto scrollbar-none -mx-6 px-6 md:overflow-visible md:mx-0 md:px-0"

And on each MetricCard, add:
  minWidth: "160px"  (inline style)
```

---

## 5. Interaction Design — New Ideas (Run 3)

### Idea 1 — "Designer's Notes" Annotation System

For demo pages, add a toggleable annotation overlay:

- A floating "Notes" button (bottom-left of DarkDashboardShell)
- When toggled, numbered yellow circles appear over key UI elements in the demo
- Clicking a circle opens a small popover with a designer note
  - Example on TravelPlatformDemo: "① This approval queue replaced a 5-step email flow — approved in 1 click"
- Notes are hardcoded per demo component
- Popover: glass surface, 240px wide, positioned above the circle
- Keyboard: Escape dismisses active popover

**Claude Code prompt fragment:**
```
Add an annotation layer to DarkDashboardShell.
New prop: annotations?: { id: string; x: string; y: string; note: string }[]
  - x, y: CSS percentage positions ("30%", "45%")
New prop: showAnnotationsToggle?: boolean
Renders an "⊕ Notes" toggle button in the shell footer.
When toggled: annotation circles render as absolute-positioned numbered badges.
```

### Idea 2 — Scroll-Linked Section Progress

On case study pages, add a thin progress bar on the left edge:

- 2px wide, full height of the page
- Fills from top to bottom as user scrolls (tied to `scrollY / (documentHeight - viewportHeight)`)
- Color: `var(--color-accent-espresso)` at 60% opacity
- On hover: expands to 4px and shows section labels alongside it (like a mini TOC)

**Claude Code prompt fragment:**
```
Create components/case-study/ScrollProgress.tsx
"use client"
- 2px fixed left bar (left: 0, top: 0, height: filled%)
- useEffect + scroll listener → setProgress(window.scrollY / (document.body.scrollHeight - window.innerHeight))
- smooth transition: height duration-100
- On md+ screens only (hidden on mobile)
Add to CaseStudyLayout.tsx.
```

### Idea 3 — Soft Cursor Trail for MediaCards

The `CustomCursor` component exists but has limited context. Enhance for the case study grid:

- When cursor enters a `[data-cursor="card"]` element: cursor grows to 48px, shows label "View →"
- When cursor is over a video element: show "▶ Play" label
- When cursor is over a link that goes to a demo: show "Launch demo" label

**Claude Code prompt fragment:**
```
Update components/CustomCursor.tsx:
- Read data-cursor-label attribute from hovered element
- When present: show label text inside cursor circle (12px, white, font-medium)
- data-cursor-label="View →" on CaseStudyGrid links
- data-cursor-label="▶ Play" on video elements
- data-cursor-label="Launch →" on demo links
Transition: label fades in 150ms after cursor enters element.
```

### Idea 4 — "Available for work" Status Badge

Add a subtle animated status indicator to the contact section and Header:

- Small green pulsing dot + "Available for new projects" text
- Pulse: CSS @keyframes ring animation, 2s infinite
- On click: smooth scroll to #contact
- Responsive: on mobile, show in hero area below the subtitle

---

## 6. Component Reuse Patterns (Consolidated — All 3 Runs)

### The 3 Surface Families

| Family | Key Component | Background | Use For |
|---|---|---|---|
| Editorial Cream | `SurfaceCard`, `GlassCard` | `--color-card` + glass | Homepage, case studies, about |
| Dark Productivity | `DarkDashboardShell`, `DashboardCard` | `#0A0A0F` | All demo environments |
| Inline Utility | `TagBadge`, `CategoryPill`, `MetricsRow` | Transparent | Annotations within both families |

### The Data-to-UI Mapping

```
data/caseStudies.ts
  └── CaseStudy.slug          → URL routing, AskAboutProject context
  └── CaseStudy.tags          → TagBadge list in CaseStudyGrid + case study header
  └── CaseStudy.metrics       → MetricsRow on case study pages
  └── CaseStudy.process.steps → ProcessStepper
  └── CaseStudy.timelineEntries (new) → ProjectTimeline
  └── CaseStudy.demoUrl (new) → DemoCallout banner
  └── CaseStudy.videoWalkthrough (new) → VideoWalkthrough

data/metrics.ts (extract from MetricsStrip)
  └── MetricItem[]            → MetricsStrip homepage section
```

---

## 7. Quick Wins — Run 3 Additions

```
1. Add tags to CaseStudyGrid cards — 10 min (copy from Fix 1 above)
2. Fix MetricsStrip mobile overflow — 5 min (copy from Fix 4 above)
3. Update hero font size clamp — 5 min (copy from Fix 2 above)
4. Create app/demos/layout.tsx scaffold — 15 min
5. Add generateMetadata to case study [slug] page — 20 min (PROMPT M, item 2 only)
6. Create app/sitemap.ts — 15 min (PROMPT M, item 3 only)
7. Add data-cursor-label to CaseStudyGrid links — 10 min
```

---

## 8. Suggested Execution Order (Complete Portfolio Build)

For a single focused build session, execute in this order:

```
SESSION A — Foundation (3–4 hrs)
  1. TagBadge extraction (PROMPT H)
  2. FadeIn upgrades + lib/animations.ts (PROMPT L)
  3. CaseStudyGrid bento upgrade (PROMPT K)
  4. Fix mobile MetricsStrip overflow (Fix 4)
  5. Add tags to grid cards (Fix 1)

SESSION B — Demo Shell (2–3 hrs)
  6. DarkDashboardShell (PROMPT E)
  7. app/demos/ layout + scaffold (Architecture — Demo Pages)
  8. TravelPlatformDemo (PROMPT I)
  9. UNDashboardDemo (PROMPT J)

SESSION C — Case Study Enhancements (3–4 hrs)
  10. VideoWalkthrough refactor (PROMPT G)
  11. VideoWalkthrough chapters (PROMPT N)
  12. MediaCard (PROMPT A)
  13. ProjectTimeline (PROMPT B)
  14. ResponsivePreview (PROMPT C)
  15. ScrollProgress sidebar (Idea 2)
  16. DemoCallout banner (Architecture — Demo Link Component)

SESSION D — AI + Design System (3–4 hrs)
  17. AskAboutProject + API route (PROMPT D)
  18. DesignCommandCenter (PROMPT F)
  19. AnimationOrchestrator (PROMPT L)

SESSION E — Production (1–2 hrs)
  20. SEO + metadata pass (PROMPT M)
  21. CustomCursor enhancements (Idea 3)
  22. "Available for work" badge (Idea 4)
  23. Designer's Notes annotation system (Idea 1)
```

---

*Generated by portfolio-planning-agent scheduled task — Run 3. Paste any PROMPT section directly into Claude Code to execute. Previous runs: portfolio-planning-2026-03-22.md (Run 1), portfolio-planning-run2-2026-03-22.md (Run 2).*
