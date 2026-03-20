"use client";

import { useState } from "react";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";

interface LabVideo {
  title: string;
  subtitle: string;
  tags: string[];
  embed: string;
  gradient: string;
  thumbnailSrc: string;
}

const videos: LabVideo[] = [
  {
    title: "AI-Powered EUR-LEX UX + Multimedia Center",
    subtitle: "Exploring AI-assisted legal search and multimedia navigation patterns for complex regulatory systems.",
    tags: ["AI UX", "Legal Tech", "Search Design"],
    embed: "https://www.loom.com/embed/685fc54dcb104d51baa15dcec8727da2",
    gradient: "linear-gradient(135deg, #0A1628 0%, #1A3A5C 50%, #0D2040 100%)",
    thumbnailSrc: "/images/thumbnails/AiPoweredSearch.png",
  },
  {
    title: "AI-Powered Financial Stock Screener",
    subtitle: "Redesigning financial screening workflows to improve filtering, sorting, and comparison of dense financial datasets.",
    tags: ["FinTech", "Filtering Systems", "Data UX"],
    embed: "https://www.loom.com/embed/0dbf0dc67b644224b8abf533f73106fb",
    gradient: "linear-gradient(135deg, #1C0A0A 0%, #3D1010 50%, #140808 100%)",
    thumbnailSrc: "/images/thumbnails/FINVIZ.png",
  },
  {
    title: "Complex Insurance Forms",
    subtitle: "Designing scalable form architectures that support multilingual content, validation logic, and accessible interaction patterns.",
    tags: ["Form Design", "Accessibility", "Insurance"],
    embed: "https://www.loom.com/embed/1a13cb50b6ac4282952f85efa11f9d7e",
    gradient: "linear-gradient(135deg, #1A0A2E 0%, #3A1860 50%, #120820 100%)",
    thumbnailSrc: "/images/thumbnails/HealthForm.png",
  },
  {
    title: "Operational Dashboard — F1 Singapore Grand Prix",
    subtitle: "Designing a high-density operational dashboard inspired by Formula 1 race telemetry and control room systems.",
    tags: ["Dashboard UX", "Data Visualisation", "Operational Design"],
    embed: "https://www.loom.com/embed/f93c664f6668417c81dbb774a2a7a4a3",
    gradient: "linear-gradient(135deg, #0D1B10 0%, #1A3820 50%, #0A1410 100%)",
    thumbnailSrc: "/images/thumbnails/FormularOne.png",
  },
];

export default function CtrlAltDesignSection() {
  const [activeVideo, setActiveVideo] = useState<LabVideo | null>(null);

  return (
    <section id="design-lab" className="bg-[#F8F5F0] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <p className="section-label mb-3">— Design Lab</p>
          <h2
            className="font-display font-extrabold text-[#1A1814] tracking-tight leading-none"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            CTRL_ALT_DESIGN
          </h2>
          <p className="mt-3 max-w-md" style={{ fontSize: "16px", color: "#8A8480", lineHeight: "1.6" }}>
            Rapid investigations into complex interaction patterns, system dashboards, and AI-assisted workflows.
          </p>
        </div>

        <div className="divider mb-10" />

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard
              key={video.title}
              title={video.title}
              subtitle={video.subtitle}
              tags={video.tags}
              gradient={video.gradient}
              embedUrl={video.embed}
              thumbnailSrc={video.thumbnailSrc}
              onClick={() => setActiveVideo(video)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
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
    </section>
  );
}
