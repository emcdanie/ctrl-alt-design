/* The /work index thumbnails (Geist refresh, 22 Sep 2026): line
 * drawings from Part A of bella/docs/reference/case-study-mock.html, so
 * every row carries the same weight and nothing breaks NDA. Inner markup
 * of a 300 x 180 data-bella-diagram <svg>: 1px ink (.s), line fills
 * (.f), one chip fill for the part the case is about. */
export const WORK_THUMBS: Record<string, string> = {
  /* seventeen buttons, one kept */
  drift:
    '<g><rect class="s" x="30.5" y="40.5" width="70" height="26" rx="4"/><rect class="s" x="115.5" y="40.5" width="70" height="26" rx="13"/><rect class="s" x="200.5" y="40.5" width="70" height="26" rx="8"/>' +
    '<rect class="s" x="30.5" y="80.5" width="70" height="26" rx="10"/><rect class="c1" x="115.5" y="80.5" width="70" height="26" rx="13"/><rect class="s" x="200.5" y="80.5" width="70" height="26" rx="2"/>' +
    '<rect class="s" x="30.5" y="120.5" width="70" height="26" rx="6"/><rect class="s" x="115.5" y="120.5" width="70" height="26" rx="0"/><rect class="s" x="200.5" y="120.5" width="70" height="26" rx="11"/></g>',
  /* a result card inside the product frame */
  booking:
    '<rect class="s" x="40.5" y="30.5" width="220" height="120" rx="10"/><rect class="f" x="60.5" y="50.5" width="90" height="8" rx="4"/>' +
    '<rect class="s" x="60.5" y="72.5" width="180" height="56" rx="8"/><rect class="c2" x="76.5" y="86.5" width="44" height="28" rx="6"/>' +
    '<rect class="f" x="132.5" y="90.5" width="70" height="8" rx="4"/><rect class="f" x="132.5" y="104.5" width="46" height="6" rx="3"/>',
  /* one search bar, its chips, the result lines */
  search:
    '<rect class="s" x="40.5" y="40.5" width="220" height="30" rx="15"/><rect class="c3" x="50.5" y="48.5" width="60" height="14" rx="7"/><rect class="c1" x="116.5" y="48.5" width="50" height="14" rx="7"/>' +
    '<rect class="f" x="40.5" y="88.5" width="220" height="10" rx="5"/><rect class="f" x="40.5" y="108.5" width="180" height="10" rx="5"/><rect class="f" x="40.5" y="128.5" width="200" height="10" rx="5"/>',
  /* the agent at the centre, watching */
  chip:
    '<circle class="c1" cx="150" cy="90" r="18"/><circle class="s" cx="150" cy="90" r="42"/><circle class="s" cx="150" cy="90" r="66" stroke-dasharray="3 5"/>' +
    '<rect class="c3" x="212.5" y="36.5" width="48" height="18" rx="9"/><rect class="c2" x="40.5" y="126.5" width="48" height="18" rx="9"/>',
  /* the design file and the code side by side, one name joining them */
  "code-first":
    '<rect class="s" x="30.5" y="40.5" width="100" height="100" rx="8"/><rect class="c3" x="46.5" y="58.5" width="68" height="24" rx="12"/>' +
    '<rect class="f" x="46.5" y="96.5" width="52" height="6" rx="3"/><rect class="f" x="46.5" y="110.5" width="38" height="6" rx="3"/>' +
    '<rect class="s" x="170.5" y="40.5" width="100" height="100" rx="8"/><rect class="f" x="184.5" y="58.5" width="40" height="6" rx="3"/>' +
    '<rect class="c3" x="196.5" y="72.5" width="52" height="6" rx="3"/><rect class="f" x="196.5" y="86.5" width="40" height="6" rx="3"/>' +
    '<rect class="f" x="184.5" y="100.5" width="30" height="6" rx="3"/><path class="s" d="M130.5 70.5 H170.5"/>',
  /* one card, three themes: the same shape, only the fill changes */
  theming:
    [0, 1, 2]
      .map((i) => {
        const x = 30 + i * 84;
        const fill = ["c1", "c2", "c3"][i];
        return (
          `<rect class="s" x="${x + 0.5}" y="40.5" width="72" height="100" rx="8"/>` +
          `<rect class="${fill}" x="${x + 10.5}" y="52.5" width="52" height="30" rx="5"/>` +
          `<rect class="f" x="${x + 10.5}" y="92.5" width="44" height="6" rx="3"/><rect class="f" x="${x + 10.5}" y="104.5" width="32" height="6" rx="3"/>` +
          `<rect class="s" x="${x + 10.5}" y="118.5" width="30" height="12" rx="6"/>`
        );
      })
      .join(""),
};
