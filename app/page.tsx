"use client";

import { useState } from "react";
import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import BubbleCluster from "@/components/BubbleCluster";
import CaseCard from "@/components/CaseCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { WORK_ITEMS } from "@/lib/workLibrary";

/* Surface the work (audit P0, Sil + Justine, 2026-07-23): the top three
 * cases render as one-click cards directly under the hero; the bubble
 * constellation stays, demoted below the work row as the philosophy
 * layer. The hero holds what-you-do + name + portrait. */

const SELECTED_IDS = ["code-first", "drift", "chip"];
const SELECTED = SELECTED_IDS.flatMap((id) => WORK_ITEMS.filter((i) => i.id === id));

export default function Home() {
  // §7: max one primary per view. While the constellation's reveal card
  // (peek) is open it owns the primary, so the hero CTA demotes to
  // secondary; the state lives here because hero and cluster are now
  // separate sections.
  const [peekOpen, setPeekOpen] = useState(false);
  return (
    <main id="main-content">
      <OverlayNav />
      <Hero peekOpen={peekOpen} />

      {/* ── Selected work: the primary path, one click per case ── */}
      <section className="layout-section-tight">
        <div className="page-container">
          <SectionHeader label="Selected Work" title="Start with the" accent="work." />
          <div className="home-work-row">
            {SELECTED.map((i) => (
              <CaseCard key={i.id} item={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Philosophy: the constellation, how the pieces connect ── */}
      <section className="layout-section-tight">
        <div className="page-container">
          <SectionHeader
            label="How I Think"
            title="How the pieces"
            accent="connect."
            description="The constellation behind the cases. Pick a bubble to peek at a piece."
          />
          <div className="philosophy-stage">
            <BubbleCluster onOpenChange={setPeekOpen} />
          </div>
        </div>
      </section>
    </main>
  );
}
