import type { Role, Theme } from "@/components/theming/themes";
import { themeVars } from "@/components/theming/themes";
import s from "@/components/ThemingCase.module.css";

/* The listing card every theme dresses: one component tree, read only
 * through nine role variables (--t-*). `small` is the side-by-side strip
 * version (no search pill, price in the body, no booking row). `hot`
 * outlines the parts that read one role, for the exhibit's tier rows. */
export default function Preview({ theme, small = false, hot }: { theme: Theme; small?: boolean; hot?: Role | null }) {
  const r = (role: Role) => ({ "data-r": role });
  return (
    <div className={`${s.pv} ${small ? s.pvSmall : ""}`} style={themeVars(theme)}>
      <div className={s.pvNav}>
        <b>bel·la homes</b>
        {small ? null : <span {...r("line")} className={`${s.pvSearch} ${hot === "line" ? s.pulse : ""}`}>Canet de Mar · any week · 2 guests</span>}
      </div>
      <div className={s.pvBody}>
        <div className={s.pvCard}>
          <div {...r("panel")} className={`${s.pvImg} ${hot === "panel" ? s.pulse : ""}`}>
            <svg
              viewBox="0 0 400 300"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              {...r("accent")}
              className={hot === "accent" ? s.pulse : undefined}
            >
              <rect className={s.pvSea} x="0" y="190" width="400" height="110" />
              <path className={s.pvS} d="M0 190 H400" />
              <path className={s.pvS} d="M150 190 V120 L210 82 L270 120 V190 M186 190 V150 H210 V190" />
              <rect className={`${s.pvS} ${s.pvA}`} x="226" y="136" width="26" height="20" rx="3" />
              <circle className={`${s.pvS} ${s.pvA}`} cx="330" cy="70" r="18" />
              <path className={s.pvS} d="M40 230 q14 -12 28 0 q14 -12 28 0 M250 250 q14 -12 28 0 q14 -12 28 0" />
            </svg>
            <span className={s.pvPill}>new</span>
            <span className={s.pvHeart} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
              </svg>
            </span>
            <span className={s.pvPag} aria-hidden="true">
              <i className={s.on} />
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className={s.pvCb}>
            <div className={s.pvRow}>
              <b {...r("ink")} className={`${s.pvTtl} ${hot === "ink" ? s.pulse : ""}`}>
                Canet de Mar, Spain
              </b>
              <span className={s.pvRt}>★ 4.92</span>
            </div>
            <span {...r("muted")} className={`${s.pvMeta} ${hot === "muted" ? s.pulse : ""}`}>
              2 rooms · 64 m² · 5 min to the beach
            </span>
            {small ? (
              <span className={s.pvPrice}>
                <b>€1,150</b> month
              </span>
            ) : null}
          </div>
        </div>
        {small ? null : (
          <div data-r="line" className={`${s.pvBk} ${hot === "line" ? s.pulse : ""}`}>
            <span>
              <b>€1,150</b> <span className={s.pvMeta}>month</span>
            </span>
            {/* a picture of a button inside the demo card, not a control */}
            <span {...r("action")} className={`${s.pvBtn} ${hot === "action" ? s.pulse : ""}`}>
              Book a visit
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
