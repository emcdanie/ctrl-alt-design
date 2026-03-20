"use client";

import Link from "next/link";

const GRADIENT = "linear-gradient(135deg, #0A0A1C 0%, #1A1A3A 50%, #080814 100%)";

export default function VideoWalkthrough() {
  return (
    <section className="bg-[#F8F5F0] py-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Italic headline */}
        <h2 className="font-display font-bold italic text-[#1A1814] leading-snug text-center mb-10 max-w-2xl mx-auto" style={{ fontSize: "clamp(32px, 4vw, 42px)" }}>
          "Designing clarity for complex digital platforms and scaling teams."
        </h2>

        {/* Looping video */}
        <div
          className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.12)] mb-8"
          style={{ background: GRADIENT }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hackathon-showreel.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Video info */}
        <div className="max-w-2xl">
          <p className="section-label mb-3">FEATURED PROJECT</p>
          <h3 className="font-display font-medium text-[1.4rem] text-[#1A1814] mb-3 leading-snug">
            Guardian — AI-Powered Design System Governance
          </h3>
          <p className="text-[15px] text-[#4A4640] leading-relaxed mb-5">
            A hackathon concept created during the Into Design Systems hackathon exploring how AI could help detect design drift, support accessibility, and maintain consistency between design systems and implementation.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["Design Systems", "Hackathon", "AI UX", "Governance"].map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <Link
            href="/guardian"
            className="inline-flex items-center gap-1 text-[15px] font-medium text-[#1A1814] hover:opacity-60 transition-opacity duration-200"
          >
            View Full Case Study →
          </Link>
        </div>

      </div>
    </section>
  );
}
