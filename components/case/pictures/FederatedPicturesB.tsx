import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Bell, Check as CheckGlyph, Code, Component, Heart, NavArrowDown, NavArrowRight, NavArrowUp, Position, Xmark } from "iconoir-react";
import { KitAvatar, KitButton, KitChip, KitStatus, KitTag, KitTheme, MarkupBadge } from "@/components/case/kit/Kit";
import ShowAll from "@/components/case/ShowAll";
import ScaledArt from "@/components/case/ScaledArt";
import Swipe from "@/components/case/Swipe";
import PhoneSwitch from "@/components/case/PhoneSwitch";
import caseStyles from "@/components/case/Case.module.css";
import s from "./FederatedPicturesB.module.css";

/* Federated figures 3 to 6 as live pictures (Site v3, Figma
   e7U5Hxpr441rT719SPclas, Figure · Two lanes 293:22606, Intake flow and
   board 293:22750, KPI tree and Pareto 293:22932, Asked for vs shipped
   293:22181). Each draws inside the figure stage at the 1440 design width
   (928) and scales to fit above 640px. Below it each figure swipes, one
   panel per screen at its own size, type never scaled (job 38: no shrunk
   desktop picture on a phone). Each picture and each panel names itself
   (role="img"); everything inside is decorative to the page. */

type PanelItem = { key: string; short: string; label: string; node: ReactNode };

/** `more`: the rest of a long picture, its own picture behind Show all
 *  (job F, 5 Oct 2026: every beat fits one screen). `phoneFirst`: on the
 *  phone only that panel stays in view, the rest behind Show all (I4) */
function Picture({
  label,
  panels,
  swipe,
  children,
  more,
  phoneFirst,
  phoneSwitch,
}: {
  label: string;
  panels: PanelItem[];
  swipe: string;
  children: ReactNode;
  more?: { label: string; total: number; node: ReactNode };
  phoneFirst?: string;
  /** on the phone: these panels share one slot behind a segmented switch, the rest sit behind Show the other N (job P) */
  phoneSwitch?: { label: string; keys: string[] };
}) {
  const wide = (l: string, node: ReactNode) => (
    <div role="img" aria-label={l} className={s.root}>
      <div aria-hidden="true">
        <KitTheme mode="federated">
          <ScaledArt width={928}>{node}</ScaledArt>
        </KitTheme>
      </div>
    </div>
  );
  const stack = (items: PanelItem[]) => (
    <Swipe
      fit
      label={swipe}
      items={items.map((p) => ({
        key: p.key,
        short: p.short,
        node: (
          <div role="img" aria-label={p.label} className={s.phonePanel}>
            <div aria-hidden="true">
              <KitTheme mode="federated">
                <div className={s.phone}>{p.node}</div>
              </KitTheme>
            </div>
          </div>
        ),
      }))}
    />
  );
  const panelNode = (p: PanelItem) => (
    <div role="img" aria-label={p.label} className={s.phonePanel}>
      <div aria-hidden="true">
        <KitTheme mode="federated">
          <div className={s.phone}>{p.node}</div>
        </KitTheme>
      </div>
    </div>
  );
  return (
    <>
      <div className={caseStyles.wideOnly}>
        {wide(label, children)}
        {more ? <ShowAll total={more.total}>{wide(more.label, more.node)}</ShowAll> : null}
      </div>
      <div className={caseStyles.phoneOnly}>
        {phoneSwitch ? (
          <>
            <PhoneSwitch
              label={phoneSwitch.label}
              items={panels.filter((p) => phoneSwitch.keys.includes(p.key)).map((p) => ({ key: p.key, label: p.short.charAt(0).toUpperCase() + p.short.slice(1), node: panelNode(p) }))}
            />
          </>
        ) : phoneFirst ? (
          <>
            {stack(panels.filter((p) => p.key === phoneFirst))}
            <ShowAll total={panels.length - 1} label={`Show the other ${panels.length - 1}`}>{stack(panels.filter((p) => p.key !== phoneFirst))}</ShowAll>
          </>
        ) : (
          stack(panels)
        )}
      </div>
    </>
  );
}

const Accent = () => <span className={s.accent} />;

/* ── Figure 4 · Two lanes ─────────────────────────────────────────── */
const PEOPLE = ["avatar-r9", "avatar-r4", "avatar-r6", "avatar-r10"];

const Migration = () => (
  <div className={`${s.card} ${s.migration}`}>
    <Accent />
    <span className={s.title}>Spacing migration</span>
    <span className={s.sub}>3,882 bindings moved to the new spacing tokens</span>
    <span className={s.beforeAfter}>
      <span className={s.stat}>
        <span className={s.statBefore}>about 12 h</span>
        <span className={s.statLabel}>By hand, per platform</span>
      </span>
      <span className={s.arrow}>
        <Icon name="ArrowRight" size="md" />
      </span>
      <span className={s.stat}>
        <span className={s.statAfter}>&lt; 3 min</span>
        <span className={`${s.statLabel} ${s.statLabelBody}`}>With Claude, checked by me</span>
      </span>
    </span>
  </div>
);

const DarkMode = () => (
  <div className={`${s.card} ${s.darkMode}`}>
    <Accent />
    <span className={s.ring}>84/84</span>
    <span className={s.body}>Brand tokens ready for dark mode. Design stopped being the blocker.</span>
  </div>
);

const Cleanup = () => (
  <div className={`${s.card} ${s.cleanup}`}>
    <Accent />
    <span className={s.bigStat}>
      <span className={s.big}>280</span>
      <span className={s.body}>icon bindings cleaned, with searchable names</span>
    </span>
    <span className={s.bigStat}>
      <span className={s.big}>12</span>
      <span className={s.body}>components with accessibility fixes</span>
    </span>
  </div>
);

const People = () => (
  <div className={`${s.card} ${s.people}`}>
    <span className={s.stack}>
      {PEOPLE.map((p) => (
        <KitAvatar key={p} src={`/images/kit/${p}.jpg`} size={32} className={s.stackAvatar} />
      ))}
    </span>
    <span className={s.peopleHead}>What stayed with people:</span>
    <span className={s.body}>component names, props and structure, and which requests to close. Decided with the platform devs.</span>
  </div>
);

const LANES_PANELS: PanelItem[] = [
  {
    key: "migration",
    short: "spacing migration",
    node: <Migration />,
    label: "Spacing migration: 3,882 bindings moved to the new spacing tokens, about 12 hours by hand per platform, under 3 minutes with Claude, checked by me.",
  },
  {
    key: "dark",
    short: "dark mode",
    node: <DarkMode />,
    label: "84 of 84 brand tokens ready for dark mode. Design stopped being the blocker.",
  },
  {
    key: "cleanup",
    short: "clean-up",
    node: <Cleanup />,
    label: "280 icon bindings cleaned with searchable names, and 12 components with accessibility fixes.",
  },
  {
    key: "people",
    short: "what stayed with people",
    node: <People />,
    label: "What stayed with people: component names, props and structure, and which requests to close, decided with the platform devs.",
  },
];

export function FedTwoLanes({ label }: { label: string }) {
  return (
    <Picture label={label} panels={LANES_PANELS} swipe="Two lanes: the slow work and the decisions" phoneFirst="migration">
      <div className={s.lanes}>
        <div className={s.lanesTop}>
          <Migration />
          <DarkMode />
          <Cleanup />
        </div>
        <People />
      </div>
    </Picture>
  );
}

/* ── Figure 5 · Intake flow and board ─────────────────────────────── */
type Dot = "open" | "red" | "ochre";
const BEFORE: [string, string, Dot][] = [
  ["Squad builds", "its own version", "open"],
  ["Dev waits", "over a week", "red"],
  ["System hears", "last", "red"],
  ["Rework", "or a new copy", "red"],
];
const AFTER: [string, string, Dot][] = [
  ["Need", "from the squad", "open"],
  ["Open desk", "that week", "ochre"],
  ["Decided", "together", "ochre"],
  ["Dev builds", "once", "open"],
];

function Lane({ kind, head, steps }: { kind: "pass" | "fail"; head: string; steps: [string, string, Dot][] }) {
  return (
    <span className={s.lane}>
      {/* the lane's verdict: its head as a labelled tag, icon + words */}
      <MarkupBadge kind={kind} className={s.laneHead}>
        {head}
      </MarkupBadge>
      <span className={s.steps}>
        {steps.map(([t, sub, dot], k) => (
          <span key={t} className={s.step}>
            <span className={s.track}>
              <span className={s.dot} data-dot={dot} />
              {k < steps.length - 1 ? <span className={s.line} /> : null}
            </span>
            <span className={s.stepTitle}>{t}</span>
            <span className={s.stepSub}>{sub}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <span className={`${s.bullets} ${className}`.trim()}>
      {items.map((t) => (
        <span key={t} className={s.bullet}>
          {t}
        </span>
      ))}
    </span>
  );
}

const LANE_TITLE = "When did the system team hear about it?";

const Timelines = () => (
  <div className={`${s.card} ${s.timelines}`}>
    <Accent />
    <span className={s.title}>{LANE_TITLE}</span>
    <Lane kind="fail" head="Before: after the build" steps={BEFORE} />
    <span className={s.rule} />
    <Lane kind="pass" head="After: before the build" steps={AFTER} />
  </div>
);

const OneLane = ({ after }: { after: boolean }) => (
  <div className={`${s.card} ${s.timelines}`}>
    <Accent />
    <span className={s.title}>{LANE_TITLE}</span>
    {after ? <Lane kind="pass" head="After: before the build" steps={AFTER} /> : <Lane kind="fail" head="Before: after the build" steps={BEFORE} />}
  </div>
);

const Evidence = () => (
  <div className={`${s.card} ${s.evidence}`}>
    <Accent />
    <span className={s.title18}>From the team retro</span>
    <span className={s.note}>“Technical feedback reaches us after the open desk, not before.”</span>
    <span className={s.label16}>What changed</span>
    <Bullets
      className={s.changes}
      items={["A new open desk template: bring the case before building", "Kanban, three in progress at most", "One way in: squad, system team, open desk, dev"]}
    />
  </div>
);

const INTAKE_PANELS: PanelItem[] = [
  {
    key: "before",
    short: "before",
    node: <OneLane after={false} />,
    label: "Before, after the build: the squad builds its own version, the dev waits over a week, the system hears last, then rework or a new copy.",
  },
  {
    key: "after",
    short: "after",
    node: <OneLane after />,
    label: "After, before the build: the need comes from the squad, the open desk takes it that week, it's decided together, and the dev builds once.",
  },
  {
    key: "retro",
    short: "the retro",
    node: <Evidence />,
    label:
      "From the team retro: 'Technical feedback reaches us after the open desk, not before.' What changed: a new open desk template, Kanban with three in progress at most, and one way in.",
  },
];

export function FedIntake({ label }: { label: string }) {
  return (
    <Picture label={label} panels={INTAKE_PANELS} swipe="When the system team heard about it" phoneSwitch={{ label: "Before or after", keys: ["before", "after"] }}>
      <div className={s.intake}>
        <Timelines />
        <Evidence />
      </div>
    </Picture>
  );
}

/* ── Figure 6 · KPI tree and Pareto ───────────────────────────────── */
const CASE = [
  ["Cost", "Duplicated components, rebuilt squad by squad"],
  ["Time to market", "Decisions before the build, not after"],
  ["Risk", "AI copies whatever is there today"],
];

const SlideHead = () => (
  <>
    <span className={s.eyebrow}>
      <Accent />
      State of the design system · July
    </span>
    <span className={s.slideTitle}>Clean the system before scaling AI</span>
  </>
);

const Ask = () => (
  <span className={s.ask}>
    <span className={s.askTitle}>The ask: phase 1</span>
    <Bullets
      className={s.askList}
      items={["Bridge design and code on the top components", "Machine-readable descriptions", "One sprint, no new budget", "Phases 2 and 3 only if phase 1 works"]}
    />
  </span>
);

const Cells = () => (
  <span className={s.cells}>
    {CASE.map(([h, t]) => (
      <span key={h} className={s.cell}>
        <span className={s.label16}>{h}</span>
        <span className={s.body}>{t}</span>
      </span>
    ))}
  </span>
);

const Tree = () => (
  <span className={s.tree}>
    <span className={s.treeLabel}>KPI tree:</span>
    <span className={s.tier} data-on="">
      Business goals
    </span>
    <span className={s.treeArrow}>
      <Icon name="ArrowRight" size="sm" />
    </span>
    <span className={s.tier}>Product results</span>
    <span className={s.treeArrow}>
      <Icon name="ArrowRight" size="sm" />
    </span>
    <span className={s.tier}>System work</span>
  </span>
);

const Outcome = () => (
  <div className={`${s.card} ${s.outcome}`}>
    <Accent />
    <span className={s.sub}>Two months after I left</span>
    <span className={s.title}>Developers on the system</span>
    <span className={s.change}>
      <span className={s.from}>50%</span>
      <span className={s.changeArrow}>
        <Icon name="ArrowRight" size="lg" />
      </span>
      <span className={s.big}>100%</span>
    </span>
    <span className={s.bar} />
    <span className={s.platforms}>
      {["Web", "iOS", "Android"].map((p) => (
        <span key={p} className={s.platform}>
          {p}
        </span>
      ))}
    </span>
    <span className={s.sub}>The case was mine. The decision was theirs.</span>
  </div>
);

/* the phone's one smaller picture (job P, 7 Oct 2026): the whole slide in
   one card, the cost cells and the KPI tree under the ask, the outcome as
   a strip at the foot; was three stacked cards */
const KPI_PANELS: PanelItem[] = [
  {
    key: "slide",
    short: "the slide",
    node: (
      <div className={`${s.card} ${s.slide} ${s.slidePhone}`}>
        <SlideHead />
        <Ask />
        <Cells />
        <Tree />
        <Outcome />
      </div>
    ),
    label:
      "The leadership slide, 'Clean the system before scaling AI'. The ask, phase 1: bridge design and code on the top components, machine-readable descriptions, one sprint with no new budget, phases 2 and 3 only if phase 1 works. The case: cost, duplicated components rebuilt squad by squad; time to market, decisions before the build; risk, AI copies whatever is there today. A KPI tree from business goals to product results to system work. Two months after I left: developers on the system went from 50% to 100% on Web, iOS and Android.",
  },
];

export function FedKpi({ label }: { label: string }) {
  return (
    <Picture label={label} panels={KPI_PANELS} swipe="The leadership slide">
      <div className={s.kpi}>
        <div className={`${s.card} ${s.slide}`}>
          <SlideHead />
          <span className={s.columns}>
            <Ask />
            <Cells />
          </span>
          <Tree />
        </div>
        <Outcome />
      </div>
    </Picture>
  );
}

/* ── Figure 3 · Asked for vs shipped ──────────────────────────────── */
type SizeState = "in" | "out" | "last" | "sel";
type Cell = [label: string, col: number, row: number, state?: SizeState];

export function SizeGrid({ cells, w, h }: { cells: Cell[]; w: number; h: number }) {
  const cols = Math.max(...cells.map((c) => c[1])) + 1;
  const rows = Math.max(...cells.map((c) => c[2])) + 1;
  return (
    <span className={s.sizeGrid} style={{ width: (w - 1) * cols + 1, height: (h - 1) * rows + 1 }}>
      {cells.map(([t, c, r, st = "in"]) => (
        <span key={t} className={s.size} data-state={st} style={{ left: c * (w - 1), top: r * (h - 1), width: w, height: h }}>
          <span className={s.sizeLabel}>{t}</span>
          {st === "out" ? <Bell className={s.sizeBell} /> : null}
          {st === "last" ? <span className={s.sizeMark} /> : null}
        </span>
      ))}
    </span>
  );
}

export const ROWS = (sel: string, out: string[], last: string[]): Cell[] =>
  ["XXS", "XS", "S", "M", "L", "XL", "XXL", "1XL", "2XL", "3XL", "4XL"].map((t, k) => [
    t,
    k % 4,
    Math.floor(k / 4),
    t === sel ? "sel" : out.includes(t) ? "out" : last.includes(t) ? "last" : "in",
  ]);

const COLOURS: [string, string][] = [
  ["Blues", "blue"],
  ["Beige", "beige"],
  ["Whites", "white"],
  ["Ecru", "ecru"],
  ["Greys", "grey"],
  ["Browns", "brown"],
  ["Blacks", "black"],
  ["Reds", "red"],
  ["Pinks", "pink"],
  ["Greens", "green"],
];

/* written out so audit:debt sees each token's consumer */
const SWATCH: Record<string, string> = {
  black: "var(--kit-swatch-black)",
  taupe: "var(--kit-swatch-taupe)",
  sand: "var(--kit-swatch-sand)",
  blue: "var(--kit-swatch-blue)",
  beige: "var(--kit-swatch-beige)",
  white: "var(--kit-swatch-white)",
  ecru: "var(--kit-swatch-ecru)",
  grey: "var(--kit-swatch-grey)",
  brown: "var(--kit-swatch-brown)",
  red: "var(--kit-swatch-red)",
  pink: "var(--kit-swatch-pink)",
  green: "var(--kit-swatch-green)",
};
const sw = (name: string) => SWATCH[name];

function Check({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className={s.check}>
      <span className={s.checkIcon}>{icon}</span>
      <span className={s.body}>{children}</span>
    </span>
  );
}

function Layout({ chip, label, end }: { chip: ReactNode; label: string; end: ReactNode }) {
  return (
    <span className={s.layout}>
      {chip}
      <span className={s.layoutLabel}>{label}</span>
      {end}
    </span>
  );
}

/* the chip's three layouts: colour, text and the new slot */
export const ColourChip = () => (
  <span className={`${s.oldChip} ${s.colourChip}`}>
    <span className={s.bigSwatch} style={{ background: sw("taupe") }} />
    <span className={s.swatchLine} />
  </span>
);

export const TextChip = () => (
  <span className={`${s.oldChip} ${s.textChip}`}>
    <span className={s.small}>Fabric</span>
    <span className={s.label16}>Linen</span>
  </span>
);

export const SlotChip = () => <span className={s.slotChip}>Slot</span>;

/** Figure 3's pieces outside the figure (the case hero and showcase): the
 *  product theme and the picture's own variables */
export function FedPieces({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <KitTheme mode="federated">
      <div className={`${s.pieces} ${className}`.trim()}>{children}</div>
    </KitTheme>
  );
}

/** the stock mark, asked (negative spacing) or shipped (Trim); `label`
 *  off draws the box alone */
export function TrimBox({ on, label = true }: { on: boolean; label?: boolean }) {
  return (
    <span className={s.trim}>
      <span className={s.trimBox} data-on={on || undefined}>
        <span className={s.trimText}>3XL</span>
        <span className={s.trimGuide} />
        {on ? null : <span className={s.trimNeg} />}
        <span className={s.trimBounds} />
        <Bell className={s.trimBell} />
      </span>
      {label ? (
        <span className={s.trimLabel} data-on={on || undefined}>
          {on ? "Shipped: Trim" : "Asked: −4px"}
        </span>
      ) : null}
    </span>
  );
}

/* ── the showcase's three atom cards (K7, Elleta, 6 Oct 2026) ─────────
   Fluid, for the showcase only (Figure 3 keeps its drawn sizes): each
   fills its card's width in equal columns, with a name or a key under it
   in the case's own words. */

/** every size on a 4-column grid the card's width; the bell sits 4 under
 *  its size; a key for the two marks */
export function SizeKeyGrid({ cells }: { cells: Cell[] }) {
  return (
    <span className={s.kGridWrap}>
      <span className={s.kGrid}>
        {cells.map(([t, , , st = "in"]) => (
          <span key={t} className={s.kSize} data-state={st}>
            <span className={s.sizeLabel}>{t}</span>
            {st === "out" ? <Bell className={s.kBell} /> : null}
            {st === "last" ? <span className={s.kMark} /> : null}
          </span>
        ))}
        {/* the row's empty cells, drawn, so the grid closes square */}
        {Array.from({ length: (4 - (cells.length % 4)) % 4 }, (_, k) => (
          <span key={`blank-${k}`} className={s.kSize} />
        ))}
      </span>
      <span className={s.kKey}>
        <span className={s.kKeyItem}>
          <span className={s.kMark} />
          Last units
        </span>
        <span className={s.kKeyItem}>
          <Bell className={s.kBell} />
          Out of stock, notify bell
        </span>
      </span>
    </span>
  );
}

/** the chip's three layouts in equal columns, each named under it */
export function LayoutTrio() {
  return (
    <span className={s.kTrio}>
      {(
        [
          [<ColourChip key="c" />, "Colour"],
          [<TextChip key="t" />, "Text"],
          [<SlotChip key="s" />, "Slot"],
        ] as const
      ).map(([chip, name]) => (
        <span key={name} className={s.kCol}>
          {chip}
          <span className={s.kName}>{name}</span>
        </span>
      ))}
    </span>
  );
}

/** the 3XL size with its bell, trim off and on: the guide marks the
 *  text's edge between the size and the bell, never through either; off,
 *  the bell's padding pushes it off that edge; on, it lines up */
export function TrimDuo() {
  return (
    <span className={s.kDuo}>
      {[false, true].map((on) => (
        <span key={String(on)} className={s.kCol}>
          <span className={s.kTrim} data-on={on || undefined}>
            <span className={s.kTrimText}>3XL</span>
            <span className={s.kTrimGuide} />
            <span className={s.kTrimBounds}>
              <Bell className={s.kTrimBell} />
            </span>
          </span>
          <span className={s.kName}>{on ? "Trim on" : "Trim off"}</span>
        </span>
      ))}
    </span>
  );
}

/** the chip group with slots: pick a group, its labels come with it */
export function ChipGroupCard() {
  return (
    <div className={`${s.card} ${s.group}`}>
      <span className={s.groupTitle}>Chip group, with slots</span>
      <span className={s.verdict}>
        <span className={s.verdictIcon} data-kind="fail">
          <Xmark />
        </span>
        <span className={s.body}>Select 11 chips, change every label and colour by hand</span>
      </span>
      <span className={s.picker}>
        <span className={s.property}>
          <span className={s.sub}>Group</span>
          <span className={s.dropdown}>
            Letters
            <NavArrowDown />
          </span>
        </span>
        <span className={s.options}>
          <KitChip selected className={s.optionOn}>
            Letters
          </KitChip>
          <KitChip>Kids</KitChip>
          <KitChip>Colours</KitChip>
        </span>
        <span className={s.preview}>
          {[
            ["XS", "in"],
            ["S", "in"],
            ["M", "sel"],
            ["L", "last"],
            ["XL", "in"],
          ].map(([t, st], k) => (
            <span key={t} className={s.pcell} data-state={st} style={{ left: k * 45 }}>
              {t}
              {st === "last" ? <span className={s.pmark} /> : null}
            </span>
          ))}
        </span>
      </span>
      <span className={s.verdict}>
        <span className={s.verdictIcon} data-kind="pass">
          <CheckGlyph />
        </span>
        <span className={s.body}>Pick the group you need. Labels and colours come with it.</span>
      </span>
    </div>
  );
}

const Asked = () => (
  <div className={s.stackCol}>
    <div className={`${s.card} ${s.request}`}>
      <span className={s.from}>
        <KitAvatar src="/images/kit/avatar-r8.jpg" size={32} />
        <span className={s.fromText}>
          <span className={s.label16}>Squad designer</span>
          <span className={s.sub}>Product card redesign</span>
        </span>
      </span>
      <span className={`${s.body} ${s.bubble}`}>The new card needs its own size selector chip. Can we add one?</span>
    </div>
    <div className={`${s.card} ${s.review}`}>
      <span className={s.reviewHead}>
        <span className={s.label16}>I’ll review it with the devs</span>
        <span className={s.stack}>
          {["avatar-r9", "avatar-r4", "avatar-r6"].map((p) => (
            <KitAvatar key={p} src={`/images/kit/${p}.jpg`} size={26} className={s.stackAvatar} />
          ))}
        </span>
      </span>
      <Check icon={<Code />}>Code audit: product page, bag and size guide</Check>
      <Check icon={<Position />}>Blast radius: every place the chip lives</Check>
      <Check icon={<Component />}>Best practice: a slot, not a second chip</Check>
      <KitStatus>Agreed at the weekly + open desk</KitStatus>
    </div>
  </div>
);

const Kept = () => (
  <div className={`${s.card} ${s.kept}`}>
    <span className={s.title18}>Kept the old chip, added a slot</span>
    <Layout chip={<ColourChip />} label="Colour" end={<KitTag>Kept</KitTag>} />
    <Layout chip={<TextChip />} label="Text" end={<KitTag>Kept</KitTag>} />
    <Layout chip={<SlotChip />} label="Slot variant" end={<KitStatus>New</KitStatus>} />
    <span className={s.rule} />
    <span className={s.label16}>Three fills for the slot</span>
    <span className={s.fills}>
      <span className={s.fill}>
        <span className={s.fillBox}>
          <span className={s.label16}>3XL</span>
          <span className={s.fillMark} />
        </span>
        <span className={s.fillCaption}>Size + stock</span>
      </span>
      <span className={s.fill}>
        <span className={s.fillBox}>
          <span className={s.label16}>10</span>
          <span className={s.small}>140 cm</span>
        </span>
        <span className={s.fillCaption}>Kids: age, height</span>
      </span>
      <span className={s.fill}>
        <span className={`${s.fillBox} ${s.fillRow}`}>
          <span className={s.swatch12} style={{ background: sw("brown") }} />
          <span className={s.small600}>Browns</span>
        </span>
        <span className={s.fillCaption}>Colour filter</span>
      </span>
    </span>
  </div>
);

const TrimCard = () => (
  <div className={`${s.card} ${s.trimCard}`}>
    <span className={s.title18}>The stock marks, aligned</span>
    <span className={s.trimPair}>
      <TrimBox on={false} />
      <TrimBox on />
    </span>
    <span className={s.body}>
      The designer asked for a new component and negative spacing to fix the mark. I said no: a Trim property on the icon removes its padding, so the notify bell and the last-units
      mark line up with the size, and every other icon stays as it is.
    </span>
  </div>
);

const ProductScreen = ({ cell }: { cell: number }) => (
  <div className={`${s.card} ${s.screen}`}>
    <KitTag>Product page</KitTag>
    <img className={s.photo} src="/images/kit/coat.jpg" alt="" width={1200} height={1800} loading="lazy" decoding="async" />
    <span className={s.product}>Wool blend belted coat</span>
    <span className={s.body}>€129.99</span>
    <span className={s.colours}>
      {["black", "taupe", "sand"].map((c, k) => (
        <span key={c} className={`${s.colour} ${s.swatch12}`} data-light={c !== "taupe" || undefined} data-on={k === 0 || undefined} style={{ background: sw(c) }} />
      ))}
    </span>
    <SizeGrid cells={ROWS("M", ["XXS", "2XL"], ["3XL", "4XL"])} w={cell} h={46} />
    <span className={s.legend}>Last units</span>
    <span className={s.link}>Size guide</span>
    <span className={s.actions}>
      <KitButton className={s.add}>Add</KitButton>
      <span className={s.fav}>
        <Heart />
      </span>
    </span>
  </div>
);

const BagScreen = ({ cell }: { cell: number }) => (
  <div className={`${s.card} ${s.screen}`}>
    <KitTag>Bag</KitTag>
    <span className={s.bagItem}>
      <img className={s.thumb} src="/images/kit/coat.jpg" alt="" width={1200} height={1800} loading="lazy" decoding="async" />
      <span className={s.bagInfo}>
        <span className={s.lastUnits}>Last units</span>
        <span className={s.body}>Wool blend belted coat</span>
        <span className={s.body}>€129.99</span>
        <span className={s.qtyRow}>
          <span className={s.ink16}>− 1 +</span>
          <span className={s.sizeBtn}>
            4XL
            <NavArrowRight />
          </span>
        </span>
      </span>
    </span>
    <span className={s.drawer}>
      <span className={s.drawerHead}>
        <span className={s.label16}>Change size</span>
        <Xmark className={s.close} />
      </span>
      <SizeGrid cells={ROWS("4XL", ["XXS", "2XL"], ["1XL", "3XL"])} w={cell} h={44} />
      <KitButton className={s.confirm}>Confirm</KitButton>
    </span>
  </div>
);

const GuideScreen = ({ cell }: { cell: number }) => (
  <div className={`${s.card} ${s.screen}`}>
    <KitTag>Size guide</KitTag>
    <span className={s.guideHead}>
      <span className={s.title18}>Size guide</span>
      <Xmark className={s.close} />
    </span>
    <span className={s.tabs}>
      <span className={s.tabOn}>Garment</span>
      <span className={s.sub}>Body</span>
    </span>
    <span className={s.units}>
      <span className={s.label16}>Europe</span>
      <span className={s.label16}>cm</span>
      <span className={s.sub}>in</span>
    </span>
    <SizeGrid cells={ROWS("2XL", [], [])} w={cell} h={44} />
    <span className={s.measures}>
      {[
        ["", "2XL", "3XL"],
        ["Length", "79.5 cm", "80.7 cm"],
        ["Chest", "55.2 cm", "57.2 cm"],
        ["Sleeve", "63.6 cm", "64.9 cm"],
      ].map((r) =>
        r.map((v, k) => (
          <span key={`${r[0]}-${k}`} className={k === 0 ? s.label16 : s.sub}>
            {v}
          </span>
        )),
      )}
    </span>
  </div>
);

const Filters = () => (
  <div className={`${s.card} ${s.filters}`}>
    <span className={s.colourCol}>
      <KitTag>Filters</KitTag>
      <span className={s.sectionHead}>
        <span className={s.title18m}>Colour</span>
        <NavArrowUp className={s.close} />
      </span>
      <span className={s.colourGrid}>
        {COLOURS.map(([t, c], k) => (
          <span key={t} className={s.colourCell} data-sel={t === "Browns" || undefined} style={{ left: (k % 5) * 105, top: Math.floor(k / 5) * 51 }}>
            <span className={s.swatch12} data-light={c === "white" || c === "ecru" || c === "black" || undefined} style={{ background: sw(c) }} />
            <span className={s.ink16}>{t}</span>
          </span>
        ))}
      </span>
    </span>
    <span className={s.sortCol}>
      {["Size", "Price", "Sort by"].map((t) => (
        <span key={t} className={s.section}>
          <span className={s.title18m}>{t}</span>
          <NavArrowDown className={s.close} />
        </span>
      ))}
      <KitButton className={s.show}>Show items</KitButton>
      <span className={s.clear}>Clear filters</span>
    </span>
  </div>
);

const SHIPPED_PANELS: PanelItem[] = [
  {
    key: "asked",
    short: "the ask",
    node: <Asked />,
    label:
      "A squad designer asks for a new size selector chip for the product card redesign; I review it with the devs: a code audit, the blast radius and a best-practice check, agreed at the weekly open desk.",
  },
  {
    key: "kept",
    short: "the slot",
    node: <Kept />,
    label:
      "Kept the old chip, added a slot: the colour and text layouts kept, a new slot variant, and three fills for the slot: size and stock, kids' age and height, colour filter.",
  },
  {
    key: "trim",
    short: "stock marks",
    node: <TrimCard />,
    label: "The stock marks, aligned: asked for with negative spacing, shipped with a Trim property on the icon, so the bell lines up with the size.",
  },
  {
    key: "group",
    short: "chip group",
    node: <ChipGroupCard />,
    label: "A chip group with slots: instead of selecting 11 chips and changing every label by hand, pick the group you need and its labels and colours come with it.",
  },
  {
    key: "product",
    short: "product page",
    node: <ProductScreen cell={60} />,
    label: "The product page, still working: the coat, its colours and the size grid with M selected.",
  },
  {
    key: "bag",
    short: "bag",
    node: <BagScreen cell={52} />,
    label: "The bag, still working: the change-size sheet with 4XL selected.",
  },
  {
    key: "guide",
    short: "size guide",
    node: <GuideScreen cell={60} />,
    label: "The size guide, still working: the size grid with 2XL selected and its measurements.",
  },
  {
    key: "filters",
    short: "filters",
    node: <Filters />,
    label: "The filters, still working: the colour filter with Browns selected, and size, price and sort.",
  },
];

/* the ask, the slot and the trim stay in view; the chip group and the
   four places the chip lives sit behind Show all 8 (job F) */
export function FedShipped({ label, moreLabel }: { label: string; moreLabel: string }) {
  return (
    <Picture
      label={label}
      panels={SHIPPED_PANELS}
      swipe="Asked for versus shipped"
      phoneFirst="product"
      more={{
        label: moreLabel,
        total: 8,
        node: (
          <div className={s.shipped}>
            <ChipGroupCard />

            <span className={s.whyHead}>Why a slot: every one of these kept working, and the new card got its own</span>

            <div className={s.screens}>
              <ProductScreen cell={65} />
              <BagScreen cell={58} />
              <GuideScreen cell={65} />
            </div>

            <Filters />
          </div>
        ),
      }}
    >
      <div className={s.shipped}>
        <div className={s.shippedTop}>
          <Asked />
          <Kept />
          <TrimCard />
        </div>
      </div>
    </Picture>
  );
}
