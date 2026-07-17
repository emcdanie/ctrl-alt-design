"use client";

import { useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";

/* One chip treatment for every lab category — the five-hue system read as
 * templated. Ink chip, parchment text (18.6:1), periwinkle accent border. */
const LAB_CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "AI UX": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "FINTECH": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "FORM DESIGN": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "DASHBOARD": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
  "INTERACTIVE": { bg: "var(--color-brand-ink)", color: "var(--ink-on-dark-strong)" },
};

interface LabVideo {
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  embed: string;
  gradient: string;
  thumbnailSrc: string;
}

interface LabPrototype {
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  href: string;
  gradient: string;
  thumbnailSrc: string | null;
}

const videos: LabVideo[] = [
  {
    title: "AI-Powered EUR-LEX UX + Multimedia Center",
    subtitle: "Exploring AI-enabled legal search and multimedia navigation patterns for complex regulatory systems.",
    category: "AI UX",
    tags: ["AI UX", "Legal Tech", "Search Design"],
    embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 50%, #0D2040 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/AIPoweredSearch.png",
  },
  {
    title: "AI-Powered Financial Stock Screener",
    subtitle: "Redesigning financial screening workflows to improve filtering, sorting, and comparison of dense financial datasets.",
    category: "FINTECH",
    tags: ["FinTech", "Filtering Systems", "Data UX"],
    embed: "https://www.loom.com/embed/0dbf0dc67b644224b8abf533f73106fb",
    gradient: "linear-gradient(135deg, #1C0A0A 0%, #3D1010 50%, #140808 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/FINVIZ.png",
  },
  {
    title: "Complex Insurance Forms",
    subtitle: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
    category: "FORM DESIGN",
    tags: ["Form Design", "Accessibility", "Insurance"],
    embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #3A1860 50%, #120820 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/HealthForm.png",
  },
  {
    title: "Operational Dashboard, F1 Singapore Grand Prix",
    subtitle: "Designing a high-density operational dashboard inspired by Formula 1 race telemetry and control room systems.",
    category: "DASHBOARD",
    tags: ["Dashboard UX", "Data Visualisation", "Operational Design"],
    embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
    gradient: "linear-gradient(135deg, #0D1B10 0%, #1A3820 50%, #0A1410 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/FormularOne.png",
  },
];

const prototypes: LabPrototype[] = [
  {
    title: "Travel Search & Filtering System",
    subtitle: "Interactive prototype exploring unified search, filtering, and booking patterns for a B2B travel platform.",
    category: "INTERACTIVE",
    tags: ["Search UX", "Filtering", "Prototype"],
    href: "/demos/ctrl-travel-v2.html",
    gradient: "linear-gradient(135deg, #0A1628 0%, #132040 60%, #0A1628 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/TRAVEL.png",
  },
  {
    title: "Brad Frost Command Center",
    subtitle: "Design system investigation dashboard, exploring AI-enabled component analysis and governance workflows.",
    category: "INTERACTIVE",
    tags: ["Design Systems", "AI UX", "Dashboard"],
    href: "/demos/brad-frost-command-center.html",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #2D1650 50%, #1A0A2E 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/BradFrostCommandCenter.png",
  },
  {
    title: "Guardian, AI UX Audit Tool",
    subtitle: "Hackathon prototype: AI-enabled UX auditing on a Figma-style canvas, heuristic evaluation, drift detection, and accessibility checks with real-time highlights.",
    category: "INTERACTIVE",
    tags: ["AI UX", "Hackathon", "Governance"],
    href: "/demos/guardian-audit-tool.html",
    gradient: "linear-gradient(135deg, #0F1117 0%, #161822 50%, #0F1117 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/GuardianAuditTool.svg",
  },
  {
    title: "Pattern Mentor, Design Feedback Plugin",
    subtitle: "Evolved from Guardian: cream-glass plugin with pattern citations, inline fix application, documentation push, and a browseable pattern library.",
    category: "INTERACTIVE",
    tags: ["AI UX", "Design Patterns", "Plugin"],
    href: "/demos/pattern-mentor.html",
    gradient: "linear-gradient(135deg, var(--color-semantic-surface) 0%, #E8E3DB 50%, var(--color-semantic-surface) 100%)", // token-waiver: cover artwork gradient (no token equivalent; expression pass later)
    thumbnailSrc: "/images/thumbnails/PatternMentor.svg",
  },
];

function PrototypeCard({ prototype }: { prototype: LabPrototype }) {
  return (
    <a
      href={prototype.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-elevated flex h-full cursor-pointer flex-col overflow-hidden rounded-[var(--radius-2xl)] transition-all duration-300 hover:-translate-y-1"
      style={{ textDecoration: "none" }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[var(--radius-2xl)]" style={{ background: prototype.gradient }}>
        {prototype.thumbnailSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prototype.thumbnailSrc}
            alt={prototype.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Hover overlay with CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/20">
          <span
            className="rounded-full border border-[color:var(--color-semantic-border-glass-edge)] bg-[color:var(--color-glass-strong)] px-5 py-2.5 text-[length:var(--typography-font-size-tag)] font-semibold text-[color:var(--color-ink)] opacity-0 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Try Demo →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="mb-2 text-[length:var(--typography-font-size-lg)] font-bold leading-snug text-[color:var(--color-ink)]"
          style={{ fontFamily: "var(--font-body)", maxWidth: "320px" }}
        >
          {prototype.title}
        </h3>
        <p
          className="mb-4 flex-1 text-[length:var(--typography-font-size-sm)] leading-[1.65]"
          style={{ color: "var(--color-muted)", maxWidth: "380px" }}
        >
          {prototype.subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {prototype.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export default function CtrlAltDesignSection() {
  const [activeVideo, setActiveVideo] = useState<LabVideo | null>(null);

  return (
    <SectionShell id="design-lab" className="bg-[var(--color-semantic-background)]">
      <SectionHeader
        label="Design Lab"
        title="CTRL_ALT_DESIGN"
        description="Rapid investigations into complex interaction patterns, system dashboards, and AI-enabled workflows."
        className="mb-6"
      />

      <div className="mb-10 h-px w-full bg-black/8" />

      {/* Video explorations, fixed 2-col on tablet+ (data is exactly 4 items
          → 2×2 grid, no orphan). Stacks to single col below 768px.
          Equal heights via items-stretch (BELLA Rule 2). */}
      <div className="grid grid-cols-1 items-stretch md:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
        {videos.map((video) => {
          return (
            <div key={video.title} className="relative h-full">
              <span className="tag pointer-events-none absolute left-3 top-3 z-10">
                {video.category}
              </span>
              <VideoCard
                title={video.title}
                subtitle={video.subtitle}
                tags={video.tags}
                gradient={video.gradient}
                embedUrl={video.embed}
                thumbnailSrc={video.thumbnailSrc}
                onClick={() => setActiveVideo(video)}
              />
            </div>
          );
        })}
      </div>

      {/* Interactive prototypes, same 2-col pattern. Data trimmed to exactly
          4 items (was 5, F1 Grand Prix Analytics removed; that project is
          already represented in the Videos grid above). */}
      <div style={{ marginTop: "var(--spacing-12)" }}>
        <SectionHeader
          label="Interactive Work"
          title="Interactive product experiments"
          description="Real prototypes exploring complex interaction patterns, system logic, and workflow design."
          className="mb-10"
        />
        <div className="grid grid-cols-1 items-stretch md:grid-cols-2" style={{ gap: "var(--grid-gap)" }}>
          {prototypes.map((prototype) => (
            <PrototypeCard key={prototype.title} prototype={prototype} />
          ))}
        </div>
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
    </SectionShell>
  );
}
