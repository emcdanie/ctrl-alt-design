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
