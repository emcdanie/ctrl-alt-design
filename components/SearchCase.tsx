import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Exhibit from "@/components/diagrams/Exhibit";
import { Mark, Notes } from "@/components/diagrams/Decisions";
import type { CaseStudy } from "@/lib/content";

/**
 * Search for experts (Elleta, 21 Sep 2026; approved mock
 * case-study-search-mock.html): the flight results page, shipped and
 * refined. NDA pass (24 Sep audit, F5): no product screens. The page is a
 * line diagram in the site's diagram style, drawn fresh, with the six
 * numbered decision notes under it. NDA: industry only.
 */

const NOTES: [string, string][] = [
  ["The search stays in view.", "Shipped: a summary bar with an Edit search button. Refined: each part edits in place, and the bar slims down as you scroll."],
  ["Type, don’t scroll a list.", "Airports autocomplete by city or code, with the match highlighted. The dates show the cheapest day nearby."],
  ["Quick filters for the usual asks.", "Direct only, in policy, morning. One tap each, with how many flights you’ll get."],
  ["One button, one drawer of chips.", "No dropdowns. The drawer slides over the side so results stay visible, and it’s a bottom sheet on mobile."],
  ["Nothing jumps.", "Filters from the drawer join the quick filters in one row, each with an ×. The row keeps its height, so the list never moves under your cursor."],
  ["A card that reads like a ticket.", "Built with my developer: the notch, the lift and the plane on hover. Every fare case becomes one plain sentence under Details."],
];

/* the results page: the search bar editing in place, autocomplete under
   it, one row of quick filters, one Filters button opening a drawer, and
   result cards cut like tickets */
function ResultsDiagram() {
  const chips: [number, number, string][] = [
    [70.5, 110, "direct only"],
    [190.5, 94, "in policy"],
    [294.5, 94, "morning ×"],
  ];
  const cards = [212.5, 268.5];
  return (
    <Exhibit caption="The results page, drawn fresh. The numbers are the decisions.">
      <svg
        viewBox="0 0 900 360"
        data-bella-diagram
        role="img"
        aria-label="A results page. At the top, the search bar, each part editable in place, with an autocomplete list under the first field. Below it, one row of quick filters and a Filters button that opens a drawer of chips at the side. Under them, result cards cut like tickets."
      >
        <rect className="s" x="40.5" y="20.5" width="820" height="320" rx="14" />

        <rect className="s" x="70.5" y="40.5" width="560" height="36" rx="18" />
        <path className="s" d="M250.5 47 V70 M420.5 47 V70" />
        <text className="t opt" x="90" y="63">from · to</text>
        <text className="t opt" x="272" y="63">dates</text>
        <text className="t opt" x="440" y="63">edits in place</text>

        <rect className="s" x="70.5" y="84.5" width="180" height="74" rx="8" />
        <rect className="c1" x="78.5" y="92.5" width="164" height="18" rx="4" />
        <text className="tk opt" x="86" y="106">city or code</text>
        <rect className="f" x="86.5" y="120.5" width="120" height="6" rx="3" />
        <rect className="f" x="86.5" y="138.5" width="96" height="6" rx="3" />

        {chips.map(([x, w, label]) => (
          <g key={label}>
            <rect className="c3" x={x} y="170.5" width={w} height="26" rx="13" />
            <text className="tk opt" x={x + w / 2} y="188" textAnchor="middle">{label}</text>
          </g>
        ))}
        <rect className="s" x="398.5" y="170.5" width="106" height="26" rx="13" />
        <text className="ti opt" x="451.5" y="188" textAnchor="middle">Filters · 1</text>
        <path className="dash" d="M506 183.5 H652" />

        <rect className="s" x="660.5" y="96.5" width="180" height="224" rx="10" />
        <text className="t opt" x="678" y="120">drawer of chips</text>
        <rect className="c2" x="678.5" y="136.5" width="64" height="22" rx="11" />
        <rect className="c2" x="750.5" y="136.5" width="72" height="22" rx="11" />
        <rect className="c2" x="678.5" y="168.5" width="84" height="22" rx="11" />
        <rect className="c2" x="770.5" y="168.5" width="52" height="22" rx="11" />
        <rect className="c2" x="678.5" y="200.5" width="56" height="22" rx="11" />
        <rect className="s" x="678.5" y="280.5" width="144" height="26" rx="13" />
        <text className="ti opt" x="750.5" y="298" textAnchor="middle">Show flights</text>

        {cards.map((y, i) => (
          <g key={y}>
            <rect className="s" x="70.5" y={y} width="560" height="46" rx="8" />
            <path className="dash" d={`M520.5 ${y + 6} V${y + 40}`} />
            <circle className="s" cx="520.5" cy={y} r="5" />
            <circle className="s" cx="520.5" cy={y + 46} r="5" />
            {i === 0 ? (
              <text className="t opt" x="88" y={y + 27.5}>time</text>
            ) : (
              <rect className="f" x="88.5" y={y + 19} width="40" height="8" rx="4" />
            )}
            <path className="s" d={`M150 ${y + 23} H330`} />
            <circle className="fill-ink" cx="150" cy={y + 23} r="3" />
            <circle className="fill-ink" cx="330" cy={y + 23} r="3" />
            {i === 0 ? (
              <text className="t opt" x="612" y={y + 27.5} textAnchor="end">price</text>
            ) : (
              <rect className="f" x="572.5" y={y + 19} width="40" height="8" rx="4" />
            )}
          </g>
        ))}

        <Mark n={1} x={56} y={58.5} />
        <Mark n={2} x={56} y={121.5} />
        <Mark n={3} x={56} y={183.5} />
        <Mark n={4} x={672} y={78} />
        <Mark n={5} x={341.5} y={158} />
        <Mark n={6} x={56} y={235.5} />
      </svg>
      <Notes notes={NOTES} />
    </Exhibit>
  );
}

export default function SearchCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <Section id="results" labelledBy="results-title" ruled>
      <SectionHeader
        id="results-title"
        kicker="01 · Results, shipped and refined"
        heading="Change anything without starting over."
        lead="Six decisions on the results page, as shipped and as refined."
      />
      <ResultsDiagram />
    </Section>
  );
}
