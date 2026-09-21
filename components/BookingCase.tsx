import Link from "next/link";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Container from "@/components/layout/Container";
import ExampleFrame, { FrameDemo } from "@/components/ExampleFrame";
import { StatusPill } from "@/components/ui/StatusPill";
import type { CaseStudy } from "@/lib/content";

/**
 * The travel platform, the umbrella case (Elleta, 21 Sep 2026; approved
 * mock case-study-booking-mock.html). Six sections and the close, the
 * mock's copy as written, with the 21 Sep corrections: the developer line
 * matches Drift 05, and the close's h2 is Elleta's line, fitted to the
 * 50-character title rule (21 Sep). The before/after screens are working demos in public/demos/travel;
 * everything else is page-native. NDA: industry only, screens de-branded.
 */

const STATS = [
  ["81%", "said booking was overly complex"],
  ["59%", "said changing a booking was hard"],
  ["37%", "of the support team had lost a booking to complexity"],
  ["48%", "spent 10+ hours a week helping customers book"],
];

const SHIPPED: [string, string, boolean][] = [
  ["Design system", "Built in the new front-end framework with my engineering team", true],
  ["Search", "Flights, stays, trains and cars, each with its supplier's rules", true],
  ["Flights", "Search and results, approvals, pricing and booking rights", true],
  ["Cars", "The full flow, search to booking", true],
  ["Checkout and payment", "One checkout for every product", true],
  ["Users and roles", "Admin for company travel managers", true],
  ["Flight extras", "Class upgrades, extras, seat map", false],
];

const STORIES = [
  {
    n: "01",
    title: "From Drift to Foundation",
    line: "The system: audit, tokens, a library in code, and the funding to build it.",
    legacy: "Legacy: one overloaded design file, and code that didn’t match it.",
    href: "/case-studies/design-system-transformation",
  },
  {
    n: "02",
    title: "Search for people who know what they want",
    line: "Filters in one drawer, autocomplete, a search that stays in view, and a ticket card.",
    legacy: "Legacy: the database decided which filters could exist.",
    href: "/case-studies/search-experts",
  },
  {
    n: "03",
    title: "Policies, roles and notifications",
    line: "Users and roles for travel managers, approvals, and messages people act on.",
    legacy: "Legacy: policy rules lived in the back end, per company.",
  },
  {
    n: "04",
    title: "Forms and checkout",
    line: "Forms that ask only what each user needs, validation, and one checkout for every product.",
    legacy: "Legacy: every supplier wanted different fields.",
    href: "/case-studies/checkout",
  },
];

function Part({
  id,
  index,
  kicker,
  heading,
  lead,
  children,
}: {
  id: string;
  index: string;
  kicker: string;
  heading: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Section id={id} labelledBy={`${id}-title`} ruled>
      <SectionHeader id={`${id}-title`} kicker={`${index} · ${kicker}`} heading={heading} lead={lead} />
      {children}
    </Section>
  );
}

export default function BookingCase({ cs }: { cs: CaseStudy }) {
  void cs;
  return (
    <>
      <Part
        id="problem"
        index="01"
        kicker="The problem"
        heading="Two years of redesign. Nothing shipped."
        lead="When I joined, a new design had been in progress for two years and none of it was live. The legacy product was costing time on both sides of the screen. I started by asking the people who picked up the phone."
      >
        <div>
          <dl className="trv-stats">
            {STATS.map(([v, l]) => (
              <div key={v}>
                <dt className="trv-stats__v">{v}</dt>
                <dd>{l}</dd>
              </div>
            ))}
          </dl>
          <p className="text-code trv-source">
            Source: my interviews and surveys with the customer success and sales teams, 2024.
          </p>
        </div>
      </Part>

      <Part
        id="search"
        index="02"
        kicker="Search, on four products"
        heading="Search that remembers what you asked."
        lead={
          <>
            The same search had to work for flights, stays, trains and cars, each supplier sending
            different data. Before is the legacy stays search, after is the flights search I shipped.{" "}
            <Link href="/case-studies/search-experts" className="trv-link">
              The full story is its own case study.
            </Link>
          </>
        }
      >
        <ExampleFrame
          demo
          path="search / before and after"
          caption={
            <>
              Legacy stays search and the flights search I shipped. De-branded.{" "}
              <a href="/demos/travel/booking-search.html" target="_blank" rel="noopener noreferrer" className="trv-link">
                Open full screen ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          }
        >
          <FrameDemo src="/demos/travel/booking-search.html" title="Search, before and after, with four notes" heights={[710, 635, 990, 990]} />
        </ExampleFrame>
      </Part>

      <Part
        id="trips"
        index="03"
        kicker="Trips"
        heading="See the whole trip in one place."
        lead="Changing anything used to mean starting a new search. The trip view keeps flights, hotel and extras together."
      >
        <ExampleFrame
          demo
          path="trips / before and after"
          caption={
            <>
              The hotel bookings page and the trip view. De-branded.{" "}
              <a href="/demos/travel/booking-trips.html" target="_blank" rel="noopener noreferrer" className="trv-link">
                Open full screen ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </>
          }
        >
          <FrameDemo src="/demos/travel/booking-trips.html" title="Trips, before and after, with three notes" heights={[710, 710, 950, 950]} />
        </ExampleFrame>
      </Part>

      <Part
        id="shipped"
        index="04"
        kicker="What shipped"
        heading="Designed and shipped with my squads."
        lead="I built the system and the plan, won the funding for an engineering team and two more designers, then designed and delivered these, first sketch to release."
      >
        <ul className="trv-ship">
          {SHIPPED.map(([name, line, done]) => (
            <li key={name}>
              <span className="trv-ship__name">{name}</span>
              <span className="trv-ship__line">{line}</span>
              <StatusPill tone={done ? "ok" : "warn"}>
                <span aria-hidden="true">{done ? "✓" : "◐"}</span>
                {done ? "Shipped" : "Nearly done"}
              </StatusPill>
            </li>
          ))}
        </ul>
      </Part>

      <Part
        id="stories"
        index="05"
        kicker="The case studies"
        heading="Four stories from the same platform."
        lead="Each one shows the shipped screen, what I would refine, and the legacy constraint it had to live with."
      >
        <ul className="trv-stories">
          {STORIES.map((s) => {
            const body = (
              <>
                <span className="text-code">{s.n}</span>
                <h3 className="heading-item">{s.title}</h3>
                <p>{s.line}</p>
                <p className="text-code trv-stories__legacy">{s.legacy}</p>
                {/* no page yet: a plain note, not a pill, and not dimmed (W3) */}
                {s.href ? null : <p className="text-code">Case study coming</p>}
              </>
            );
            return (
              <li key={s.n}>
                {s.href ? (
                  <Link href={s.href} className="trv-card trv-card--link">
                    {body}
                  </Link>
                ) : (
                  <div className="trv-card">{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </Part>

      <Part
        id="audiences"
        index="06"
        kicker="Two audiences"
        heading="The same work, said two ways."
        lead="A design only ships if the people paying for it and the people building it both understand it. I wrote for each."
      >
        <div className="trv-two">
          <div className="trv-card">
            <span className="text-code">To leadership</span>
            <h3 className="heading-item">Cost, risk and what it unlocks</h3>
            <ul>
              <li>“It feels complicated” became numbers: 37% of the support team had lost a booking to it.</li>
              <li>The system pitched with a rollout plan and a clear ask.</li>
              <li>Result: funding for an engineering team and two more designers.</li>
            </ul>
          </div>
          <div className="trv-card">
            <span className="text-code">To developers</span>
            <h3 className="heading-item">Names, rules and one source of truth</h3>
            <ul>
              <li>One developer from the start: I taught him the tokens and we built the first components together.</li>
              <li>Tokens with naming rules, the same in Figma variables and in code.</li>
              <li>Every fare case mapped to one rule string, so a card can’t show the wrong text.</li>
              <li>The ticket card tuned side by side with my developer: hover, shadow, motion.</li>
            </ul>
          </div>
        </div>
      </Part>

      <section className="l-section section--ruled case-close" aria-labelledby="case-close-heading">
        <Container className="case-close__grid">
          <div>
            <p className="text-code case-section__kicker">What changed</p>
            <h2 id="case-close-heading" className="case-section__heading">
              From a redesign that stalled to one that shipped.
            </h2>
          </div>
          <div>
            <p>
              A funded team, a system in code, and six product areas live on it.{" "}
              <strong>The research turned “it feels complicated” into numbers leadership could act on.</strong>
            </p>
            <p className="case-close__learned">
              What I learned: in a legacy product, half the job is finding out why things are there
              before you change them.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
