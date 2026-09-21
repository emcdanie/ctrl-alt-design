/* The frame gate (Elleta, 21 Sep 2026: "do what Southleft does and make a
 * gate"). audit:layout reads the code; this reads the PIXELS. Every route,
 * one case of each slug, at 1440, 1024 and 390, against the few frame
 * tokens every page shares:
 *
 * 1. One content edge: the h1 and the first section's content start at the
 *    container's inner left edge, the same number on every route (±1px).
 * 2. Two title recipes: `display` (the Home hero) and `page` (everything
 *    else). An h1 renders one of their two sizes and is never wider than
 *    its measure. Every h1 and h2 in main is 50 characters or fewer.
 * 3. One section rhythm: every top-level section pads by --section-pad-y
 *    (the first adds the nav height, twice the pad, like every page).
 * 4. Radii from the set: --radius-sm/md/lg/card or a pill. A deliberate
 *    exception carries data-frame-exempt="<reason>" and is listed below,
 *    never a silent allowlist.
 * 5. Cards: at most 2 card signatures per route (content card + frame).
 * 6. Reading measure: no paragraph in main is wider than --measure-body.
 * 7. The receipt: route, width, element, measured, expected; one line per
 *    route on a pass.
 *
 * Browser audit: reads AUDIT_URL like the others. */
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = [1440, 1024, 390];
const LIMIT = 50;

/* every page route audit:layout lists, with one real id for each dynamic
   segment: every case slug, the first pattern study, and a 404 */
const slugs = readdirSync("content/case-studies")
  .filter((f) => f.endsWith(".ts") && f !== "index.ts")
  .map((f) => f.replace(/\.ts$/, ""));
const study = readFileSync("content/studies.ts", "utf8").match(/id: "([^"]+)"/)?.[1];
const ROUTES = [
  "/",
  "/work",
  "/learning",
  "/about",
  "/design-system",
  "/design-system/inspector",
  "/quick",
  "/contact",
  "/privacy",
  "/accessibility",
  "/this-page-does-not-exist",
  ...(study ? [`/work/studies/${study}`] : []),
  ...slugs.map((s) => `/case-studies/${s}`),
];

let fails = 0;
const fail = (route, width, offender, got, expected) => {
  fails++;
  console.error(receipt("frame", `(${width} ${route}) ${offender}`, got, expected));
};

const browser = await chromium.launch();
const edges = {}; // width -> { value, route }
const exempts = new Map(); // reason -> routes
const table = [];

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    const r = await page.evaluate(({ LIMIT }) => {
      const px = (v) => parseFloat(v) || 0;
      const main = document.querySelector("main");
      /* resolve a token to px on a probe, in the context it is used */
      const probe = (styles, prop, parent = main) => {
        const el = document.createElement("div");
        el.setAttribute("aria-hidden", "true");
        Object.assign(el.style, { position: "absolute", visibility: "hidden" }, styles);
        parent.appendChild(el);
        const v = getComputedStyle(el)[prop];
        el.remove();
        return v;
      };
      const padY = px(probe({ paddingTop: "var(--section-pad-y)" }, "paddingTop"));
      const header = px(probe({ paddingTop: "var(--header-height)" }, "paddingTop"));
      const radii = ["sm", "md", "lg", "card"].map((k) => px(probe({ borderRadius: `var(--radius-${k})` }, "borderTopLeftRadius")));
      const pageSize = px(probe({ fontSize: "var(--text-display-1)" }, "fontSize"));
      const displaySize = px(probe({ fontSize: "var(--component-heading-hero-font-size)" }, "fontSize"));
      const out = { fails: [], exempt: [], cards: [], edge: null };
      const F = (el, got, exp) => {
        const name = el.tagName.toLowerCase() + (el.id ? "#" + el.id : "") + (typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\s+/)[0] : "");
        const text = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 32);
        out.fails.push([`${name}${text ? ` "${text}"` : ""}`, got, exp]);
      };
      const visible = (el) => {
        const rc = el.getBoundingClientRect();
        const c = getComputedStyle(el);
        return rc.width > 1 && rc.height > 1 && c.visibility !== "hidden" && c.display !== "none";
      };
      /* the site nav (fixed chrome, rendered inside main on some routes)
         is a global landmark, not page content */
      const exemptOf = (el) => el.closest("[data-frame-exempt], nav, header, .nav-row, [role=dialog]");
      for (const x of main.querySelectorAll("[data-frame-exempt]")) out.exempt.push(x.getAttribute("data-frame-exempt"));

      /* 1. the content edge */
      const firstSection = [...main.querySelectorAll("section")].find(visible);
      const cont = firstSection?.querySelector(".container, .layout-container");
      if (cont) {
        const cc = getComputedStyle(cont);
        const inner = Math.round(cont.getBoundingClientRect().left + px(cc.paddingLeft));
        out.edge = inner;
        const h1 = main.querySelector("h1");
        if (h1 && visible(h1) && !h1.classList.contains("sr-only")) {
          const left = Math.round(h1.getBoundingClientRect().left);
          if (Math.abs(left - inner) > 1) F(h1, `left edge ${left}px`, `the container's inner edge, ${inner}px`);
        }
      } else if (firstSection) {
        F(firstSection, "a first section with no Container", "content inside the one Container");
      }

      /* 2. title recipes and heading length */
      for (const h of main.querySelectorAll("h1")) {
        if (!visible(h) || h.classList.contains("sr-only")) continue;
        const c = getComputedStyle(h);
        const size = px(c.fontSize);
        const hero = h.classList.contains("display-heading--hero");
        const want = hero ? displaySize : pageSize;
        if (Math.abs(size - want) > 0.5) F(h, `font-size ${size}px`, `${hero ? "display" : "page"} ${want}px`);
        if (!hero) {
          const measure = px(probe({ fontSize: c.fontSize, maxInlineSize: "var(--measure-title)", width: "10000px" }, "maxInlineSize", h.parentElement));
          const w = h.getBoundingClientRect().width;
          if (w > measure + 1) F(h, `${Math.round(w)}px wide`, `at most --measure-title, ${Math.round(measure)}px`);
        }
      }
      for (const h of main.querySelectorAll("h1, h2")) {
        const t = (h.getAttribute("aria-label") || h.textContent || "").replace(/\s+/g, " ").trim();
        if (t.length > LIMIT) F(h, `${t.length} characters`, `${LIMIT} or fewer`);
      }

      /* 3. one section rhythm, on every top-level section */
      const tops = [...main.querySelectorAll("section")].filter((s) => !s.parentElement.closest("main section") && visible(s));
      const embed = main.classList.contains("embed-page");
      tops.forEach((s, i) => {
        const c = getComputedStyle(s);
        const top = px(c.paddingTop);
        const bottom = px(c.paddingBottom);
        const wantTop = i === 0 && !embed ? header + padY * 2 : padY;
        if (Math.abs(top - wantTop) > 1) F(s, `padding-top ${top}px`, `${i === 0 && !embed ? "nav + 2 × " : ""}--section-pad-y, ${wantTop}px`);
        if (Math.abs(bottom - padY) > 1) F(s, `padding-bottom ${bottom}px`, `--section-pad-y, ${padY}px`);
      });

      /* 4 + 5. radii and cards */
      const CONTROL = "button, input, textarea, select, a.btn-key, [role=tab], .seg-control, .filter-chip";
      for (const el of main.querySelectorAll("*")) {
        if (exemptOf(el) || !visible(el)) continue;
        const c = getComputedStyle(el);
        const rc = el.getBoundingClientRect();
        for (const corner of ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"]) {
          const v = c[corner];
          if (v === "0px") continue;
          const n = px(v);
          const pill = v.includes("%") || n >= Math.min(rc.width, rc.height) / 2 - 1;
          if (!pill && !radii.some((t) => Math.abs(t - n) < 0.5)) {
            F(el, `border-radius ${v}`, `one of ${radii.join(", ")}px or a pill`);
            break;
          }
        }
        /* a card: the outermost box with a line border on all four sides
           and a card-scale corner, that is not a control */
        const bordered = ["Top", "Right", "Bottom", "Left"].every((sd) => px(c[`border${sd}Width`]) >= 1 && c[`border${sd}Style`] !== "none");
        const r = px(c.borderTopLeftRadius);
        if (!bordered || r < 12 || r >= Math.min(rc.width, rc.height) / 2 || rc.height < 60 || el.matches(CONTROL)) continue;
        if (el.parentElement.closest("[data-card]")) continue;
        el.setAttribute("data-card", "");
        const kid = el.firstElementChild;
        const pad = px(c.paddingTop) || (kid && el.children.length === 1 ? px(getComputedStyle(kid).paddingTop) : 0);
        out.cards.push(`r${r} p${pad} ${c.boxShadow === "none" ? "flat" : "shadow"}`);
      }
      for (const el of main.querySelectorAll("[data-card]")) el.removeAttribute("data-card");

      /* 6. reading measure: the widest LINE of text, not the box (a
         short label in a full-width box is not a long line) */
      const range = document.createRange();
      for (const p of main.querySelectorAll("p")) {
        if (exemptOf(p) || !visible(p) || p.classList.contains("sr-only")) continue;
        if (![...p.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        /* the token resolved in the paragraph's own font, as CSS does */
        const measure = px(probe({ width: "var(--measure-body)" }, "width", p));
        range.selectNodeContents(p);
        const rects = [...range.getClientRects()];
        if (!rects.length) continue;
        const w = Math.max(...rects.map((x) => x.right)) - Math.min(...rects.map((x) => x.left));
        if (w > measure + 2) F(p, `a ${Math.round(w)}px line`, `at most --measure-body, ${Math.round(measure)}px`);
      }
      return out;
    }, { LIMIT });

    for (const [el, got, exp] of r.fails) fail(route, width, el, got, exp);
    const sigs = [...new Set(r.cards)];
    if (sigs.length > 2) fail(route, width, "cards", `${sigs.length} signatures (${sigs.join("; ")})`, "at most 2: the content card and ExampleFrame");
    if (r.edge != null) {
      edges[width] ??= { value: r.edge, route };
      if (Math.abs(edges[width].value - r.edge) > 1)
        fail(route, width, "content edge", `${r.edge}px`, `${edges[width].value}px, as on ${edges[width].route}`);
    }
    for (const reason of r.exempt) exempts.set(reason, [...(exempts.get(reason) ?? []), `${route}@${width}`]);
    table.push(`  ${String(width).padEnd(5)} ${route.padEnd(46)} edge ${r.edge ?? "-"}px  cards ${sigs.length}  ${r.fails.length ? `${r.fails.length} fail` : "ok"}`);
  }
  await page.close();
}
await browser.close();

if (exempts.size) {
  console.log("frame exemptions (data-frame-exempt):");
  for (const [reason, where] of exempts) console.log(`  "${reason}" on ${[...new Set(where.map((w) => w.split("@")[0]))].join(", ")}`);
}
if (fails) {
  console.error(`frame gate: ${fails} failure(s)`);
  process.exit(1);
}
console.log(table.join("\n"));
console.log(`frame gate: PASS (${ROUTES.length} routes × ${WIDTHS.length} widths)`);
