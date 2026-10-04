import type { CSSProperties, ReactNode } from "react";
import ScaledArt from "@/components/case/ScaledArt";
import { KitAvatar, KitButton, KitChip, KitInput, KitPanel, KitStatus, KitTag, KitUserRow, MarkupBadge, MarkupNote, MarkupRing, kitLeader } from "@/components/case/kit/Kit";
import s from "./DriftPictures.module.css";

/* Drift figures 2, 3 and 9 as live pictures (Site v3, Figma e7U5Hxpr441rT719SPclas:
   Visual · Team survey 293:2239, Visual · 17 buttons audit 293:2284, Visual ·
   Shipped on the system 293:3253). Each is drawn at its 1440 design size and
   scaled to fit the stage (the 390 frames are the same picture, scaled). A
   picture names itself with role="img"; everything inside is aria-hidden. */

const AVATAR = "/images/kit";

/* ---------- Figure 2: what support and sales told me ---------- */

const FINDINGS: [string, string, string, string][] = [
  ["Most", "had", "walked a customer through a booking", "."],
  ["More than half", "said", "changing a booking", "was hard."],
  ["More than 4 in 10", "had", "lost a booking", "to complexity."],
  ["More than half", "spent", "an hour or more a week", "helping customers book."],
];

export function DriftSurvey() {
  return (
    <div
      className={s.root}
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
  );
}

/* ---------- Figure 3: 17 buttons in production ---------- */

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

export function DriftButtons() {
  return (
    <div
      className={s.root}
      style={{ "--art-w": 928 } as CSSProperties}
      role="img"
      aria-label="Buttons in production: 17 buttons that all mean 'book a stay', labelled for their differences: square corners, no radius at all, all caps, full pill, a second font, light weight and pale. One is ringed as the one the system kept."
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
                <span className={s.kept}>
                  <MarkupRing />
                  <KitButton className={s.keptButton}>Book now</KitButton>
                </span>
              </div>
            </KitPanel>
            <MarkupBadge kind="fail" size="md" className={s.auditFail} />
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
  );
}

/* ---------- Figure 9: shipped on the system ---------- */

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
    <KitInput key="i" className={s.atomInput}>
      Where to?
    </KitInput>,
  ],
  [
    "Chip",
    <KitChip key="c" selected>
      Direct
    </KitChip>,
  ],
  [
    "Button",
    <KitButton key="b" size="sm">
      Book
    </KitButton>,
  ],
  ["Avatar", <KitAvatar key="a" src={`${AVATAR}/drift-avatar-atom.jpg`} size={32} />],
  ["Tag", <KitTag key="t">Admin</KitTag>],
];

export function DriftShipped() {
  return (
    <div
      className={s.root}
      style={{ "--art-w": 960 } as CSSProperties}
      role="img"
      aria-label="Atoms, small parts designed once (input, chip, button, avatar, tag), wired to the product areas they build: Search, Checkout and payment, and Users and roles, each marked Live. Also live on the system: Design system, Flights, Cars. Next: flight extras, nearly done."
    >
      <ScaledArt width={1024}>
        <div className={s.bleed} aria-hidden="true">
          <div className={s.shippedArt}>
            <KitPanel className={s.atoms}>
              <span className={s.atomsTitle}>Atoms</span>
              <span className={s.atomsLead}>Small parts, designed once.</span>
              <span className={s.atomRows}>
                {ATOMS.map(([label, part]) => (
                  <span className={s.atomRow} key={label}>
                    <span className={s.atomLabel}>{label}</span>
                    {part}
                  </span>
                ))}
              </span>
            </KitPanel>

            <span className={s.areas}>
              <KitPanel className={s.area}>
                <span className={s.areaHead}>
                  <span className={s.areaTitle}>Search</span>
                  <KitStatus>Live</KitStatus>
                </span>
                <span className={s.searchRow}>
                  <span className={s.ringed}>
                    <KitInput search className={s.searchInput}>
                      Lisbon {"→"} Amsterdam {"·"} 12 Oct {"·"} 1 adult
                    </KitInput>
                    <MarkupRing />
                  </span>
                  <span className={s.ringed}>
                    <KitChip selected>Direct</KitChip>
                    <MarkupRing />
                  </span>
                  <KitChip>Morning</KitChip>
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
                    <KitButton size="sm">Select</KitButton>
                    <MarkupRing />
                  </span>
                </span>
              </KitPanel>

              <KitPanel className={s.area}>
                <span className={s.areaHead}>
                  <span className={s.areaTitle}>Checkout and payment</span>
                  <KitStatus>Live</KitStatus>
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
                      <KitButton size="sm">Pay {"€"}438</KitButton>
                      <MarkupRing />
                    </span>
                  </span>
                </span>
              </KitPanel>

              <KitPanel className={s.area}>
                <span className={s.areaHead}>
                  <span className={s.areaTitle}>Users and roles</span>
                  <KitStatus>Live</KitStatus>
                </span>
                <span className={s.users}>
                  <KitUserRow avatar={`${AVATAR}/drift-avatar-ana.jpg`} name="Ana Rossi" email="ana@company.example" role="Admin" />
                  <KitUserRow avatar={`${AVATAR}/drift-avatar-marc.jpg`} name="Marc Silva" email="marc@company.example" role="Editor" />
                  <KitUserRow avatar={`${AVATAR}/drift-avatar-lena.jpg`} name="Lena Novak" email="lena@company.example" role="Viewer" />
                </span>
              </KitPanel>
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

            <span className={s.alsoLive}>
              <span className={s.alsoLabel}>Also live on the system:</span>
              {["Design system", "Flights", "Cars"].map((area) => (
                <span className={s.alsoChip} key={area}>
                  <span className={s.alsoDot} />
                  {area}
                </span>
              ))}
              <span className={s.alsoNext}>Next: flight extras, nearly done</span>
            </span>
          </div>
        </div>
      </ScaledArt>
    </div>
  );
}

/* ---------- Figures 1 and 6: the Harbour loft stay card, live ----------
   (Elleta, 4 Oct late: no PNG pictures left, so both follow the theme.)
   The same card in both figures. Its photo is a 600px source, so the card
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

function StayCard({ className = "" }: { className?: string }) {
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
        <span className={s.stayCount}>1 / 8</span>
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

/* the drifted list: every row its own button, type and capitalisation */
function DriftedList({ className = "" }: { className?: string }) {
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
        <span className={s.driftBookA}>Book</span>
      </span>
      <span className={s.driftRow}>
        <img className={s.driftThumb} data-shape="round" src={`${KIT}/stay-oldtown.webp`} width={300} height={200} alt="" loading="lazy" decoding="async" />
        <span className={s.driftText}>
          <span className={s.driftNameB}>OLD TOWN LOFT</span>
          <span className={s.driftStarsB}>4.8 stars</span>
          <span className={s.driftPriceB}>€142 /nt</span>
        </span>
        <span className={s.driftBookB}>BOOK NOW</span>
      </span>
      <span className={s.driftPerk}>Free cancellation!!</span>
    </div>
  );
}

const F1_LABEL =
  "Before: a 'Stays in Lisbon' list where each row uses a different button, type and capitalisation, marked with a red cross. After: one Harbour loft stay card on the system, with one Book now button, marked with a green tick.";

export function DriftCover({ wideClass, phoneClass }: { wideClass: string; phoneClass: string }) {
  return (
    <>
      <div className={`${s.root} ${wideClass}`} style={{ "--art-w": 928 } as CSSProperties} role="img" aria-label={F1_LABEL}>
        <ScaledArt width={992}>
          <div className={s.bleed} aria-hidden="true">
            <div className={s.coverArt}>
              <DriftedList className={s.coverBefore} />
              <MarkupBadge kind="fail" size="md" className={s.coverFail} />
              <StayCard className={s.coverAfter} />
              <MarkupBadge kind="pass" size="md" className={s.coverPass} />
            </div>
          </div>
        </ScaledArt>
      </div>
      <div className={phoneClass} role="img" aria-label={F1_LABEL}>
        <div className={s.coverPhone} aria-hidden="true">
          <span className={s.coverLabel}>
            <MarkupBadge kind="fail" size="md" />
            Before · drifted
          </span>
          <DriftedList />
          <span className={s.coverLabel}>
            <MarkupBadge kind="pass" size="md" />
            After · on BELLA
          </span>
          <StayCard className={s.coverPhoneCard} />
        </div>
      </div>
    </>
  );
}

/* Figure 6: the card's parts pinned to the tokens they read. [token,
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

export function DriftAnatomy() {
  return (
    <div
      className={s.root}
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
                <MarkupNote tone="neutral" className={s.pin}>
                  <span className={s.pinSwatch} style={{ background: swatch }} />
                  {t}
                </MarkupNote>
              </span>
            ))}
          </div>
        </div>
      </ScaledArt>
    </div>
  );
}
