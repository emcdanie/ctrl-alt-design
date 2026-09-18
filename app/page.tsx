import OverlayNav from "@/components/OverlayNav";
import Hero from "@/components/Hero";
import CaseCard from "@/components/CaseCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { WORK_ITEMS } from "@/lib/workLibrary";

/* Surface the work (audit P0, reviewer feedback, 2026-07-23): the top three
 * cases render as one-click cards directly under the hero. The hero holds
 * what-you-do + name + portrait. */

const SELECTED_IDS = ["code-first", "drift", "chip"];
const SELECTED = SELECTED_IDS.flatMap((id) => WORK_ITEMS.filter((i) => i.id === id));

export default function Home() {
  return (
    <main id="main-content">
      <OverlayNav />
      <Hero />

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

    </main>
  );
}
