import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";
import DesignSystemSpecimens from "@/components/DesignSystemSpecimens";

export const metadata: Metadata = {
  title: "Design system, Elleta McDaniel",
  description:
    "The design system behind elleta.design: tokens, type, controls, and the governance gate, with every value read live from the running stylesheet.",
};

/* §8: the specimens page. Reached from the footer colophon, deliberately
   not a 5th nav item (IA spec caps the nav at four). */
export default function DesignSystemPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section
        className="layout-section"
        style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}
      >
        <div className="layout-container">
          <PageHeader eyebrow="The colophon, expanded" title="Design system" />
          <DesignSystemSpecimens />
        </div>
      </section>
    </main>
  );
}
