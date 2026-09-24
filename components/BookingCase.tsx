import Link from "next/link";
import Section from "@/components/layout/Section";
import SectionHeader from "@/components/layout/SectionHeader";
import Exhibit from "@/components/diagrams/Exhibit";
import { Mark, Notes, Words } from "@/components/diagrams/Decisions";
import { StatusPill } from "@/components/ui/StatusPill";
import type { CaseStudy } from "@/lib/content";

/**
 * The travel platform, the umbrella case (Elleta, 21 Sep 2026; approved
 * mock case-study-booking-mock.html). Six sections and the close, the
 * mock's copy as written, with the 21 Sep corrections: the developer line
 * matches Drift 05, and the close's h2 is Elleta's line, fitted to the
 * 50-character title rule (21 Sep). NDA pass (24 Sep audit, B1/B2): no
 * product screens, legacy or shipped. Search and trips are line diagrams
 * in the site's diagram style, drawn fresh, with the numbered decision
 * notes under them; the research numbers and the close live on Drift.
 */

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
    title: "Forms and checkout",
    line: "Forms that ask only what each user needs, validation, and one checkout for every product.",
    legacy: "Legacy: every supplier wanted different fields.",
    href: "/case-studies/checkout",
  },
];

/* the decision notes, as written for the retired before/after demos */
const SEARCH_NOTES: [string, string][] = [
  ["Keep the search in view.", "Before: changing a date restarted the whole search, and people dropped off. After: the search stays pinned at the top and changes without starting over."],
  ["One filter button, not a wall.", "Before: a long sidebar of risk levels, presets and sliders. After: Filter and Sort, a count of what’s active, and the chips in a drawer."],
  ["Scan, don’t read.", "Before: sort tabs, pagination and a long filter sidebar competing with the results. After: every card puts time, route, stops and price in the same place."],
  ["Say the rule once.", "Before: an upsell line repeated on every fare, and no policy limit in view. After: one small Out of policy badge on each fare."],
];

const TRIP_NOTES: [string, string][] = [
  ["One place for the whole trip.", "Before: hotel bookings on their own page, one vertical at a time. After: flights, hotel and extras in one booking panel."],
  ["Suggest the next step.", "Before: start a new search. After: the trip knows you’ll need a hotel and offers one."],
  ["Hide what you don’t need.", "Before: every traveller listed on the card. After: details on demand."],
];

/* search: the bar pinned at the top, one Filter button opening a drawer,
   result cards with every slot in the same place, one policy badge */
function SearchDiagram() {
  const cards = [145.5, 195.5, 245.5];
  return (
    <Exhibit caption="The search pattern, drawn fresh. The numbers are the decisions.">
      <svg
        viewBox="0 0 900 330"
        data-bella-diagram
        role="img"
        aria-label="A search bar pinned at the top of the page. Under it, one Filter button with a count, and Sort; the Filter button opens a drawer of filter chips on the right. Below, result cards that put time, route, stops and price in the same place, and one small out of policy badge on a fare."
      >
        <rect className="s" x="40.5" y="20.5" width="820" height="290" rx="14" />
        <rect className="s" x="70.5" y="44.5" width="600" height="40" rx="20" />
        <path className="s" d="M250.5 52 V77 M400.5 52 V77 M520.5 52 V77" />
        <text className="t opt" x="92" y="69">from · to</text>
        <text className="t opt" x="272" y="69">dates</text>
        <text className="t opt" x="422" y="69">travellers</text>
        <rect className="c1" x="590.5" y="50.5" width="72" height="28" rx="14" />
        <text className="tk opt" x="626.5" y="69" textAnchor="middle">Search</text>
        <text className="t opt" x="690" y="69">pinned on scroll</text>

        <rect className="s" x="70.5" y="100.5" width="110" height="30" rx="15" />
        <text className="ti opt" x="125.5" y="120" textAnchor="middle">Filter · 2</text>
        <rect className="s" x="192.5" y="100.5" width="70" height="30" rx="15" />
        <text className="ti opt" x="227.5" y="120" textAnchor="middle">Sort</text>
        <path className="dash" d="M262.5 115.5 H632" />

        <rect className="s" x="640.5" y="100.5" width="200" height="190" rx="10" />
        <text className="t opt" x="660" y="124">filters, in a drawer</text>
        <rect className="c2" x="660.5" y="140.5" width="70" height="22" rx="11" />
        <rect className="c2" x="740.5" y="140.5" width="80" height="22" rx="11" />
        <rect className="c2" x="660.5" y="172.5" width="90" height="22" rx="11" />
        <rect className="c2" x="760.5" y="172.5" width="50" height="22" rx="11" />
        <rect className="c2" x="660.5" y="204.5" width="60" height="22" rx="11" />
        <rect className="s" x="660.5" y="250.5" width="160" height="26" rx="13" />
        <text className="ti opt" x="740.5" y="268" textAnchor="middle">Show results</text>

        {cards.map((y, i) => (
          <g key={y}>
            <rect className="s" x="70.5" y={y} width="550" height="40" rx="8" />
            {i === 0 ? (
              <text className="t opt" x="88" y={y + 24.5}>time</text>
            ) : (
              <rect className="f" x="88.5" y={y + 16} width="40" height="8" rx="4" />
            )}
            <path className="s" d={`M150 ${y + 20} H330`} />
            <circle className="fill-ink" cx="150" cy={y + 20} r="3" />
            <circle className="fill-ink" cx={i === 1 ? 240 : 330} cy={y + 20} r="3" />
            <circle className="fill-ink" cx="330" cy={y + 20} r="3" />
            {i === 0 ? (
              <text className="t opt" x="350" y={y + 24.5}>route · stops</text>
            ) : null}
            {i === 0 ? (
              <text className="t opt" x="602" y={y + 24.5} textAnchor="end">price</text>
            ) : (
              <rect className="f" x="562.5" y={y + 16} width="40" height="8" rx="4" />
            )}
          </g>
        ))}
        <rect className="c3" x="424.5" y="205.5" width="124" height="20" rx="10" />
        <text className="tk opt" x="486.5" y="220" textAnchor="middle">out of policy</text>

        <Mark n={1} x={56} y={64.5} />
        <Mark n={2} x={56} y={115.5} />
        <Mark n={3} x={56} y={165.5} />
        <Mark n={4} x={406} y={215.5} />
      </svg>
      <Notes notes={SEARCH_NOTES} />
    </Exhibit>
  );
}

/* trips: one panel for the whole trip, a suggested next step, the
   travellers folded away until asked for */
function TripDiagram() {
  const rows: [number, string, string][] = [
    [70.5, "c1", "flight"],
    [126.5, "c2", "hotel"],
    [182.5, "c3", "extras"],
  ];
  return (
    <Exhibit caption="The trip panel, drawn fresh. The numbers are the decisions.">
      <svg
        viewBox="0 0 900 300"
        data-bella-diagram
        role="img"
        aria-label="One trip panel holding the flight, the hotel and the extras as three rows. The flight row folds its travellers behind a details control. Under the rows, a dashed suggestion offers the next step the trip needs."
      >
        <rect className="s" x="200.5" y="20.5" width="500" height="260" rx="14" />
        <text className="ti opt" x="228" y="52">your trip</text>
        {rows.map(([y, c, label]) => (
          <g key={label}>
            <rect className="s" x="228.5" y={y} width="444" height="44" rx="8" />
            <rect className={c} x="240.5" y={y + 12} width="20" height="20" rx="6" />
            <text className="ti opt" x="272" y={y + 26.5}>{label}</text>
            <rect className="f" x="340.5" y={y + 19} width="160" height="6" rx="3" />
          </g>
        ))}
        <text className="t opt" x="656" y="97" textAnchor="end">travellers ▸</text>
        <rect className="dash" x="228.5" y="238.5" width="444" height="30" rx="8" />
        <text className="t opt" x="244" y="258">suggested: what the trip needs next</text>

        <Mark n={1} x={318} y={47.5} />
        <Mark n={2} x={650} y={253.5} />
        <Mark n={3} x={544} y={92.5} />
      </svg>
      <Notes notes={TRIP_NOTES} />
    </Exhibit>
  );
}

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
  children?: React.ReactNode;
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
      {/* the research numbers live on Drift (24 Sep audit, B2) */}
      <Part
        id="problem"
        index="01"
        kicker="The problem"
        heading="Two years of redesign. Nothing shipped."
        lead="When I joined, a new design had been in progress for two years and none of it was live. The legacy product was costing time on both sides of the screen. I started by asking the people who picked up the phone."
      />

      <Part
        id="search"
        index="02"
        kicker="Search, on four products"
        heading="Search that remembers what you asked."
        lead={
          <>
            The same search had to work for flights, stays, trains and cars, each supplier sending
            different data. The drawing shows the pattern I shipped and the four decisions behind it.{" "}
            <Link href="/case-studies/search-experts" className="trv-link">
              The full story is its own case study.
            </Link>
          </>
        }
      >
        <SearchDiagram />
        <Words k="Trade-off">
          I left dropdowns out of search. One filter button opens a drawer, because a sidebar of filters was a wall competing
          with the results. The cost: filters sit one tap further away.
        </Words>
      </Part>

      <Part
        id="trips"
        index="03"
        kicker="Trips"
        heading="See the whole trip in one place."
        lead="Changing anything used to mean starting a new search. The trip view keeps flights, hotel and extras together."
      >
        <TripDiagram />
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
        heading="Three stories from the same platform."
        lead="Each one shows the pattern I shipped, what I would refine, and the legacy constraint it had to live with."
      >
        <ul className="trv-stories">
          {STORIES.map((s) => {
            const body = (
              <>
                <span className="text-code">{s.n}</span>
                <h3 className="heading-item">{s.title}</h3>
                <p>{s.line}</p>
                <p className="text-code trv-stories__legacy">{s.legacy}</p>
              </>
            );
            return (
              <li key={s.n}>
                <Link href={s.href} className="trv-card trv-card--link">
                  {body}
                </Link>
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
              <li>“It feels complicated” became evidence: a third of the support team had lost a booking to it.</li>
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

    </>
  );
}
