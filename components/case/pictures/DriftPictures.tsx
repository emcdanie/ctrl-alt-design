import type { CSSProperties, ReactNode } from "react";
import ScaledArt from "@/components/case/ScaledArt";
import Swipe from "@/components/case/Swipe";
import caseStyles from "@/components/case/Case.module.css";
import { KitAvatar, KitButton, KitChip, KitInput, KitPanel, KitStatus, KitTag, KitUserRow, MarkupBadge, MarkupNote, MarkupRing, kitLeader } from "@/components/case/kit/Kit";
import s from "./DriftPictures.module.css";

/* Drift figures 1, 2 and 8 (and the hero pieces) as live pictures (Site v3, Figma e7U5Hxpr441rT719SPclas:
   Visual · Team survey 293:2239, Visual · 17 buttons audit 293:2284, Visual ·
   Shipped on the system 293:3253). Each is drawn at its 1440 design size and
   scaled to fit the stage above 640px; below it, a swipe of full-size
   panels (job 38: no shrunk desktop picture on a phone, text 14px or
   more). A picture or panel names itself with role="img"; everything
   inside is aria-hidden. */

/** one phone swipe panel: names itself, its inside is aria-hidden */
function Panel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={s.panel}>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

const AVATAR = "/images/kit";

/* ---------- Figure 1: what support and sales told me ---------- */

const FINDINGS: [string, string, string, string][] = [
  ["Most", "had", "walked a customer through a booking", "."],
  ["More than half", "said", "changing a booking", "was hard."],
  ["More than 4 in 10", "had", "lost a booking", "to complexity."],
  ["More than half", "spent", "an hour or more a week", "helping customers book."],
];

const FINDING_SHORT = ["walked through", "changing", "lost a booking", "an hour a week"];

const findingText = ([lead, verb, mark, rest]: (typeof FINDINGS)[number]) =>
  `${lead} ${verb} ${mark}${rest === "." ? "." : ` ${rest}`}`;

export function DriftSurvey() {
  return (
    <>
      <div
        className={`${s.root} ${caseStyles.wideOnly}`}
        style={{ "--art-w": 944 } as CSSProperties}
        role="img"
        aria-label="What support and sales told me, from my survey of 28 people: most had walked a customer through a booking; more than half said changing a booking was hard; more than 4 in 10 had lost a booking to complexity; more than half spent an hour or more a week helping customers book."
      >
        <ScaledArt width={1008}>
          <div className={s.bleed} aria-hidden="true">
            <KitPanel className={s.survey}>
              <div className={s.surveyHead}>
                <span className={s.surveyEyebrow}>WHAT SUPPORT AND SALES TOLD ME</span>
                <span className={s.surveyMeta}>My survey of 28 people in support and sales, in words</span>
              </div>
              {FINDINGS.map(([lead, verb, mark, rest], i) => (
                <div className={s.finding} key={i}>
                  <span className={s.findingNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.findingLine}>
                    <span className={s.findingLead}>{lead}</span>
                    <span className={s.findingWord}>{verb}</span>
                    {rest === "." ? (
                      <span className={s.findingStop}>
                        <span className={s.findingMark}>{mark}</span>
                        <span className={s.findingWord}>{rest}</span>
                      </span>
                    ) : (
                      <>
                        <span className={s.findingMark}>{mark}</span>
                        <span className={s.findingWord}>{rest}</span>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </KitPanel>
          </div>
        </ScaledArt>
      </div>
      <div className={caseStyles.phoneOnly}>
        <Swipe
          label="What support and sales told me: four findings"
          keep={2}
          items={FINDINGS.map((f, i) => ({
            key: f[2],
            short: FINDING_SHORT[i],
            node: (
              <Panel label={`Finding ${i + 1} of 4, from my survey of 28 people in support and sales: ${findingText(f)}`}>
                <KitPanel className={s.phoneCard}>
                  <span className={s.phoneEyebrow}>
                    {String(i + 1).padStart(2, "0")} · what support and sales told me
                  </span>
                  <span className={s.phoneFinding}>
                    <span className={s.findingLead}>{f[0]}</span> <span className={s.findingWord}>{f[1]}</span>{" "}
                    <span className={s.findingMark}>{f[2]}</span>
                    {f[3] === "." ? <span className={s.findingWord}>.</span> : <span className={s.findingWord}> {f[3]}</span>}
                  </span>
                  <span className={s.phoneMeta}>My survey of 28 people in support and sales, in words</span>
                </KitPanel>
              </Panel>
            ),
          }))}
        />
      </div>
    </>
  );
}

/* ---------- Figure 2: 17 buttons in production ---------- */

/* The 16 drifted buttons, in the Figma "Buttons" frame's own units
   (501.42 x 236.42). They fail contrast and the type rules on purpose, so
   they are an SVG drawing inside the picture, never live controls. */
type Drifted = { x: number; y: number; w: number; h: number; r: number; fill: string; label: string; size: number; weight: number; track?: number; };

/* the six annotations: [label, side, y] in picture units (928 x 370.45) */
const NOTES: [string, "left" | "right", number][] = [
  ["Square corners", "left", 105.24],
  ["All caps", "left", 232.47],
  ["Second font", "left", 298.89],
  ["No radius at all", "right", 105.24],
  ["Full pill", "right", 232.47],
  ["Light weight, pale", "right", 298.89],
];

/* the leaders: [x from, x to, y, arrow points at the "to" end] */
const BUTTON_LEADERS: [number, number, number][] = [
  [165.58, 207.68, 124.89],
  [113.2, 207.68, 252.11],
  [145.94, 207.68, 318.53],
  [764.29, 720.32, 124.89],
  [821.35, 658.58, 252.11],
  [741.84, 623.03, 318.53],
];

function arrowHead(x: number, y: number, dir: 1 | -1) {
  return `M${x - dir * 6.55} ${y - 4.68} L${x} ${y} L${x - dir * 6.55} ${y + 4.68}`;
}

/* the phone panel 2: each callout with the button it names (DRIFTED
   numbers, the same buttons the wide picture's leaders point at) */
const NOTE_BUTTON: [string, number][] = [
  ["Square corners", 1],
  ["No radius at all", 5],
  ["All caps", 10],
  ["Full pill", 12],
  ["Second font", 13],
  ["Light weight, pale", 16],
];

export function DriftButtons() {
  return (
    <>
      <div
        className={`${s.root} ${caseStyles.wideOnly}`}
        style={{ "--art-w": 928 } as CSSProperties}
        role="img"
        aria-label="Buttons in production: 17 buttons that all mean 'book a stay', labelled for their differences: square corners, no radius at all, all caps, full pill, a second font, light weight and pale. The set is tagged Drifted; one is ringed and tagged Kept, the one the system kept."
      >
        <ScaledArt width={992}>
          <div className={s.bleed} aria-hidden="true">
            <div className={s.buttonsArt}>
              <KitPanel className={s.auditCard}>
                <div className={s.auditHead}>
                  <span className={s.auditTitle}>
                    Buttons in production <span className={s.auditCount}>17</span>
                  </span>
                  <span className={s.auditFilter}>One job: book a stay</span>
                </div>
                <div className={s.auditButtons}>
                  {/* the drift itself: off-brand fills that miss AA on purpose, so a
                     flat picture, never live DOM (CLAUDE.md section 9) */}
                  <img className={s.drifted} src="/images/kit/drift-17-buttons.svg" width={501} height={236} alt="" />
                  {/* RESERVE's near-black fill sinks into the dark card: an edge
                     in the border token, dark theme only (job 38) */}
                  <span className={s.reserveEdge} />
                  <span className={s.kept}>
                    <MarkupRing />
                    <KitButton className={s.keptButton}>Book now</KitButton>
                  </span>
                  {/* the verdicts sit inside the card's bottom edge (Elleta,
                     5 Oct): "Drifted" for the set, and "Kept" on a leader
                     that drops from the ring through the row-4 gutter */}
                  <svg className={s.keptLeader} viewBox="0 0 12 80" width="12" height="80">
                    <circle className={s.leaderDot} cx="6" cy="2.9" r="2.9" />
                    <path className={kitLeader} d="M6 2.9V80" />
                  </svg>
                  <MarkupBadge kind="fail" className={s.auditFail}>
                    Drifted
                  </MarkupBadge>
                  <MarkupBadge kind="pass" className={s.keptTag}>
                    Kept
                  </MarkupBadge>
                </div>
              </KitPanel>
              <svg className={s.overlay} viewBox="0 0 928 370.45" width="928" height="370.45">
                {BUTTON_LEADERS.map(([a, b, y]) => (
                  <g key={`${a}-${y}`} className={kitLeader}>
                    <path d={`M${a} ${y} H${b}`} />
                    <path d={arrowHead(b, y, b > a ? 1 : -1)} className={s.arrowHead} />
                  </g>
                ))}
              </svg>
              {NOTES.map(([label, side, y]) => (
                <span key={label} className={s.calloutSlot} data-side={side} style={{ top: y }}>
                  <MarkupNote tone="neutral" dot className={s.callout}>
                    {label}
                  </MarkupNote>
                </span>
              ))}
            </div>
          </div>
        </ScaledArt>
      </div>
      <div className={caseStyles.phoneOnly}>
        <Swipe
          label="Buttons in production, 17 for one job"
          items={[
            {
              key: "set",
              short: "the set",
              node: (
                <Panel label="Buttons in production: 17 buttons that all mean 'book a stay', each its own fill, radius and type. The set is tagged Drifted; the ringed Book now is tagged Kept, the one the system kept.">
                  <KitPanel className={s.phoneCard}>
                    <span className={s.phoneHead}>
                      <span className={s.auditTitle}>
                        Buttons in production <span className={s.auditCount}>17</span>
                      </span>
                      <span className={s.auditFilter}>One job: book a stay</span>
                    </span>
                    <span className={s.phoneSet}>
                      {DRIFTED.map((_, k) => (
                        <DriftedButton key={k} n={k + 1} />
                      ))}
                      <span className={s.ringed}>
                        <KitButton className={s.phoneKept}>Book now</KitButton>
                        <MarkupRing />
                      </span>
                    </span>
                    <span className={s.phoneVerdicts}>
                      <MarkupBadge kind="fail">Drifted</MarkupBadge>
                      <MarkupBadge kind="pass">Kept</MarkupBadge>
                    </span>
                  </KitPanel>
                </Panel>
              ),
            },
            {
              key: "notes",
              short: "what drifted",
              node: (
                <Panel label="What drifted, six differences: Book with square corners; RESERVE with no radius at all; BOOK in all caps; Confirm as a full pill; RESERVE NOW in a second font; Select room in a light, pale weight.">
                  <KitPanel className={s.phoneCard}>
                    <span className={s.auditTitle}>What drifted</span>
                    <span className={s.phoneNotes}>
                      {NOTE_BUTTON.map(([label, n]) => (
                        <span key={label} className={s.phoneNote}>
                          <MarkupNote tone="neutral" dot className={s.phoneCallout}>
                            {label}
                          </MarkupNote>
                          <DriftedButton n={n} />
                        </span>
                      ))}
                    </span>
                  </KitPanel>
                </Panel>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}

/* ---------- Figure 8: shipped on the system ---------- */

/* leaders in the Figma Picture's units (928 x 674.73): an elbow from each
   atom's dot to the part it builds */
const DOT_X = 235.87;
const END_X = 365.4;
const ATOM_LEADERS: [number, number, number][] = [
  // [from y (atom), elbow x, to y (product part)]
  [201.07, 251.7, 72.5], // input -> search field
  [270.67, 263.4, 72.5], // chip -> search filters
  [340.27, 275.5, 134.37], // button -> Select
  [340.27, 287.1, 347.52], // button -> Pay
  [409.87, 299.3, 473.67], // avatar -> users
  [479.47, 311.9, 473.67], // tag -> users
];

function LockGlyph() {
  return (
    <svg className={s.lock} viewBox="0 0 14 14" width="14" height="14">
      <rect x="2.5" y="6" width="9" height="6.5" rx="1.5" />
      <path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" />
    </svg>
  );
}

function CarrierMark() {
  return (
    <svg className={s.carrier} viewBox="0 0 32 32" width="32" height="32">
      <rect width="32" height="32" rx="7" className={s.carrierGround} />
      <path d="M9 22 L19 9 L19 22 Z M13 17 L23 17" className={s.carrierGlyph} />
      <path d="M8 25 H24" className={s.carrierStripe} />
    </svg>
  );
}

const ATOMS: [string, ReactNode][] = [
  [
    "Input",
    <KitInput key="i" className={`${s.atomInput} ${s.kitFloor}`}>
      Where to?
    </KitInput>,
  ],
  [
    "Chip",
    <KitChip key="c" selected className={s.kitFloor}>
      Direct
    </KitChip>,
  ],
  [
    "Button",
    <KitButton key="b" size="sm" className={s.kitFloor}>
      Book
    </KitButton>,
  ],
  ["Avatar", <KitAvatar key="a" src={`${AVATAR}/drift-avatar-atom.jpg`} size={32} />],
  ["Tag", <KitTag key="t" className={s.kitFloor}>Admin</KitTag>],
];

/* Figure 8's parts, drawn once: the wide picture places them, the phone
   swipe shows one per panel */
function AtomsPanel({ className }: { className: string }) {
  return (
    <KitPanel className={className}>
      <span className={s.atomsTitle}>Atoms</span>
      <span className={s.atomsLead}>Small parts, designed once.</span>
      <span className={s.atomRows}>
        {ATOMS.map(([label]) => (
          <AtomRow key={label} atom={label} />
        ))}
      </span>
    </KitPanel>
  );
}

/** `short`: the phone panel's search reads only the route, so the field
 *  fits the panel without wrapping */
function SearchArea({ short = false }: { short?: boolean }) {
  return (
    <KitPanel className={s.area}>
      <span className={s.areaHead}>
        <span className={s.areaTitle}>Search</span>
        <KitStatus className={s.kitFloor}>Live</KitStatus>
      </span>
      <span className={s.searchRow}>
        <span className={s.ringed}>
          <KitInput search className={`${s.searchInput} ${s.kitFloor}`}>
            {short ? <>Lisbon {"→"} Amsterdam</> : <>Lisbon {"→"} Amsterdam {"·"} 12 Oct {"·"} 1 adult</>}
          </KitInput>
          <MarkupRing />
        </span>
        <span className={s.ringed}>
          <KitChip selected className={s.kitFloor}>
            Direct
          </KitChip>
          <MarkupRing />
        </span>
        <KitChip className={s.kitFloor}>Morning</KitChip>
      </span>
      <span className={s.result}>
        <CarrierMark />
        <span className={s.times}>
          <span className={s.timesMain}>08:10 {"→"} 11:55</span>
          <span className={s.timesSub}>
            LIS {"·"} AMS {"·"} 2h 45m, direct
          </span>
        </span>
        <span className={s.price}>{"€"}89</span>
        <span className={s.ringed}>
          <KitButton size="sm" className={s.kitFloor}>
            Select
          </KitButton>
          <MarkupRing />
        </span>
      </span>
    </KitPanel>
  );
}

function CheckoutArea() {
  return (
    <KitPanel className={s.area}>
      <span className={s.areaHead}>
        <span className={s.areaTitle}>Checkout and payment</span>
        <KitStatus className={s.kitFloor}>Live</KitStatus>
      </span>
      <span className={s.line}>
        <span>Harbour loft, 3 nights</span>
        <span>{"€"}426</span>
      </span>
      <span className={s.line}>
        <span>Taxes and fees</span>
        <span>{"€"}12</span>
      </span>
      <span className={s.payRow}>
        <span className={s.totalStack}>
          <span className={s.totalLabel}>Total</span>
          <span className={s.totalValue}>{"€"}438</span>
        </span>
        <span className={s.pay}>
          <span className={s.secure}>
            <LockGlyph />
            Secure
          </span>
          <span className={s.ringed}>
            <KitButton size="sm" className={s.kitFloor}>
              Pay {"€"}438
            </KitButton>
            <MarkupRing />
          </span>
        </span>
      </span>
    </KitPanel>
  );
}

function UsersArea() {
  return (
    <KitPanel className={s.area}>
      <span className={s.areaHead}>
        <span className={s.areaTitle}>Users and roles</span>
        <KitStatus className={s.kitFloor}>Live</KitStatus>
      </span>
      <span className={s.users}>
        <KitUserRow avatar={`${AVATAR}/drift-avatar-ana.jpg`} name="Ana Rossi" email="ana@company.example" role="Admin" />
        <KitUserRow avatar={`${AVATAR}/drift-avatar-marc.jpg`} name="Marc Silva" email="marc@company.example" role="Editor" />
        <KitUserRow avatar={`${AVATAR}/drift-avatar-lena.jpg`} name="Lena Novak" email="lena@company.example" role="Viewer" />
      </span>
    </KitPanel>
  );
}

function AlsoLive({ className }: { className: string }) {
  return (
    <span className={className}>
      <span className={s.alsoLabel}>Also live on the system:</span>
      {["Design system", "Flights", "Cars"].map((area) => (
        <span className={s.alsoChip} key={area}>
          <span className={s.alsoDot} />
          {area}
        </span>
      ))}
      <span className={s.alsoNext}>Next: flight extras, nearly done</span>
    </span>
  );
}

const SHIPPED_PANELS: { key: string; short: string; label: string; node: ReactNode }[] = [
  {
    key: "atoms",
    short: "atoms",
    label: "Atoms, small parts designed once: an input, a chip, a button, an avatar and a tag.",
    node: <AtomsPanel className={s.atoms} />,
  },
  {
    key: "search",
    short: "search",
    label: "Search, live on the system: the input, the Direct chip and the Select button are the atoms, ringed.",
    node: <SearchArea short />,
  },
  {
    key: "checkout",
    short: "checkout",
    label: "Checkout and payment, live on the system: the Pay button is the button atom, ringed.",
    node: <CheckoutArea />,
  },
  {
    key: "users",
    short: "users and roles",
    label: "Users and roles, live on the system: three people built from the avatar and tag atoms, tagged Admin, Editor and Viewer.",
    node: <UsersArea />,
  },
  {
    key: "also",
    short: "also live",
    label: "Also live on the system: Design system, Flights, Cars. Next: flight extras, nearly done.",
    node: <AlsoLive className={s.alsoPanel} />,
  },
];

export function DriftShipped() {
  return (
    <>
      <div
        className={`${s.root} ${caseStyles.wideOnly}`}
        style={{ "--art-w": 960 } as CSSProperties}
        role="img"
        aria-label="Atoms, small parts designed once (input, chip, button, avatar, tag), wired to the product areas they build: Search, Checkout and payment, and Users and roles, each marked Live. Also live on the system: Design system, Flights, Cars. Next: flight extras, nearly done."
      >
        <ScaledArt width={1024}>
          <div className={s.bleed} aria-hidden="true">
            <div className={`${s.shippedArt} ${s.floor}`}>
              <AtomsPanel className={`${s.atoms} ${s.atomsAt}`} />

              <span className={s.areas}>
                <SearchArea />
                <CheckoutArea />
                <UsersArea />
              </span>

              <svg className={s.overlay} viewBox="0 0 928 674.73" width="960" height="698">
                {ATOM_LEADERS.map(([fy, ex, ty]) => (
                  <g key={`${fy}-${ex}`}>
                    <path className={kitLeader} d={`M${DOT_X} ${fy} H${ex} V${ty} H${END_X}`} />
                    <path className={`${kitLeader} ${s.arrowHead}`} d={arrowHead(END_X, ty, 1)} />
                    <circle className={s.leaderDot} cx={DOT_X + 2.9} cy={fy} r="2.9" />
                  </g>
                ))}
              </svg>

              <AlsoLive className={`${s.alsoLive} ${s.alsoAt}`} />
            </div>
          </div>
        </ScaledArt>
      </div>
      <div className={caseStyles.phoneOnly}>
        <Swipe
          label="Shipped on the system: the atoms, then each product area"
          keep={2}
          items={SHIPPED_PANELS.map((p) => ({
            key: p.key,
            short: p.short,
            node: (
              <Panel label={p.label}>
                <span className={`${s.floor} ${s.phoneShip}`}>{p.node}</span>
              </Panel>
            ),
          }))}
        />
      </div>
    </>
  );
}

/* ---------- Figure 5 and the case hero: the Harbour loft stay card ----------
   (Elleta, 4 Oct late: no PNG pictures left, so both follow the theme.)
   The same card in both places. Its photo is a 600px source, so the card
   is never wider than 300 CSS px (audit:sharp, 2x). */

const KIT = "/images/kit";

function Line({ d, className }: { d: string[]; className: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none">
      {d.map((p) => (
        <path key={p} d={p} />
      ))}
    </svg>
  );
}

const AMENITIES: [string, string[]][] = [
  ["2 beds", ["M2.5 16V5", "M2.5 12.5h15V16", "M17.5 12.5V10a2 2 0 0 0-2-2H9v4.5"]],
  ["1 bath", ["M5 10V5.5a2 2 0 0 1 3.5-1.3", "M2.5 10h15v1.5a4 4 0 0 1-4 4h-7a4 4 0 0 1-4-4Z", "M5.5 15.5 4.5 17.5", "M14.5 15.5l1 2"]],
  ["Wi-Fi", ["M2.5 8a11 11 0 0 1 15 0", "M5 11a7 7 0 0 1 10 0", "M7.6 13.9a3.4 3.4 0 0 1 4.8 0", "M10 16.6h.01"]],
  ["Parking", ["M4.8 15H4a1 1 0 0 1-1-1v-3l1.8-3.6a2 2 0 0 1 1.8-1.1h6.8a2 2 0 0 1 1.8 1.1L17 11v3a1 1 0 0 1-1 1h-.8", "M8.2 15h3.6", "M3 11h14", "M8 15a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z", "M15 15a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"]],
];

const STAR = "M10 2.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 7.8l5-.7Z";

/** `count={false}` drops the photo's "1 / 8": the hero collage, where the
 *  list overlaps the photo's left edge (job 38: no text under a card) */
export function StayCard({ className = "", count = true }: { className?: string; count?: boolean }) {
  return (
    <div className={`${s.stay} ${className}`.trim()}>
      <div className={s.stayPhoto}>
        <img src={`${KIT}/stay-harbour.jpg`} width={600} height={400} alt="" loading="lazy" decoding="async" />
        <span className={s.stayControl} data-at="start">
          <Line className={s.stayGlyph} d={["M10 15.8 4.2 10 10 4.2", "M15.8 10H4.2"]} />
        </span>
        <span className={s.stayControl} data-at="end">
          <Line className={s.stayGlyph} d={["M16 11.7c1.2-1.2 2.5-2.7 2.5-4.6a4.6 4.6 0 0 0-4.6-4.6c-1.5 0-2.5.4-3.9 1.7C8.6 2.9 7.6 2.5 6.1 2.5a4.6 4.6 0 0 0-4.6 4.6c0 1.9 1.3 3.4 2.5 4.6l6 6Z"]} />
        </span>
        {count ? <span className={s.stayCount}>1 / 8</span> : null}
      </div>
      <div className={s.stayBody}>
        <span className={s.stayTitle}>Harbour loft</span>
        <span className={s.stayWhere}>
          <Line className={s.stayPin} d={["M16.5 8.3c0 5-6.5 9.2-6.5 9.2S3.5 13.3 3.5 8.3a6.5 6.5 0 0 1 13 0Z", "M10 10.8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"]} />
          Old town, by the water
        </span>
        <span className={s.stayRating}>
          <span className={s.stayStars}>
            {[0, 1, 2, 3, 4].map((k) => (
              <svg key={k} viewBox="0 0 20 20" className={s.stayStar}>
                <path d={STAR} />
              </svg>
            ))}
          </span>
          <span className={s.stayScore}>4.9</span>
          <span className={s.stayReviews}>(23 reviews)</span>
        </span>
        <span className={s.stayAmenities}>
          {AMENITIES.map(([label, d]) => (
            <span key={label} className={s.stayAmenity}>
              <Line className={s.stayAmenityGlyph} d={d} />
              {label}
            </span>
          ))}
        </span>
        <span className={s.stayFoot}>
          <KitButton className={s.stayBook}>Book now</KitButton>
          <span className={s.stayPrice}>
            €142 <span className={s.stayNight}>/ night</span>
          </span>
        </span>
      </div>
    </div>
  );
}

/* the drifted list: every row its own type and capitalisation. Its row
   buttons left the hero (job 41b, Elleta: nothing half-hidden under the
   stay card); the loose drifted buttons below carry the button drift */
export function DriftedList({ className = "" }: { className?: string }) {
  return (
    <div className={`${s.drift} ${className}`.trim()}>
      <span className={s.driftHead}>
        Stays in Lisbon <span className={s.driftCount}>(42)</span>
      </span>
      <span className={s.driftRow}>
        <img className={s.driftThumb} data-shape="square" src={`${KIT}/stay-canal.webp`} width={576} height={384} alt="" loading="lazy" decoding="async" />
        <span className={s.driftText}>
          <span className={s.driftNameA}>Canal House Suite</span>
          <span className={s.driftStarsA}>★★★★☆ 4.6</span>
          <span className={s.driftPriceA}>€96</span>
        </span>
      </span>
      <span className={s.driftRow}>
        <img className={s.driftThumb} data-shape="round" src={`${KIT}/stay-oldtown.webp`} width={300} height={200} alt="" loading="lazy" decoding="async" />
        <span className={s.driftText}>
          <span className={s.driftNameB}>OLD TOWN LOFT</span>
          <span className={s.driftStarsB}>4.8 stars</span>
          <span className={s.driftPriceB}>€142 /nt</span>
        </span>
      </span>
      <span className={s.driftPerk}>Free cancellation!!</span>
    </div>
  );
}

/* ---------- the case hero and showcase: single pieces ----------
   Clones for CaseHero's collage and CaseShowcase's cards, drawn by the
   same code as the figures. */

/* the 16 drifted buttons of Figure 2, cropped from the same picture
   (the drift misses AA on purpose, so it stays a flat picture, never
   live DOM; CLAUDE.md section 9): [x, y, w, h] in its units */
const DRIFTED: [number, number, number, number][] = [
  [0, 4.24, 61.94, 34.97],
  [76.9, 3.37, 106.42, 36.71],
  [198.29, 0, 101.68, 43.45],
  [314.94, 3.31, 79.19, 36.84],
  [409.1, 3.87, 92.16, 35.71],
  [0, 62.16, 134.42, 41.58],
  [149.39, 62.6, 108.9, 40.71],
  [273.26, 67.4, 64.19, 31.1],
  [352.42, 63.6, 75.94, 38.71],
  [0, 131.44, 69.68, 32.97],
  [84.65, 126.19, 127.16, 43.45],
  [353.65, 129.5, 85.68, 36.84],
  [0, 195.47, 111.94, 37.58],
  [126.9, 196.77, 40.45, 34.97],
  [182.32, 192.1, 103.16, 44.32],
  [300.45, 195.84, 103.06, 36.84],
];

/** one drifted button, 1 to 16, as Figure 2 draws it */
export function DriftedButton({ n }: { n: number }) {
  const [x, y, w, h] = DRIFTED[n - 1];
  return (
    <span className={s.driftedOne} data-n={n} style={{ width: w, height: h }}>
      <img src="/images/kit/drift-17-buttons.svg" width={501} height={236} alt="" style={{ left: -x, top: -y }} />
    </span>
  );
}

/** a token pinned as Figure 5 pins it: the name, with its swatch. In the
 *  hero collage a pin may `float` (a 6px drift, 4s) and `swap` its swatch
 *  once, about 1s after load (Elleta, 5 Oct); reduced motion keeps both
 *  still on the first state. */
export function TokenPin({ token, swatch, float = false, swap = false }: { token: string; swatch?: string; float?: boolean; swap?: boolean }) {
  return (
    <MarkupNote tone="neutral" className={`${s.pin} ${float ? s.pinFloat : ""}`.trim()}>
      {swatch ? <span className={`${s.pinSwatch} ${swap ? s.pinSwap : ""}`.trim()} style={{ background: swatch }} /> : null}
      {token}
    </MarkupNote>
  );
}

/* ---------- the showcase, "17 → 1 → everywhere" (Elleta, 5 Oct) ---------- */

/** card 1: the drifted buttons, under their count */
export function DriftedSet() {
  return (
    <span className={s.driftedSet}>
      <span className={s.countPill}>17</span>
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <DriftedButton key={n} n={n} />
      ))}
    </span>
  );
}

/* card 2: the system button with three pins. In the piece's own units
   (232 wide, the card's inner width at 390): [token, swatch, the dot on
   the button]. Each leader drops from its dot down the button's left
   gutter, then runs right to an arrow at its pin; the rightmost dot takes
   the top pin, so no two leaders cross. */
const MINI_PIN_X = 44;
const MINI_ROW_Y = (k: number) => 76 + k * 48;
const MINI_PINS: [string, string | undefined, number, number][] = [
  ["text.primary", "var(--color-semantic-text-primary)", 29, 34],
  ["action.primary", "var(--kit-action)", 14, 22],
  ["radius 16", undefined, 4.7, 39.3],
];

export function ButtonAnatomyMini() {
  return (
    <span className={s.mini}>
      <KitButton className={s.miniButton}>Book now</KitButton>
      <svg className={s.miniLeaders} viewBox="0 0 232 196" width="232" height="196">
        {MINI_PINS.map(([t, , x, y], k) => (
          <g key={t}>
            <path className={kitLeader} d={`M${x} ${y} V${MINI_ROW_Y(k)} H${MINI_PIN_X}`} />
            <path className={`${kitLeader} ${s.arrowHead}`} d={arrowHead(MINI_PIN_X, MINI_ROW_Y(k), 1)} />
            <circle className={s.miniDot} cx={x} cy={y} r="3.5" />
          </g>
        ))}
      </svg>
      {MINI_PINS.map(([t, swatch], k) => (
        <span key={t} className={s.miniPin} style={{ top: MINI_ROW_Y(k) }}>
          <TokenPin token={t} swatch={swatch} />
        </span>
      ))}
    </span>
  );
}

/** one atom row of Figure 8 (Input, Chip, Button, Avatar, Tag) */
export function AtomRow({ atom }: { atom: string }) {
  const part = ATOMS.find(([label]) => label === atom);
  return part ? (
    <span className={s.atomRow}>
      <span className={s.atomLabel}>{part[0]}</span>
      {part[1]}
    </span>
  ) : null;
}

/* Figure 5: the card's parts pinned to the tokens they read. [token,
   swatch, side, y]: y is the part's centre in the 928-wide art (the card
   sits at x 314, y 32; see .anatomyCard) */
const PINS: [string, string, "left" | "right", number, number][] = [
  ["--radius-card", "transparent", "left", 32, 308],
  ["--text-primary", "var(--color-semantic-text-primary)", "left", 246, 330],
  ["--accent", "var(--color-semantic-accent)", "left", 303, 330],
  ["color.action.primary", "var(--kit-action)", "left", 438, 330],
  ["--text-secondary", "var(--color-semantic-text-secondary)", "right", 277, 622],
  ["--border-subtle", "var(--color-semantic-border)", "right", 328, 622],
  ["--surface-card", "var(--color-semantic-surface)", "right", 458, 622],
];

/* the phone panels after the card: the same pins, grouped */
const PIN_GROUPS: { key: string; title: string; pins: [string, string, string][] }[] = [
  {
    key: "text",
    title: "Text and colour",
    pins: [
      ["--text-primary", "var(--color-semantic-text-primary)", "the title"],
      ["--text-secondary", "var(--color-semantic-text-secondary)", "the location"],
      ["--accent", "var(--color-semantic-accent)", "the stars"],
      ["color.action.primary", "var(--kit-action)", "Book now"],
    ],
  },
  {
    key: "surface",
    title: "Surface",
    pins: [
      ["--surface-card", "var(--color-semantic-surface)", "the card"],
      ["--border-subtle", "var(--color-semantic-border)", "the dividers"],
      ["--radius-card", "transparent", "the corners"],
    ],
  },
];

export function DriftAnatomy() {
  return (
    <>
      <div
        className={`${s.root} ${caseStyles.wideOnly}`}
        style={{ "--art-w": 928 } as CSSProperties}
        role="img"
        aria-label="The Harbour loft stay card with each part pinned to its token: --radius-card on the corners, --text-primary on the title, --accent on the stars, color.action.primary on Book now, --text-secondary on the location, --border-subtle on the divider, --surface-card on the card."
      >
        <ScaledArt width={992}>
          <div className={s.bleed} aria-hidden="true">
            <div className={s.anatomyArt}>
              <StayCard className={s.anatomyCard} />
              <svg className={s.overlay} viewBox="0 0 928 510" width="928" height="510">
                {PINS.map(([t, , side, y, to]) => {
                  const from = side === "left" ? 258 : 670;
                  return (
                    <g key={t} className={kitLeader}>
                      <path d={`M${from} ${y} H${to}`} />
                      <path d={arrowHead(to, y, side === "left" ? 1 : -1)} className={s.arrowHead} />
                    </g>
                  );
                })}
              </svg>
              {PINS.map(([t, swatch, side, y]) => (
                <span key={t} className={s.pinSlot} data-side={side} style={{ top: y }}>
                  <TokenPin token={t} swatch={swatch} />
                </span>
              ))}
            </div>
          </div>
        </ScaledArt>
      </div>
      <div className={caseStyles.phoneOnly}>
        <Swipe
          label="One stay card and the tokens it reads"
          keep={2}
          items={[
            {
              key: "card",
              short: "the card",
              node: (
                <Panel label="The Harbour loft stay card: photo, title, location, a 4.9 rating, four amenities, Book now and 142 euros a night.">
                  <StayCard className={s.phoneStay} />
                </Panel>
              ),
            },
            ...PIN_GROUPS.map((g) => ({
              key: g.key,
              short: g.title.toLowerCase(),
              node: (
                <Panel label={`${g.title}: ${g.pins.map(([t, , part]) => `${t} on ${part}`).join(", ")}.`}>
                  <KitPanel className={s.phoneCard}>
                    <span className={s.auditTitle}>{g.title}</span>
                    <span className={s.phonePins}>
                      {g.pins.map(([t, swatch, part]) => (
                        <span key={t} className={s.phonePinRow}>
                          <TokenPin token={t} swatch={swatch} />
                          <span className={s.phoneMeta}>{part}</span>
                        </span>
                      ))}
                    </span>
                  </KitPanel>
                </Panel>
              ),
            })),
          ]}
        />
      </div>
    </>
  );
}
