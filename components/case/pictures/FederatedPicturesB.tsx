import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Bell, Check as CheckGlyph, Code, Component, Heart, NavArrowDown, NavArrowRight, NavArrowUp, Position, Xmark } from "iconoir-react";
import { KitAvatar, KitButton, KitChip, KitStatus, KitTag, KitTheme, MarkupBadge } from "@/components/case/kit/Kit";
import ScaledArt from "@/components/case/ScaledArt";
import s from "./FederatedPicturesB.module.css";

/* Federated figures 3 to 6 as live pictures (Site v3, Figma
   e7U5Hxpr441rT719SPclas, Figure · Two lanes 293:22606, Intake flow and
   board 293:22750, KPI tree and Pareto 293:22932, Asked for vs shipped
   293:22181). Each draws inside the figure stage at the 1440 design width
   (928) and scales to fit: the 390 frames are the same pictures scaled, not
   restacked. The picture names itself (role="img"); everything inside is
   decorative to the page. */

function Picture({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={s.root}>
      <div aria-hidden="true">
        <KitTheme mode="federated">
          <ScaledArt width={928}>{children}</ScaledArt>
        </KitTheme>
      </div>
    </div>
  );
}

const Accent = () => <span className={s.accent} />;

/* ── Figure 4 · Two lanes ─────────────────────────────────────────── */
const PEOPLE = ["avatar-r9", "avatar-r4", "avatar-r6", "avatar-r10"];

export function FedTwoLanes({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.lanes}>
        <div className={s.lanesTop}>
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
          <div className={`${s.card} ${s.darkMode}`}>
            <Accent />
            <span className={s.ring}>84/84</span>
            <span className={s.body}>Brand tokens ready for dark mode. Design stopped being the blocker.</span>
          </div>
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
        </div>
        <div className={`${s.card} ${s.people}`}>
          <span className={s.stack}>
            {PEOPLE.map((p) => (
              <KitAvatar key={p} src={`/images/kit/${p}.jpg`} size={32} className={s.stackAvatar} />
            ))}
          </span>
          <span className={s.peopleHead}>What stayed with people:</span>
          <span className={s.body}>component names, props and structure, and which requests to close. Decided with the platform devs.</span>
        </div>
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

export function FedIntake({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.intake}>
        <div className={`${s.card} ${s.timelines}`}>
          <Accent />
          <span className={s.title}>When did the system team hear about it?</span>
          <Lane kind="fail" head="Before: after the build" steps={BEFORE} />
          <span className={s.rule} />
          <Lane kind="pass" head="After: before the build" steps={AFTER} />
        </div>
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

export function FedKpi({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.kpi}>
        <div className={`${s.card} ${s.slide}`}>
          <span className={s.eyebrow}>
            <Accent />
            State of the design system · July
          </span>
          <span className={s.slideTitle}>Clean the system before scaling AI</span>
          <span className={s.columns}>
            <span className={s.ask}>
              <span className={s.askTitle}>The ask: phase 1</span>
              <Bullets
                className={s.askList}
                items={["Bridge design and code on the top components", "Machine-readable descriptions", "One sprint, no new budget", "Phases 2 and 3 only if phase 1 works"]}
              />
            </span>
            <span className={s.cells}>
              {CASE.map(([h, t]) => (
                <span key={h} className={s.cell}>
                  <span className={s.label16}>{h}</span>
                  <span className={s.body}>{t}</span>
                </span>
              ))}
            </span>
          </span>
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
        </div>
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

export function FedShipped({ label }: { label: string }) {
  return (
    <Picture label={label}>
      <div className={s.shipped}>
        <div className={s.shippedTop}>
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
          <div className={`${s.card} ${s.trimCard}`}>
            <span className={s.title18}>The stock marks, aligned</span>
            <span className={s.trimPair}>
              <TrimBox on={false} />
              <TrimBox on />
            </span>
            <span className={s.body}>
              The designer asked for a new component and negative spacing to fix the mark. I said no: a Trim property on the icon removes its padding, so the notify bell and the last-units mark line up with the size, and every other icon stays as it is.
            </span>
          </div>
        </div>

        <ChipGroupCard />

        <span className={s.whyHead}>Why a slot: every one of these kept working, and the new card got its own</span>

        <div className={s.screens}>
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
            <SizeGrid cells={ROWS("M", ["XXS", "2XL"], ["3XL", "4XL"])} w={65} h={46} />
            <span className={s.legend}>Last units</span>
            <span className={s.link}>Size guide</span>
            <span className={s.actions}>
              <KitButton className={s.add}>Add</KitButton>
              <span className={s.fav}>
                <Heart />
              </span>
            </span>
          </div>
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
              <SizeGrid cells={ROWS("4XL", ["XXS", "2XL"], ["1XL", "3XL"])} w={58} h={44} />
              <KitButton className={s.confirm}>Confirm</KitButton>
            </span>
          </div>
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
            <SizeGrid cells={ROWS("2XL", [], [])} w={65} h={44} />
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
                ))
              )}
            </span>
          </div>
        </div>

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
      </div>
    </Picture>
  );
}
