import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Exhibit from "@/components/diagrams/Exhibit";
import { Mark, Notes } from "@/components/diagrams/Decisions";
import type { CaseStudy } from "@/lib/content";

/**
 * Forms and checkout (Elleta, 21 Sep 2026; approved mock
 * case-study-checkout-mock.html): the checkout before and after, as a
 * traveller or a travel manager, then the blocks every product's checkout
 * is assembled from, then the two audiences. NDA pass (24 Sep audit, F5):
 * no product screens. The checkout, the blocks and the confirmation are
 * line diagrams in the site's diagram style, drawn fresh, with the five
 * numbered decision notes. NDA: industry only, the colleague is a role.
 */

const NOTES: [string, string][] = [
  ["Who pays, in one place.", "Before: two dropdowns with plus buttons, personal and company addresses mixed together. After: pick a profile and its address fills in."],
  ["Only the methods you can use.", "Before: every payment type, for everyone. After: chips come from company policy and your role."],
  ["Private stays private.", "Booking for a colleague hides your personal cards and their personal profiles. Nobody sees what isn’t theirs."],
  ["Always clear what’s selected.", "One list, one ring around your choice, and the default marked. No radios hidden inside headers."],
  ["The button says what happens next.", "Confirm and pay, or Ask for approval, with the reason right above it. The deposit is shown apart, because it isn’t charged now."],
];

/* the checkout: who is travelling, who pays (one ringed profile, the
   default marked), how to pay (only the allowed methods), and a button
   that names the next step with its reason above it */
function CheckoutDiagram() {
  return (
    <Exhibit caption="The checkout, drawn fresh. The numbers are the decisions.">
      <svg
        viewBox="0 0 900 340"
        data-bella-diagram
        role="img"
        aria-label="One checkout. Who is travelling: me or a colleague. Who pays: one invoice profile, ringed as the choice and marked default. How to pay: only the methods the company allows, as chips. Last, the reason the booking needs approval, the button that says Ask for approval, and the deposit shown apart."
      >
        <rect className="s" x="110.5" y="20.5" width="680" height="300" rx="14" />

        <text className="ti opt" x="180" y="52">who is travelling</text>
        <rect className="c1" x="180.5" y="62.5" width="60" height="26" rx="13" />
        <text className="tk opt" x="210.5" y="80" textAnchor="middle">me</text>
        <rect className="s" x="250.5" y="62.5" width="116" height="26" rx="13" />
        <text className="ti opt" x="308.5" y="80" textAnchor="middle">a colleague</text>

        <text className="ti opt" x="180" y="116">who pays</text>
        <rect className="s" x="176.5" y="122.5" width="268" height="48" rx="12" />
        <rect className="s" x="180.5" y="126.5" width="260" height="40" rx="8" />
        <text className="t opt" x="196" y="151">invoice profile</text>
        <text className="t opt" x="424" y="151" textAnchor="end">default</text>

        <text className="ti opt" x="180" y="190">how to pay</text>
        <rect className="c2" x="180.5" y="200.5" width="118" height="26" rx="13" />
        <text className="tk opt" x="239.5" y="218" textAnchor="middle">company card</text>
        <rect className="c2" x="308.5" y="200.5" width="80" height="26" rx="13" />
        <text className="tk opt" x="348.5" y="218" textAnchor="middle">invoice</text>

        <text className="t opt" x="180" y="252">needs approval: over policy</text>
        <rect className="c1" x="180.5" y="262.5" width="200" height="34" rx="17" />
        <text className="tk opt" x="280.5" y="284" textAnchor="middle">Ask for approval</text>
        <text className="t opt" x="400" y="284">deposit · not charged now</text>

        <Mark n={3} x={150} y={75.5} />
        <Mark n={1} x={150} y={111.5} />
        <Mark n={4} x={150} y={146.5} />
        <Mark n={2} x={150} y={213.5} />
        <Mark n={5} x={150} y={279.5} />
      </svg>
      <Notes notes={NOTES} />
    </Exhibit>
  );
}

/* the blocks: one shared set, built once, and four product pages each
   assembled from it (illustrative: the stacks name no product's rules) */
const BLOCKS = ["trip", "summary", "travellers", "details", "extras", "insurance", "billing", "payment", "approval"];
const PRODUCTS: [string, number][] = [
  ["cars", 7],
  ["flights", 8],
  ["stays", 7],
  ["trains", 6],
];

function BlocksDiagram() {
  return (
    <Exhibit caption="Illustrative, drawn fresh: one set of blocks, four checkouts built from it.">
      <svg
        viewBox="0 0 900 340"
        data-bella-diagram
        role="img"
        aria-label="On the left, nine checkout blocks built once: trip, summary, travellers, details, extras, insurance, billing, payment and approval. An arrow leads to four product checkouts, cars, flights, stays and trains, each a stack of those blocks."
      >
        <rect className="s" x="40.5" y="20.5" width="220" height="300" rx="12" />
        <text className="t opt" x="60" y="46">blocks, built once</text>
        {BLOCKS.map((b, i) => (
          <g key={b}>
            <rect className="s" x="60.5" y={60.5 + i * 28} width="180" height="22" rx="11" />
            <text className="ti opt" x="76" y={76 + i * 28}>{b}</text>
          </g>
        ))}
        <path className="s" d="M270.5 170.5 H318 M310 164.5 L318 170.5 L310 176.5" />
        {PRODUCTS.map(([name, n], j) => {
          const x = 330.5 + j * 135;
          return (
            <g key={name}>
              <rect className="s" x={x} y="20.5" width="120" height="300" rx="12" />
              <text className="ti opt" x={x + 16} y="46">{name}</text>
              {Array.from({ length: n }, (_, i) => (
                <rect
                  key={i}
                  className={i === 0 ? "c1" : i === n - 1 ? "c3" : "f"}
                  x={x + 16}
                  y={60.5 + i * 28}
                  width="88"
                  height="22"
                  rx="6"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </Exhibit>
  );
}

/* the end of the flow: the confirmation, drawn fresh */
function DoneDiagram() {
  return (
    <Exhibit caption="The confirmation, drawn fresh: the route, the times, what happens next, one way on.">
      <svg
        viewBox="0 0 900 320"
        data-bella-diagram
        role="img"
        aria-label="Booking completed: a check mark, the route from pick-up to drop-off with their times, a short list of what happens next, and one button to the dashboard."
      >
        <rect className="s" x="250.5" y="20.5" width="400" height="280" rx="14" />
        <circle className="c3" cx="450.5" cy="58.5" r="18" />
        <path className="s on-chip" d="M442 58.5 L448 64.5 L460 52.5" />
        <text className="ti opt" x="450.5" y="100" textAnchor="middle">booking completed</text>
        <path className="s" d="M300 128.5 H600" />
        <circle className="fill-ink" cx="300" cy="128.5" r="4" />
        <circle className="fill-ink" cx="600" cy="128.5" r="4" />
        <text className="t opt" x="290" y="154">pick-up</text>
        <text className="t opt" x="610" y="154" textAnchor="end">drop-off</text>
        <rect className="f" x="290.5" y="162.5" width="70" height="6" rx="3" />
        <rect className="f" x="540.5" y="162.5" width="70" height="6" rx="3" />
        <text className="ti opt" x="290" y="198">what happens next</text>
        <rect className="f" x="290.5" y="208.5" width="220" height="6" rx="3" />
        <rect className="f" x="290.5" y="222.5" width="180" height="6" rx="3" />
        <rect className="f" x="290.5" y="236.5" width="200" height="6" rx="3" />
        <rect className="s" x="350.5" y="254.5" width="200" height="30" rx="15" />
        <text className="ti opt" x="450.5" y="274" textAnchor="middle">Go to dashboard</text>
      </svg>
    </Exhibit>
  );
}
export default function CheckoutCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <>
      <Section id="checkout-flow" labelledBy="checkout-flow-title" ruled>
        <SectionHeader
          id="checkout-flow-title"
          kicker="01 · Checkout, before and after"
          heading="Fewer choices, each one clear."
          lead="Five decisions on one checkout, for a traveller or a travel manager."
        />
        <CheckoutDiagram />
      </Section>

      <Section id="checkout-blocks" labelledBy="checkout-blocks-title" ruled>
        <SectionHeader
          id="checkout-blocks-title"
          kicker="02 · One checkout, many products"
          heading="Built once, from blocks."
          lead="The legacy checkout was a different page for every product. I mapped every use case, merged the ones that were really the same, and dropped the functions nobody used."
        >
          <p>
            Then I designed the checkout as <strong>reusable blocks</strong>: trip, summary, travellers,
            details, extras, insurance, billing, payment and approval. Developers built each block once,
            and every product assembles its own page from them.
          </p>
        </SectionHeader>
        <BlocksDiagram />
      </Section>

      <Section id="checkout-audiences" labelledBy="checkout-audiences-title" ruled>
        <SectionHeader id="checkout-audiences-title" heading="The same work, said two ways." />
        <div className="trv-two">
          <div className="trv-card">
            <span className="text-code">To leadership</span>
            <h3 className="heading-item">One piece of work, every product</h3>
            <p>
              The aim was fewer steps and no dead ends at payment, which is where support was losing
              time. Designed once, it reached cars, flights, stays and trains.
            </p>
          </div>
          <div className="trv-card">
            <span className="text-code">To developers</span>
            <h3 className="heading-item">Build a block once</h3>
            <p>
              Nine blocks with clear inputs replace a page per product. The rules for roles and
              privacy live in the data, not in each screen.
            </p>
          </div>
        </div>
      </Section>

      {/* the end of the flow (Part W6, Elleta: "this should be the end of
          the flow"): the confirmation, drawn fresh (F5) */}
      <Section id="checkout-done" labelledBy="checkout-done-title" ruled>
        <SectionHeader id="checkout-done-title" kicker="03 · Confirmed" heading="The end of the flow." />
        <DoneDiagram />
      </Section>
    </>
  );
}
