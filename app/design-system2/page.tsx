import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import DesignSystem2 from "@/components/DesignSystem2";
import DesignSystemNav from "@/components/DesignSystemNav";

export const metadata: Metadata = {
  title: "Design system, take 2, Elleta McDaniel",
  description:
    "The design system behind elleta.design: tokens, type, controls, and the governance gate, with every value read live from the running stylesheet.",
  /* the A/B comparison page must not compete with /design-system in
     search while both render; the follow-up deletes the loser */
  robots: { index: false },
};

/* The SECOND System page (Elleta's brief, 22 Jul 2026): the modeless
   grammar on BELLA, reachable by URL only, no nav entry. She compares
   this against /design-system and picks one; the loser is deleted in
   a follow-up, never left rendering. */
export default function DesignSystem2Page() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section ds2-page"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="ds-layout">
          {/* the map rail, reused UNMODIFIED: same sections, same ids,
              description slots already TODO(elleta) */}
          <DesignSystemNav />
          <div className="ds-layout__content">
            <div className="layout-container">
              <DesignSystem2 />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
