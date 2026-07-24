/**
 * From Drift beat 03 "the governance": the STATUS BOARD (Elleta 24 Jul).
 * The beat argues "govern with status, not enforcement", so the visual
 * foregrounds component STATUS and the proposal path, not a generic
 * variants doc. In-page and tokenised to BELLA, so it gets dark mode
 * natively from the site theme (no iframe, passes audit:dark by not being
 * an embed). Static by design: the deliberate still beat in the rhythm.
 * Steel plus status semantics, no iris, no yellow-orange. Recreated, illustrative,
 * abstract: generic component names, no client data.
 */
const STATUS_ROWS = [
  { name: "Button", status: "stable", label: "Stable", asks: "Use freely" },
  { name: "Input", status: "stable", label: "Stable", asks: "Use freely" },
  { name: "Select", status: "review", label: "In review", asks: "Usable, may still change" },
  { name: "Date field", status: "exp", label: "Experimental", asks: "Opt in, expect change" },
  { name: "Legacy modal", status: "dep", label: "Deprecated", asks: "Migrate to Modal" },
];

export default function DriftStatusBoard() {
  return (
    <div>
      <p className="gov-h">Component status</p>
      <div className="gov-board">
        {STATUS_ROWS.map((r) => (
          <div className="gov-row" key={r.name}>
            <span className="gov-name">{r.name}</span>
            <span className={`gov-badge ${r.status}`}>{r.label}</span>
            <span className="gov-asks">{r.asks}</span>
          </div>
        ))}
      </div>

      <div className="gov-path-wrap">
        <p className="gov-h">The proposal path</p>
        <div className="gov-path">
          <span className="gov-step">Propose</span>
          <span className="gov-parr" aria-hidden>&rarr;</span>
          <span className="gov-step">In review</span>
          <span className="gov-parr" aria-hidden>&rarr;</span>
          <span className="gov-step on">Stable</span>
        </div>
        <p className="gov-note">
          <b>Status signals maturity, it does not block.</b> Anyone can propose; adoption is what
          promotes a pattern. Nothing is enforced, so nothing gets worked around.
        </p>
      </div>
    </div>
  );
}
