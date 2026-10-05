import { ArrowLeft, Bed, Heart, RulerCombine, SeaAndSun, StarSolid } from "iconoir-react";
import type { Role, Theme } from "@/components/theming/themes";
import { themeVars } from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

/* The listing card every theme dresses (job 32, 4 Oct 2026: high
 * fidelity, at the level of Drift's Harbour loft card): a photo with its
 * controls and carousel dots, a rating row, an amenities row with the
 * Harbour loft icon style, then price and "Book a visit". ONE component
 * for the exhibit and the side-by-side strip, read only through the
 * theme's role variables (--t-*), so it re-skins on every theme. `small`
 * is the strip version (no search pill in the header). `hot` outlines the
 * parts that read one role, for the exhibit's tier rows. */

/* 576px source (canal homes, no people); the card caps itself so the
 * photo never renders wider than 288 CSS px, half its pixels */
const PHOTO = "/images/kit/stay-canal.webp";

export default function Preview({ theme, small = false, hot }: { theme: Theme; small?: boolean; hot?: Role | null }) {
  const cx = (base: string, role: Role) => `${base} ${hot === role ? s.pulse : ""}`.trim();
  return (
    <div className={`${s.pv} ${small ? s.pvSmall : ""}`} style={themeVars(theme)}>
      <div className={s.pvNav}>
        <b>bel·la homes</b>
        {small ? null : (
          <span data-r="line" className={cx(s.pvSearch, "line")}>
            Canet de Mar · any week · 2 guests
          </span>
        )}
      </div>
      <div className={s.pvBody}>
        <div data-r="panel" className={cx(s.pvImg, "panel")}>
          <img src={PHOTO} width={576} height={384} alt="" loading="lazy" decoding="async" />
          <span className={s.pvCtl} data-at="start">
            <ArrowLeft />
          </span>
          <span className={s.pvCtl} data-at="end">
            <Heart />
          </span>
          <span data-r="panel" className={cx(s.pvPill, "panel")}>
            new
          </span>
          <span className={s.pvPag}>
            <i className={s.on} />
            <i />
            <i />
            <i />
          </span>
        </div>
        <div className={s.pvCb}>
          <b data-r="ink" className={cx(s.pvTtl, "ink")}>
            Canet de Mar, Spain
          </b>
          <span className={s.pvRt}>
            <span data-r="accent" className={cx(s.pvStars, "accent")}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarSolid key={i} />
              ))}
            </span>
            <b>4.92</b>
          </span>
          <span data-r="muted" className={cx(s.pvAm, "muted")}>
            <span>
              <Bed />2 rooms
            </span>
            <span>
              <RulerCombine />
              64 m²
            </span>
            <span>
              <SeaAndSun />
              beach 5 min
            </span>
          </span>
        </div>
        <div data-r="line" className={cx(s.pvBk, "line")}>
          <span className={s.pvPrice}>
            <b>€1,150</b> <span className={s.pvPer}>month</span>
          </span>
          {/* a picture of a button inside the demo card, not a control */}
          <span data-r="action" className={cx(s.pvBtn, "action")}>
            Book a visit
          </span>
        </div>
      </div>
    </div>
  );
}
