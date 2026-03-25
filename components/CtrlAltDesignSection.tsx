"use client";

import { useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";
import SectionShell from "@/components/ui/SectionShell";
import SectionHeader from "@/components/ui/SectionHeader";

const LAB_CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "AI UX": { bg: "#2A5FA8", color: "#FFFFFF" },
  "FINTECH": { bg: "#6B3FA8", color: "#FFFFFF" },
  "FORM DESIGN": { bg: "#A85F20", color: "#FFFFFF" },
  "DASHBOARD": { bg: "#206B4A", color: "#FFFFFF" },
  "INTERACTIVE": { bg: "#0D6B4A", color: "#FFFFFF" },
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
    subtitle: "Exploring AI-assisted legal search and multimedia navigation patterns for complex regulatory systems.",
    category: "AI UX",
    tags: ["AI UX", "Legal Tech", "Search Design"],
    embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 50%, #0D2040 100%)",
    thumbnailSrc: "/images/thumbnails/AIPoweredSearch.png",
  },
  {
    title: "AI-Powered Financial Stock Screener",
    subtitle: "Redesigning financial screening workflows to improve filtering, sorting, and comparison of dense financial datasets.",
    category: "FINTECH",
    tags: ["FinTech", "Filtering Systems", "Data UX"],
    embed: "https://www.loom.com/embed/0dbf0dc67b644224b8abf533f73106fb",
    gradient: "linear-gradient(135deg, #1C0A0A 0%, #3D1010 50%, #140808 100%)",
    thumbnailSrc: "/images/thumbnails/FINVIZ.png",
  },
  {
    title: "Complex Insurance Forms",
    subtitle: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
    category: "FORM DESIGN",
    tags: ["Form Design", "Accessibility", "Insurance"],
    embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #3A1860 50%, #120820 100%)",
    thumbnailSrc: "/images/thumbnails/HealthForm.png",
  },
  {
    title: "Operational Dashboard — F1 Singapore Grand Prix",
    subtitle: "Designing a high-density operational dashboard inspired by Formula 1 race telemetry and control room systems.",
    category: "DASHBOARD",
    tags: ["Dashboard UX", "Data Visualisation", "Operational Design"],
    embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
    gradient: "linear-gradient(135deg, #0D1B10 0%, #1A3820 50%, #0A1410 100%)",
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
    gradient: "linear-gradient(135deg, #0A1628 0%, #132040 60%, #0A1628 100%)",
    thumbnailSrc: "/images/thumbnails/AIPoweredSearch.png",
  },
  {
    title: "Brad Frost Command Center",
    subtitle: "Design system investigation dashboard — exploring AI-assisted component analysis and governance workflows.",
    category: "INTERACTIVE",
    tags: ["Design Systems", "AI UX", "Dashboard"],
    href: "/demos/brad-frost-command-center.html",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #2D1650 50%, #1A0A2E 100%)",
    thumbnailSrc: null,
  },
];

function PrototypeCard({ prototype }: { prototype: LabPrototype }) {
  const catStyle = LAB_CATEGORY_COLORS[prototype.category] ?? { bg: "#1A1814", color: "#FFFFFF" };

  return (
    <a
      href={prototype.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-elevated flex cursor-pointer flex-col overflow-hidden rounded-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(44,24,16,0.1),0_6px_16px_rgba(44,24,16,0.07)]"
      style={{ textDecoration: "none" }}
    >
      {/* Category badge */}
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
          style={{ background: catStyle.bg, color: catStyle.color, letterSpacing: "0.1em" }}
        >
          {prototype.category}
        </span>
      </div>

      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden" style={{ background: prototype.gradient }}>
        {prototype.thumbnailSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={prototype.thumbnailSrc}
            alt={prototype.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}

        {!prototype.thumbnailSrc && (
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "url(data:image/svg+xml,%3Csvg viewBox=%270 0 200 200%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E)",
              backgroundSize: "160px",
            }}
          />
        )}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.28),transparent_42%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent_28%)]" />

        {/* Interactive icon instead of play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/82 shadow-[0_18px_42px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="3" width="14" height="14" rx="2" stroke="#1A1814" strokeWidth="1.5" />
              <path d="M7 10h6M10 7v6" stroke="#1A1814" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-3 flex items-center gap-2">
          <p className="section-label m-0">INTERACTIVE DEMO</p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
              borderRadius: "999px",
              background: "rgba(13,107,74,0.1)",
              border: "1px solid rgba(13,107,74,0.2)",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 700,
              color: "#0D6B4A",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Try it
          </span>
        </div>
        <h3 className="font-display mb-2 text-[20px] font-bold leading-snug text-[#1A1814]">
          {prototype.title}
        </h3>
        <p className="mb-4 flex-1 text-[15px] leading-[1.65] text-[#8A8480]">
          {prototype.subtitle}
        </p>
        <div className="flex flex-wrap gap-2">
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
    <SectionShell id="design-lab" className="bg-[#F8F5F0]">
      <SectionHeader
        label="— Design Lab"
        title="CTRL_ALT_DESIGN"
        description="Rapid investigations into complex interaction patterns, system dashboards, and AI-assisted workflows."
        className="mb-6"
      />

      <div className="mb-10 h-px w-full bg-black/8" />

      {/* Video explorations */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          const catStyle = LAB_CATEGORY_COLORS[video.category] ?? { bg: "#1A1814", color: "#FFFFFF" };

          return (
            <div key={video.title} className="relative">
              <span
                className="pointer-events-none absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-bold tracking-widest"
                style={{ background: catStyle.bg, color: catStyle.color, letterSpacing: "0.1em" }}
              >
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

      {/* Interactive prototypes */}
      <div style={{ marginTop: "40px" }}>
        <p
          className="section-label"
          style={{ marginBottom: "16px" }}
        >
          — Interactive Prototypes
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
