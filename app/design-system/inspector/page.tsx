import type { Metadata } from "next";
import Section from "@/components/layout/Section";
import TokenInspector from "@/components/TokenInspector";

export const metadata: Metadata = {
  title: "Token inspector",
  robots: { index: false },
};

/* Chromeless: exists to be embedded as case evidence (Code First) via the
   one embed render path. The full page is /design-system. One layout
   Section, centred in the frame; no nav, so it does not clear one. */
export default function InspectorEmbedPage() {
  return (
    <main id="main-content" className="embed-page">
      <Section labelledBy="inspector-title">
        {/* chromeless embed still needs a page heading (axe
            page-has-heading-one); visually silent */}
        <h1 id="inspector-title" className="sr-only">
          Token inspector
        </h1>
        <TokenInspector />
      </Section>
    </main>
  );
}
