import { Bathroom, Bed, Heart, MapPin, ViewGrid, Wifi } from "iconoir-react";
import type { FaceKey, Role, Theme } from "@/components/theming/themes";
import { LISTING, faceRows, faceVars, themeVars } from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

/* The theming face (job 43, Elleta, 5 Oct 2026; Figma "Theming face"
 * 480:55355, faces v2): one phone screen from ONE component tree. A top
 * bar with the wordmark, "Where to" and its field, three filter chips
 * (the first selected), the listing card, then the booking bar. Every
 * colour and radius is a variable (--t-*); content comes from the brand's
 * listing in themes.ts. With `face` it wears that brand's Figma values
 * (Figure 8, the showcase, the hero collage); without, the theme's roles
 * (the exhibit, where `hot` outlines the parts that read one role). */

/** `live`: the face is live DOM, not a picture (the exhibit), so the chip
 * row takes focus and scrolls by keyboard; inside a role="img" or
 * aria-hidden picture it stays out of the tab order */
export default function Preview({ theme, face, hot, live = false }: { theme: Theme; face?: FaceKey; hot?: Role | null; live?: boolean }) {
  const cx = (base: string, role: Role) => `${base} ${hot === role ? s.pulse : ""}`.trim();
  const l = LISTING[theme.name];
  return (
    <div data-r="bg" className={cx(s.pv, "bg")} style={face ? faceVars(face) : themeVars(theme)}>
      <div className={s.pvTop}>
        <b data-r="ink" className={cx(s.pvWord, "ink")}>
          {l.brand}
        </b>
        <ViewGrid />
      </div>
      <div className={s.pvBody}>
        <div className={s.pvWhere}>
          <span data-r="muted" className={cx(s.pvLabel, "muted")}>
            Where to
          </span>
          <span data-r="border-strong" className={cx(s.pvField, "border-strong")}>
            {l.search}
          </span>
        </div>
        <div className={s.pvChips} {...(live ? { tabIndex: 0, role: "group", "aria-label": "Filters, scroll sideways" } : {})}>
          <span data-r="action" className={cx(`${s.pvChip} ${s.pvChipOn}`, "action")}>
            Sea view
          </span>
          <span className={s.pvChip}>Pets ok</span>
          <span className={s.pvChip}>Under €1,500</span>
        </div>
        <div data-r="line" className={cx(s.pvCard, "line")}>
          <div className={s.pvImg}>
            <img src={l.photo} width={l.photoW} height={l.photoH} alt="" loading="lazy" decoding="async" />
            <span data-r="panel" className={cx(s.pvTag, "panel")}>
              Guest favourite
            </span>
            <span className={s.pvSave}>
              <Heart />
            </span>
            <span className={s.pvPag}>
              <i className={s.on} />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={s.pvCb}>
            <b className={s.pvTtl}>{l.title}</b>
            <span className={s.pvLoc}>
              <MapPin />
              {l.location}
            </span>
            <span className={s.pvRt}>
              <b>★ 4.92</b> <u>(23 reviews)</u>
            </span>
            <span className={s.pvAm}>
              <span>
                <Bed />2 rooms
              </span>
              <span>
                <Bathroom />
                64 m²
              </span>
              <span>
                <Wifi />
                Beach
              </span>
            </span>
            <span className={s.pvPriceRow}>
              <span className={s.pvPrice}>
                <b>{l.price}</b> <span className={s.pvPer}>month</span>
              </span>
              {/* pictures of buttons inside the demo screen, not controls */}
              <span className={s.pvBtn2}>Details</span>
            </span>
          </div>
        </div>
      </div>
      <div className={s.pvBar}>
        <span className={s.pvDates}>
          <b>12 to 19 Oct</b>
          <span>2 guests</span>
        </span>
        <span data-r="action" className={cx(s.pvBtn, "action")}>
          Book a visit
        </span>
      </div>
    </div>
  );
}

/* "What changed", under each Figure 8 face: the four values the brand
 * changes, read from themes.ts so the list can't drift from the face */
export function WhatChanged({ face }: { face: FaceKey }) {
  return (
    <div className={s.wc} style={faceVars(face)}>
      <p className={s.wcHead}>What changed</p>
      <ul>
        {faceRows(face).map(([k, v, kind]) => (
          <li key={k}>
            <span className={s.wcSwatch} data-kind={kind} />
            <code>
              {k}  {v}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}
