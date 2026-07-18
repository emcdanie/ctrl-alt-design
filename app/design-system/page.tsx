import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import DesignSystemSpecimens from "@/components/DesignSystemSpecimens";

export const metadata: Metadata = {
  title: "Design system, Elleta McDaniel",
  description:
    "The design system behind elleta.design: tokens, type, controls, and the governance gate, with every value read live from the running stylesheet.",
};

/* The System page (phase 1, 2026-07-17): in the primary nav (Elleta's
   decision supersedes the four-item cap; IA spec updated). The page is
   the system inspecting itself, live values only. */
export default function DesignSystemPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      {/* D1 (Pass D): the specimens render as full-width bands, each
          with its own inner 1240 container; only the header keeps the
          page-level container */}
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="BELLA, the system behind the site" title="Design system" />
        </div>
        <DesignSystemSpecimens />
      </section>
    </main>
  );
}
