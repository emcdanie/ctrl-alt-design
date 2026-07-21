import type { Metadata } from "next";
import TokenInspector from "@/components/TokenInspector";

export const metadata: Metadata = {
  title: "Token inspector",
  robots: { index: false },
};

/* Chromeless: exists to be embedded as case evidence (Code First) via the
   one embed render path. The full page is /design-system. */
export default function InspectorEmbedPage() {
  return (
    <main
      id="main-content"
      className="layout-container"
      style={{
        minHeight: "100dvh",
        display: "grid",
        alignItems: "center",
        padding: "var(--spacing-6)",
        background: "var(--color-semantic-background)",
      }}
    >
      {/* chromeless embed still needs a page heading (axe
          page-has-heading-one); visually silent */}
      <h1 className="sr-only">Token inspector</h1>
      <TokenInspector />
    </main>
  );
}
