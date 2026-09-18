"use client";

import { useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import Card from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";

/* One chip treatment for every lab category — the five-hue system read as
 * templated. Ink chip, parchment text (18.6:1), periwinkle accent border. */
const LAB_CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "AI UX": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "FINTECH": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "FORM DESIGN": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "DASHBOARD": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "INTERACTIVE": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
};

type LabMaturity = "Live" | "Prototype" | "Exploration" | "Concept";

export interface LabVideo {
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  embed: string;
  gradient: string;
  thumbnailSrc: string;
  /* honest maturity (Elleta, 21 Jul; taxonomy recorded in DESIGN.md) */
  maturity: LabMaturity;
  /** first added to the site (git history); orders the Work list */
  added: string;
}

export interface LabPrototype {
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  href: string;
  gradient: string;
  thumbnailSrc: string | null;
  maturity: LabMaturity;
  /** first added to the site (git history); orders the Work list */
  added: string;
}

export const LAB_VIDEOS: LabVideo[] = [
  {
    title: "AI-Powered EUR-LEX UX + Multimedia Center",
    maturity: "Exploration",
    subtitle: "Exploring AI-enabled legal search and multimedia navigation patterns for complex regulatory systems.",
    category: "AI UX",
    tags: ["AI UX", "Legal Tech", "Search Design"],
    embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 50%, #0D2040 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/AIPoweredSearch.png",
    added: "2026-03-20",
  },
  {
    title: "Complex Insurance Forms",
    maturity: "Exploration",
    subtitle: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
    category: "FORM DESIGN",
    tags: ["Form Design", "Accessibility", "Insurance"],
    embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #3A1860 50%, #120820 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/HealthForm.png",
    added: "2026-03-20",
  },
  {
    title: "Operational Dashboard, F1 Singapore Grand Prix",
    maturity: "Exploration",
    subtitle: "Designing a high-density operational dashboard inspired by Formula 1 race telemetry and control room systems.",
    category: "DASHBOARD",
    tags: ["Dashboard UX", "Data Visualisation", "Operational Design"],
    embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
    gradient: "linear-gradient(135deg, #0D1B10 0%, #1A3820 50%, #0A1410 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/FormularOne.png",
    added: "2026-03-20",
  },
];

export const LAB_PROTOTYPES: LabPrototype[] = [
  /* Lab cards addendum v2 (Elleta, 20 Jul): the screener card now
     opens the REAL screener concept (prototypes/finviz-3, published to
     /demos/finviz-3.html); the solution canvas gets its own STRATEGY
     card below, the process story that leads here. */
  {
    /* TODO(elleta): subtitle wording is a proposal, reword freely */
    title: "AI-Powered Financial Stock Screener",
    maturity: "Prototype",
    subtitle: "Clickable AI screener concept: natural-language filters as editable chips, inline metric explainers, and a reasoning trace. Built from the Smashing AI interface patterns.",
    category: "FINTECH",
    tags: ["FinTech", "Filtering Systems", "Data UX"],
    href: "/demos/finviz-3.html",
    gradient: "linear-gradient(135deg, #1C0A0A 0%, #3D1010 50%, #140808 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/finviz-3.png",
    added: "2026-07-20",
  },
  /* Solution Canvas card retired (Elleta, 21 Jul, spec system-page-v2);
     the prototypes/ source stays local. The screener card above stays. */
  {
    title: "Travel Search & Filtering System",
    maturity: "Prototype",
    subtitle: "Interactive prototype exploring unified search, filtering, and booking patterns for a B2B travel platform.",
    category: "INTERACTIVE",
    tags: ["Search UX", "Filtering", "Prototype"],
    href: "/demos/ctrl-travel-v2.html",
    gradient: "linear-gradient(135deg, #0A1628 0%, #132040 60%, #0A1628 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/TRAVEL.png",
    added: "2026-03-23",
  },
  {
    title: "Brad Frost Command Center",
    maturity: "Prototype",
    subtitle: "Design system investigation dashboard, exploring AI-enabled component analysis and governance workflows.",
    category: "INTERACTIVE",
    tags: ["Design Systems", "AI UX", "Dashboard"],
    href: "/demos/brad-frost-command-center.html",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #2D1650 50%, #1A0A2E 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/BradFrostCommandCenter.png",
    added: "2026-03-25",
  },
  {
    title: "Guardian, AI UX Audit Tool",
    maturity: "Prototype",
    subtitle: "Hackathon prototype: AI-enabled UX auditing on a Figma-style canvas, heuristic evaluation, drift detection, and accessibility checks with real-time highlights.",
    category: "INTERACTIVE",
    tags: ["AI UX", "Hackathon", "Governance"],
    href: "/demos/guardian-audit-tool.html",
    gradient: "linear-gradient(135deg, #0F1117 0%, #161822 50%, #0F1117 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/GuardianAuditTool.svg",
    added: "2026-03-30",
  },
  {
    title: "Pattern Mentor, Design Feedback Plugin",
    maturity: "Prototype",
    subtitle: "Evolved from Guardian: cream-glass plugin with pattern citations, inline fix application, documentation push, and a browseable pattern library.",
    category: "INTERACTIVE",
    tags: ["AI UX", "Design Patterns", "Plugin"],
    href: "/demos/pattern-mentor.html",
    gradient: "linear-gradient(135deg, var(--color-semantic-surface) 0%, #E8E3DB 50%, var(--color-semantic-surface) 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/PatternMentor.svg",
    added: "2026-03-30",
  },
];

function PrototypeCard({ prototype }: { prototype: LabPrototype }) {
  return (
    <Card
      href={prototype.href}
      className="h-full"
      media={
        <span style={{ display: "block", position: "absolute", inset: 0, background: prototype.gradient }}>
          {prototype.thumbnailSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prototype.thumbnailSrc} alt="" loading="lazy" />
          )}
        </span>
      }
    >
      <span><StatusPill>{prototype.maturity}</StatusPill></span>
      {/* the ONE content-card title recipe (conformance, 21 Jul) */}
      <h3 className="heading-item" style={{ margin: 0 }}>
        {prototype.title}
      </h3>
      <p className="card-body flex-1" style={{ margin: 0 }}>
        {prototype.subtitle}
      </p>
      <span className="flex flex-wrap items-center gap-2">
        <span className="tag">Try demo →</span>
        {prototype.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </span>
    </Card>
  );
}

/* Off the lead (Work, 18 Sep 2026): ONE equal-card grid, explorations
   then prototypes. The Work page's Section supplies the heading and lede;
   this renders the cards and the video modal only. */
export default function LabGrid() {
  const [activeVideo, setActiveVideo] = useState<LabVideo | null>(null);

  return (
    <>
      <div className="card-grid">
        {LAB_VIDEOS.map((video) => (
          <div key={video.title} className="relative h-full">
            <span className="tag pointer-events-none absolute left-3 top-3 z-10">{video.category}</span>
            <VideoCard
              title={video.title}
              subtitle={video.subtitle}
              tags={video.tags}
              gradient={video.gradient}
              thumbnailSrc={video.thumbnailSrc}
              maturity={video.maturity}
              onClick={() => setActiveVideo(video)}
            />
          </div>
        ))}
        {LAB_PROTOTYPES.map((prototype) => (
          <PrototypeCard key={prototype.title} prototype={prototype} />
        ))}
      </div>

      {activeVideo && (
        <VideoModal
          isOpen={true}
          onClose={() => setActiveVideo(null)}
          embedUrl={activeVideo.embed}
          title={activeVideo.title}
          description={activeVideo.subtitle}
          tags={activeVideo.tags}
        />
      )}
    </>
  );
}
