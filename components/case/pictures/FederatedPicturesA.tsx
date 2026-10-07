import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { KitAvatar, KitPanel, KitStatus, KitTag, KitTheme, MarkupBadge, MarkupNote } from "@/components/case/kit/Kit";
import ScaledArt from "@/components/case/ScaledArt";
import Swipe from "@/components/case/Swipe";
import ShowAll from "@/components/case/ShowAll";
import caseStyles from "@/components/case/Case.module.css";
import s from "./FederatedPicturesA.module.css";

/* Federated, Figures 1 and 2 (and the hero's product cards), as live pictures (Site v3; Figma
   e7U5Hxpr441rT719SPclas, 1440 293:20908 and 390 304:7219). Product
   theme mode "Federated": ink actions, no indigo. Each picture names
   itself (role="img"); everything inside is aria-hidden. Drawn at the
   1440 design size (928 inside the stage) and scaled to fit; Figure 2
   swipes below 640px, as the 390 frames do. `bare` draws a version
   without its markup (status, badge, markers): the hero collage. */

const AV = "/images/kit";
const av = (n: string) => `${AV}/avatar-${n}.webp`;

function Pic({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="img" aria-label={label} className={className || undefined}>
      <KitTheme mode="federated">
        <div aria-hidden="true" className={s.pic}>
          {children}
        </div>
      </KitTheme>
    </div>
  );
}

function Miss({ children }: { children: ReactNode }) {
  return (
    <MarkupNote>
      <span className={s.miss}>✗</span>
      {children}
    </MarkupNote>
  );
}

/* ── Figure 1 · Who serves whom ───────────────────────────────────── */
const F2_LABEL =
  "Who serves whom: a design manager who set priorities and backed the process, above the design system team of four designers (one running it, one lead on leave, one on leave, one out) with about 7 component libraries. Beside it, partners (marketing email templates, AI assistant design) and engineering (system tech leads and platform devs on Web, iOS and Android). Below, the product squads, each with its own designer: Checkout, Account and orders, Product page, Listing and search, Email, Assistant.";

const TEAM: { src: string; tag: string; lead?: boolean }[] = [
  { src: av("elleta"), tag: "Running it", lead: true },
  { src: av("r4"), tag: "Lead · leave" },
  { src: av("r8"), tag: "On leave" },
  { src: av("r6"), tag: "Out" },
];

const PLATFORMS = [
  { name: "Web", avs: [av("r27"), av("r23")] },
  { name: "iOS", avs: [av("r14")] },
  { name: "Android", avs: [av("r18"), av("r28")] },
];

const SQUADS = [
  { name: "Checkout", av: av("r11") },
  { name: "Account and orders", av: av("r21") },
  { name: "Product page", av: av("r13") },
  { name: "Listing and search", av: av("r15") },
  { name: "Email", av: av("r24") },
  { name: "Assistant", av: av("r26") },
];

function GroupHead({ icon, title, sub }: { icon: IconName; title: string; sub: string }) {
  return (
    <div className={s.groupHead}>
      <span className={s.groupIcon}>
        <Icon name={icon} size="md" />
      </span>
      <span>
        <span className={s.groupTitle}>{title}</span>
        <span className={s.groupSub}>{sub}</span>
      </span>
    </div>
  );
}

/* Figure 1's panels: drawn in place on the wide picture, one per swipe
   screen below 640px at their own size (job 38: no shrunk picture) */
const Manager = () => (
  <KitPanel className={s.manager}>
    <KitAvatar src={av("manager")} size={40} />
    <span>
      <span className={s.groupTitle}>Design manager</span>
      <span className={s.groupSub}>Set priorities, backed the process</span>
    </span>
  </KitPanel>
);

const Partners = () => (
  <KitPanel className={`${s.group} ${s.partners}`}>
    <span className={s.accent} />
    <GroupHead icon="Sparks" title="Partners" sub="Work that leaned on the system" />
    <span className={s.partner}>
      <Icon name="Mail" size="sm" />
      Marketing · email templates
    </span>
    <span className={s.partner}>
      <Icon name="Sparks" size="sm" />
      AI assistant design
    </span>
  </KitPanel>
);

const Team = () => (
  <KitPanel className={`${s.group} ${s.team}`}>
    <span className={s.accent} />
    <GroupHead icon="ViewGrid" title="Design system team" sub="About 7 component libraries" />
    <span className={s.people}>
      {TEAM.map((p) => (
        <span key={p.tag} className={s.person}>
          <KitAvatar src={p.src} size={40} className={p.lead ? s.lead : s.grey} />
          {p.lead ? <KitStatus>{p.tag}</KitStatus> : <KitTag>{p.tag}</KitTag>}
        </span>
      ))}
    </span>
  </KitPanel>
);

const Engineering = () => (
  <KitPanel className={`${s.group} ${s.engineering}`}>
    <span className={s.accent} />
    <GroupHead icon="Code" title="Engineering" sub="System tech leads and platform devs" />
    {PLATFORMS.map((p) => (
      <span key={p.name} className={s.platform}>
        {p.name}
        <span className={s.stack} data-size="26">
          {p.avs.map((src) => (
            <KitAvatar key={src} src={src} size={26} />
          ))}
        </span>
      </span>
    ))}
  </KitPanel>
);

const Squads = () => (
  <KitPanel className={s.squads}>
    <span className={s.accent} />
    <span className={s.squadsHead}>
      <span className={s.groupTitle}>Product squads</span>
      <span className={s.squadsSub}>Each with its own designer, on Web, iOS and Android</span>
    </span>
    <span className={s.squadList}>
      {SQUADS.map((q) => (
        <span key={q.name} className={s.squad}>
          <KitAvatar src={q.av} size={28} />
          {q.name}
        </span>
      ))}
    </span>
  </KitPanel>
);

const WHO_PANELS = [
  { key: "manager", short: "design manager", node: <Manager />, label: "A design manager who set priorities and backed the process." },
  { key: "team", short: "system team", node: <Team />, label: "The design system team, about 7 component libraries: four designers, one running it, the lead on leave, one on leave and one out." },
  { key: "partners", short: "partners", node: <Partners />, label: "Partners whose work leaned on the system: marketing email templates and AI assistant design." },
  { key: "engineering", short: "engineering", node: <Engineering />, label: "Engineering: system tech leads and platform devs on Web, iOS and Android." },
  { key: "squads", short: "product squads", node: <Squads />, label: "The product squads, each with its own designer: Checkout, Account and orders, Product page, Listing and search, Email, Assistant." },
];

function WhoSwipe({ panels, label }: { panels: typeof WHO_PANELS; label: string }) {
  return (
    <Swipe
      fit
      label={label}
      items={panels.map((p) => ({
        key: p.key,
        short: p.short,
        node: (
          <Pic label={p.label} className={s.phonePanel}>
            {p.node}
          </Pic>
        ),
      }))}
    />
  );
}

export function FederatedWho() {
  return (
    <>
      <Pic label={F2_LABEL} className={caseStyles.wideOnly}>
        <ScaledArt width={928}>
          <div className={s.f2}>
            <svg className={s.f2Lines} viewBox="0 0 928 494" width={928} height={494}>
              <line x1={276} y1={210} x2={292} y2={210} className={s.leaderGrey} />
              <line x1={636} y1={210} x2={652} y2={210} className={s.leaderGrey} />
              <line x1={464} y1={316} x2={464} y2={332} className={s.leaderGrey} />
              <line x1={464} y1={88} x2={464} y2={104} className={s.leaderGrey} />
            </svg>
            <Manager />
            <Partners />
            <Team />
            <Engineering />
            <Squads />
          </div>
        </ScaledArt>
      </Pic>
      <div className={caseStyles.phoneOnly}>
        {/* a long list of people on a phone: the manager, and the four groups behind
            "Show the team" until the redesign (job M; Justine's feedback) */}
        <WhoSwipe panels={WHO_PANELS.slice(0, 1)} label="Who set the priorities" />
        <ShowAll total={4} label="Show the team">
          <WhoSwipe panels={WHO_PANELS.slice(1)} label="Who serves whom" />
        </ShowAll>
      </div>
    </>
  );
}

/* ── Figure 2 · One card, three versions ──────────────────────────── */
const F3_LABEL =
  "One product card, three versions: the published card with its name, discounted price, colour and size and a 'last units' mark; a new draft with a caps title on two lines, the colour cut off, a 20px close target and a discount badge; a post-purchase copy with the full price and no discount. Four issues are marked: caps title on two lines, colour cut off, close target 20px, discount missing.";

const COAT = "/images/kit/coat.webp";

function Coat({ square = false, children }: { square?: boolean; children?: ReactNode }) {
  return (
    <span className={s.photo} data-square={square || undefined}>
      {/* the one small file, shared with the hero card: eager, so the first screen is never empty (job O2) */}
      <img src={COAT} alt="" width={640} height={960} decoding="async" />
      {children}
    </span>
  );
}

function Marker({ n, className }: { n: number; className: string }) {
  return <span className={`${s.marker} ${className}`}>{n}</span>;
}

/** `hero`: the case hero's row (K6, Elleta, 6 Oct 2026): every card has
 *  its label pill, fills its column, and its text wraps in full (the
 *  cuts are Figure 2's point, not the hero's) */
export function Published({ bare = false, hero = false }: { bare?: boolean; hero?: boolean }) {
  bare = bare || hero;
  return (
    <div className={s.version} data-hero={hero || undefined}>
      {hero ? <KitTag>Published</KitTag> : bare ? null : <KitStatus>Published</KitStatus>}
      <div className={s.card}>
        <Coat>
          <span className={s.close}>
            <Icon name="Xmark" size="md" />
          </span>
        </Coat>
        {/* the cut is the picture's point, drawn as text, never clipped (job 34) */}
        {hero ? (
          <p className={s.cardTitle}>Wool blend belted coat with wide lapels</p>
        ) : (
          <p className={`${s.cardTitle} ${s.oneLine}`}>Wool blend belted coat with wide…</p>
        )}
        <p className={s.price}>
          <span className={s.sale}>€119.99</span>
          <span className={s.was}>€179.99</span>
          <span className={s.off}>-33%</span>
        </p>
        <p className={s.meta}>Beige · M</p>
        <p className={s.stock}>
          <span className={s.stockDot} />
          Last units
        </p>
        {/* the verdict sits inside the card's bottom edge, not on its corner */}
        {bare ? null : (
          <MarkupBadge kind="pass" className={s.passBadge}>
            On system
          </MarkupBadge>
        )}
      </div>
      {bare ? null : (
        <>
          <span className={s.popover}>Wool blend belted coat with wide lapels</span>
          <span className={s.caret} />
        </>
      )}
    </div>
  );
}

export function Draft({ bare = false, hero = false }: { bare?: boolean; hero?: boolean }) {
  bare = bare || hero;
  return (
    <div className={s.version} data-hero={hero || undefined}>
      <KitTag>New draft</KitTag>
      <div className={s.card} data-draft>
        <Coat square>
          <span className={s.discount}>-33%</span>
          <span className={s.closeSmall}>
            <Icon name="Xmark" size="sm" />
          </span>
        </Coat>
        <p className={`${s.cardTitle} ${s.caps}`}>Wool blend belted coat with wide lapels</p>
        <p className={s.plain}>119,99 €</p>
        {hero ? (
          <p className={s.meta}>Colour: Beige, size: M, regular fit</p>
        ) : (
          <p className={`${s.meta} ${s.oneLine}`}>Colour: Beige, size: M, regular fit…</p>
        )}
      </div>
      {bare ? null : (
        <>
          <Marker n={3} className={s.m3} />
          <Marker n={1} className={s.m1} />
          <Marker n={2} className={s.m2} />
        </>
      )}
    </div>
  );
}

export function Copy({ bare = false, hero = false }: { bare?: boolean; hero?: boolean }) {
  bare = bare || hero;
  return (
    <div className={s.version} data-hero={hero || undefined}>
      <KitTag>Post-purchase copy</KitTag>
      <div className={s.card}>
        <Coat />
        <p className={`${s.cardTitle} ${s.strong}`}>Wool blend belted coat with wide lapels</p>
        <p className={s.full}>€179.99</p>
        <p className={s.meta}>Colour: Beige</p>
        <p className={s.meta}>Size: M</p>
      </div>
      {bare ? null : <Marker n={4} className={s.m4} />}
    </div>
  );
}

const VERSIONS = [
  { key: "published", short: "published", node: <Published />, label: "Published: the product card with its name, a discounted price of 119.99 from 179.99, beige, size M and a 'last units' mark." },
  { key: "draft", short: "new draft", node: <Draft />, label: "New draft: the same card with a caps title on two lines, a minus 33 percent badge, a small close target, and the colour line cut off." },
  { key: "copy", short: "post-purchase copy", node: <Copy />, label: "Post-purchase copy: the same card at the full price of 179.99 with colour and size on their own lines, and no discount." },
];

/* the four issues, by the version they sit on */
const MISSES: Record<string, string[]> = {
  draft: ["1 Caps title, two lines", "2 Colour cut off", "3 Close target 20px"],
  copy: ["4 Discount missing"],
};

export function FederatedVersions() {
  return (
    <>
      <Pic label={F3_LABEL} className={caseStyles.wideOnly}>
        <ScaledArt width={928}>
          <div className={s.f3}>
            <div className={s.versions}>
              {VERSIONS.map((v) => (
                <div key={v.key}>{v.node}</div>
              ))}
            </div>
            <div className={s.legend}>
              {[...MISSES.draft, ...MISSES.copy].map((m) => (
                <Miss key={m}>{m}</Miss>
              ))}
            </div>
          </div>
        </ScaledArt>
      </Pic>
      <div className={caseStyles.phoneOnly}>
        {/* the one Reel (job 42): three peers to compare */}
        <Swipe
          reel
          label="Three versions of one product card"
          items={VERSIONS.map((v) => ({
            key: v.key,
            short: v.short,
            node: (
              <Pic label={v.label} className={v.key === "copy" ? s.swipeCardStart : s.swipeCard}>
                {v.node}
                {/* the numbered markers keep their words on the phone too:
                    the legend lines for this card, under it (job 34) */}
                {MISSES[v.key] ? (
                  <span className={s.swipeLegend}>
                    {MISSES[v.key].map((m) => (
                      <Miss key={m}>{m}</Miss>
                    ))}
                  </span>
                ) : null}
              </Pic>
            ),
          }))}
        />
      </div>
    </>
  );
}
