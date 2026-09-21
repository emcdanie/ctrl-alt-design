import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import ExampleFrame, { FrameDemo } from "@/components/ExampleFrame";
import type { CaseStudy } from "@/lib/content";

/**
 * Forms and checkout (Elleta, 21 Sep 2026; approved mock
 * case-study-checkout-mock.html): the checkout before and after, as a
 * traveller or a travel manager, then the blocks every product's checkout
 * is assembled from, then the two audiences. Both prototypes live in
 * public/demos/travel; the words are page-native. NDA: industry only,
 * the colleague is a role.
 */
export default function CheckoutCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <>
      <Section id="checkout-flow" labelledBy="checkout-flow-title" ruled>
        <SectionHeader
          id="checkout-flow-title"
          kicker="01 · Checkout, before and after"
          heading="Fewer choices, each one clear."
          lead="Pick a note to see it on the screen. The after works: switch who's travelling, or view it as a travel manager."
        />
        <ExampleFrame
          demo
          path="travel / cars / checkout"
          caption={
            <>
              The shipped design, rebuilt live. De-branded.{" "}
              <a href="/demos/travel/checkout.html" target="_blank" rel="noopener noreferrer" className="trv-link">
                Open full screen ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          }
        >
          <FrameDemo src="/demos/travel/checkout.html" title="Checkout prototype, before and after, traveller or travel manager, with five notes" heights={[790, 1260, 1500]} />
        </ExampleFrame>
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
          <p>Pick a product to see its checkout assemble.</p>
        </SectionHeader>
        <ExampleFrame
          demo
          path="checkout / blocks"
          caption={
            <>
              Illustrative. Recreated from the component file.{" "}
              <a href="/demos/travel/checkout-blocks.html" target="_blank" rel="noopener noreferrer" className="trv-link">
                Open full screen ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          }
        >
          <FrameDemo src="/demos/travel/checkout-blocks.html" title="The checkout blocks for cars, flights, stays and trains" heights={[630, 630, 680]} />
        </ExampleFrame>
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
    </>
  );
}
