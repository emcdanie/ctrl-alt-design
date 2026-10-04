import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { KitAvatar, KitPanel, KitStatus, KitTag, KitTheme, MarkupBadge, MarkupNote } from "@/components/case/kit/Kit";
import ScaledArt from "@/components/case/ScaledArt";
import Swipe from "@/components/case/Swipe";
import caseStyles from "@/components/case/Case.module.css";
import s from "./FederatedPicturesA.module.css";

/* Federated, Figures 1 to 3, as live pictures (Site v3; Figma
   e7U5Hxpr441rT719SPclas, 1440 293:20908 and 390 304:7219). Product
   theme mode "Federated": ink actions, no indigo. Each picture names
   itself (role="img"); everything inside is aria-hidden. Drawn at the
   1440 design size (928 inside the stage) and scaled to fit; Figure 1
   restacks and Figure 3 swipes below 640px, as the 390 frames do. */

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

/* ── Figure 1 · Cover: before and after inbox ─────────────────────── */
const F1_LABEL =
  "Before, told after it shipped: a team chat where three squads report what they already built and ask for review, marked with a red cross, annotated 'told after the fact' and 'three side channels'. After, brought to the open desk: a Thursday agenda with squads, devs and the system team, where the size selector and order card states are decided together and a video tag comes next week, marked with a green tick.";

const CHAT = [
  { who: "Squad A", av: av("r8"), text: "We already built our own card for the redesign." },
  { who: "Squad B", av: av("r10"), text: "Dev has been waiting a week. Can you review today?" },
  { who: "Squad C", av: av("r16"), text: "We made a new selector chip. Is that OK?" },
];

const AGENDA = [
  { item: "Size selector for the new card", status: "Decided together" },
  { item: "Order card states", status: "Decided together" },
  { item: "Video tag on the product card", status: "Next week" },
];

function ChatPanel() {
  return (
    <KitPanel className={s.chat}>
      <p className={s.panelTitle}>Team chat</p>
      {CHAT.map((m) => (
        <div key={m.who} className={s.message}>
          <KitAvatar src={m.av} />
          <div>
            <p className={s.msgName}>{m.who}</p>
            <p className={s.msgText}>{m.text}</p>
          </div>
        </div>
      ))}
    </KitPanel>
  );
}

function DeskPanel() {
  return (
    <KitPanel className={s.desk}>
      <p className={s.panelTitle}>Open desk · Thursday</p>
      <div className={s.hosts}>
        <span className={s.stack} data-size="28">
          {[av("elleta"), av("r4"), av("r6"), av("r8")].map((src) => (
            <KitAvatar key={src} src={src} size={28} />
          ))}
        </span>
        <span>Squads, devs and the system team</span>
      </div>
      {AGENDA.map((a) => (
        <div key={a.item} className={s.agenda}>
          <span>{a.item}</span>
          <KitStatus>{a.status}</KitStatus>
        </div>
      ))}
    </KitPanel>
  );
}

export function FederatedCover() {
  return (
    <>
      <Pic label={F1_LABEL} className={caseStyles.wideOnly}>
        <ScaledArt width={928}>
          <div className={s.f1}>
            <p className={`${s.colLabel} ${s.f1LabelBefore}`}>Before: told after it shipped</p>
            <p className={`${s.colLabel} ${s.f1LabelAfter}`}>After: brought to the open desk</p>
            <div className={s.f1Chat}>
              <ChatPanel />
            </div>
            <div className={s.f1Desk}>
              <DeskPanel />
            </div>
            <MarkupBadge kind="fail" size="lg" className={s.f1BadgeFail} />
            <MarkupBadge kind="pass" size="lg" className={s.f1BadgePass} />
            <svg className={s.f1Leaders} viewBox="0 0 928 503" width={928} height={503}>
              <line x1={100.5} y1={400.7} x2={88.5} y2={464.7} className={s.leaderRed} />
              <circle cx={100.5} cy={400.7} r={4} className={s.dotRed} />
              <line x1={330.3} y1={392.6} x2={320.5} y2={456.6} className={s.leaderRed} />
              <circle cx={330.3} cy={392.6} r={4} className={s.dotRed} />
            </svg>
            <div className={s.f1Note1}>
              <Miss>Told after the fact</Miss>
            </div>
            <div className={s.f1Note2}>
              <Miss>Three side channels</Miss>
            </div>
          </div>
        </ScaledArt>
      </Pic>
      <Pic label={F1_LABEL} className={caseStyles.phoneOnly}>
        <div className={s.f1Phone}>
          <p className={s.phoneLabel}>
            <MarkupBadge kind="fail" size="md" />
            Before: told after it shipped
          </p>
          <div className={s.f1PhoneChat}>
            <ChatPanel />
          </div>
          <div className={s.phoneNotes}>
            <Miss>Told after the fact</Miss>
            <Miss>Three side channels</Miss>
          </div>
          <p className={s.phoneLabel}>
            <MarkupBadge kind="pass" size="md" />
            After: brought to the open desk
          </p>
          <DeskPanel />
        </div>
      </Pic>
    </>
  );
}

/* ── Figure 2 · Who serves whom ───────────────────────────────────── */
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

export function FederatedWho() {
  return (
    <Pic label={F2_LABEL}>
      <ScaledArt width={928}>
        <div className={s.f2}>
          <svg className={s.f2Lines} viewBox="0 0 928 628" width={928} height={628}>
            <line x1={276} y1={260} x2={292} y2={260} className={s.leaderGrey} />
            <line x1={636} y1={260} x2={652} y2={260} className={s.leaderGrey} />
            <line x1={464} y1={390} x2={464} y2={436} className={s.leaderGrey} />
            <line x1={464} y1={104} x2={464} y2={128} className={s.leaderGrey} />
          </svg>
          <KitPanel className={s.manager}>
            <KitAvatar src={av("manager")} size={40} />
            <span>
              <span className={s.groupTitle}>Design manager</span>
              <span className={s.groupSub}>Set priorities, backed the process</span>
            </span>
          </KitPanel>

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

          <KitPanel className={`${s.group} ${s.team}`}>
            <span className={s.accent} />
            <GroupHead icon="ViewGrid" title="Design system team" sub="About 7 component libraries" />
            <span className={s.people}>
              {TEAM.map((p) => (
                <span key={p.tag} className={s.person}>
                  <KitAvatar src={p.src} size={52} className={p.lead ? s.lead : s.grey} />
                  {p.lead ? <KitStatus>{p.tag}</KitStatus> : <KitTag>{p.tag}</KitTag>}
                </span>
              ))}
            </span>
          </KitPanel>

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
        </div>
      </ScaledArt>
    </Pic>
  );
}

/* ── Figure 3 · One card, three versions ──────────────────────────── */
const F3_LABEL =
  "One product card, three versions: the published card with its name, discounted price, colour and size and a 'last units' mark; a new draft with a caps title on two lines, the colour cut off, a 20px close target and a discount badge; a post-purchase copy with the full price and no discount. Four issues are marked: caps title on two lines, colour cut off, close target 20px, discount missing.";

const COAT = "/images/kit/coat.webp";

function Coat({ square = false, children }: { square?: boolean; children?: ReactNode }) {
  return (
    <span className={s.photo} data-square={square || undefined}>
      <img src={COAT} alt="" width={640} height={960} loading="lazy" decoding="async" />
      {children}
    </span>
  );
}

function Marker({ n, className }: { n: number; className: string }) {
  return <span className={`${s.marker} ${className}`}>{n}</span>;
}

function Published() {
  return (
    <div className={s.version}>
      <KitStatus>Published</KitStatus>
      <div className={s.card}>
        <Coat>
          <span className={s.close}>
            <Icon name="Xmark" size="md" />
          </span>
        </Coat>
        <p className={`${s.cardTitle} ${s.ellipsis}`}>Wool blend belted coat with wide lapels</p>
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
      </div>
      <MarkupBadge kind="pass" size="md" className={s.passBadge} />
      <span className={s.popover}>Wool blend belted coat with wide lapels</span>
      <span className={s.caret} />
    </div>
  );
}

function Draft() {
  return (
    <div className={s.version}>
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
        <p className={`${s.meta} ${s.ellipsis}`}>Colour: Beige, size: M, regular fit, wool blend</p>
      </div>
      <Marker n={3} className={s.m3} />
      <Marker n={1} className={s.m1} />
      <Marker n={2} className={s.m2} />
    </div>
  );
}

function Copy() {
  return (
    <div className={s.version}>
      <KitTag>Post-purchase copy</KitTag>
      <div className={s.card}>
        <Coat />
        <p className={`${s.cardTitle} ${s.strong}`}>Wool blend belted coat with wide lapels</p>
        <p className={s.full}>€179.99</p>
        <p className={s.meta}>Colour: Beige</p>
        <p className={s.meta}>Size: M</p>
      </div>
      <Marker n={4} className={s.m4} />
    </div>
  );
}

const VERSIONS = [
  { key: "published", short: "published", node: <Published />, label: "Published: the product card with its name, a discounted price of 119.99 from 179.99, beige, size M and a 'last units' mark." },
  { key: "draft", short: "new draft", node: <Draft />, label: "New draft: the same card with a caps title on two lines, a minus 33 percent badge, a small close target, and the colour line cut off." },
  { key: "copy", short: "post-purchase copy", node: <Copy />, label: "Post-purchase copy: the same card at the full price of 179.99 with colour and size on their own lines, and no discount." },
];

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
              <Miss>1 Caps title, two lines</Miss>
              <Miss>2 Colour cut off</Miss>
              <Miss>3 Close target 20px</Miss>
              <Miss>4 Discount missing</Miss>
            </div>
          </div>
        </ScaledArt>
      </Pic>
      <div className={caseStyles.phoneOnly}>
        <Swipe
          fit
          label="Three versions of one product card"
          items={VERSIONS.map((v) => ({
            key: v.key,
            short: v.short,
            node: (
              <Pic label={v.label} className={v.key === "copy" ? s.swipeCardStart : s.swipeCard}>
                {v.node}
              </Pic>
            ),
          }))}
        />
      </div>
    </>
  );
}
