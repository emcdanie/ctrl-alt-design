/**
 * From Drift beat 03 "the governance": the STATUS BOARD (Elleta 24 Jul).
 * The beat argues "govern with status, not enforcement", so the visual
 * foregrounds component STATUS and the proposal path, not a generic
 * variants doc. In-page and tokenised to BELLA, so it gets dark mode
 * natively from the site theme (no iframe, passes audit:dark by not being
 * an embed). Static by design: the deliberate still beat in the rhythm.
 * Steel plus status semantics, no iris, no yellow-orange. Recreated, illustrative,
 * abstract: generic component names, no client data.
 *
 * The board and the proposal line carry data-t (Elleta, 20 Sep 2026), so
 * the case's linked phrases can point at either half of it.
 */
/* mock v4 rows (21 Sep): the shape carries the status with the word,
   so it never rests on colour alone */
const STATUS_ROWS = [
  { name: "Button", status: "stable", shape: "●", label: "Stable" },
  { name: "Filter chip", status: "review", shape: "◐", label: "In review" },
  { name: "Date range", status: "exp", shape: "◌", label: "Experimental" },
  { name: "Legacy tabs", status: "dep", shape: "×", label: "Deprecated" },
];

export default function DriftStatusBoard() {
  return (
    <div>
      <table className="gov-board">
        <caption className="sr-only">Component status</caption>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody data-t="status">
          {STATUS_ROWS.map((r) => (
            <tr key={r.name}>
              <th scope="row" className="gov-name">
                {r.name}
              </th>
              <td>
                <span className={`gov-badge ${r.status}`}>
                  <span aria-hidden="true">{r.shape}</span> {r.label}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="gov-note" data-t="propose">
        <span className="text-code">Propose a change →</span> one form, checked against the five
        audit questions.
      </p>
    </div>
  );
}
