/**
 * From Drift beat 04 "the foundation": the OUTCOME VISUAL (Elleta 24 Jul),
 * replacing the 9-bar maturity map. The beat closes on what the work
 * WON, so the visual leads with the outcome (green/success) and then a
 * qualitative Before -> After of what changed. In-page and tokenised to
 * BELLA, so it gets dark mode natively from the site theme (no iframe,
 * passes audit:dark by not being an embed). Static by design.
 * Steel plus success green, no iris, no yellow-orange. NDA: qualitative
 * only, no client figures. Recreated, illustrative, abstracted.
 */
const CHANGED = [
  { k: "Owner", before: "One solo designer", after: "A dedicated systems team", win: true },
  { k: "The system", before: "One undocumented file", after: "The foundation they build on" },
  { k: "The UI", before: "Whatever the last sprint shipped", after: "One coherent product language" },
  { k: "The frame", before: "“Our UI looks inconsistent”", after: "“This creates measurable overhead”" },
];

export default function DriftFoundationOutcome() {
  return (
    <div>
      <div className="fnd-outcome">
        <p className="fnd-outcome-lbl">The outcome</p>
        <p className="fnd-outcome-big">The audit won investment for a dedicated design-systems team.</p>
        <p className="fnd-outcome-sub">The system became the foundation the larger team built on.</p>
      </div>

      <p className="fnd-wc-h">What changed</p>
      <div className="fnd-rows">
        {CHANGED.map((r) => (
          <div className="fnd-row" key={r.k}>
            <span className="fnd-k">{r.k}</span>
            <span className="fnd-before">{r.before}</span>
            <span className="fnd-arr" aria-hidden>&rarr;</span>
            <span className={`fnd-after${r.win ? " win" : ""}`}>{r.after}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
