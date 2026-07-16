import type { Metadata } from "next";
import OverlayNav from "@/components/OverlayNav";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Point of view, Elleta McDaniel",
  description:
    "How I think about design systems: systems are agreements, governance stops the drift, and reading code keeps design and engineering honest.",
};

/* Hub target from the bubble hero. Phase 2 stub — the three theses the
 * hub card previews, expanded a paragraph each. Full essay lands with
 * the Phase 4 content pass. */
const THESES = [
  {
    title: "Systems are agreements, not component libraries.",
    body: "A component library is an artefact. The system is the set of agreements around it, what counts as a pattern, who decides, when to extend versus build. When only the artefact exists, every team renegotiates those agreements ad hoc, and that is where drift starts.",
  },
  {
    title: "Governance is what stops the drift.",
    body: "Drift is not a tooling failure; it is a decision-making failure. Naming, token structure, and contribution flow are governance surfaces. The systems that hold are the ones where the cheap path and the correct path are the same path.",
  },
  {
    title: "I read code, so design and engineering stay honest.",
    body: "Parity between Figma and production is a claim that has to be checked in both directions. Reading the code, tokens, props, rendered output, is how I keep the design side accountable to what actually ships, and vice versa.",
  },
];

export default function PointOfViewPage() {
  return (
    <main id="main-content">
      <OverlayNav />
      <section className="layout-section" style={{ paddingTop: "calc(var(--header-height) + var(--spacing-16))" }}>
        <div className="layout-container" style={{ maxWidth: "760px" }}>
          <PageHeader eyebrow="Point of view" title="How I think about design systems" variant="bubble" />

          {THESES.map((t) => (
            <article key={t.title} style={{ marginBottom: "var(--spacing-8)" }}>
              <h2 style={{ fontSize: "var(--font-subsection)", lineHeight: 1.2, marginBottom: "var(--spacing-3)" }}>
                {t.title}
              </h2>
              <p style={{ fontSize: "var(--font-body-size)", maxWidth: "65ch" }}>{t.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
