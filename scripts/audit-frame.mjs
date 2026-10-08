/* The frame gate (Elleta, 21 Sep 2026: "make a gate", after a reference
 * site's published frame). audit:layout reads the code; this reads the
 * PIXELS. Every route, one case of each slug, at 1440, 1024 and 390, against the few frame
 * tokens every page shares:
 *
 * 1. One content edge: the h1 and the first section's content start at the
 *    container's inner left edge, the same number on every route (±1px).
 *    Layout B, the rebuilt case template (site v3, CLAUDE.md section 2):
 *    its container is .container--case (the 1056 body) and its h1 sits on
 *    the text column, centred at --case-col-max; Layout B routes share
 *    their own edge, compared only with each other. A Layout B page whose
 *    text sits on the body's left edge (.container--edge, About, site v3)
 *    is held to that edge, and compared only with its own kind. A case
 *    with the hero band (.case-hero, site v3, 4 Oct late) opens its h1 on
 *    the band's own case-body edge (x192 at 1440, the Figma Hero slot),
 *    and those routes share that edge, compared only with each other.
 * 2. Three title recipes: `display` (the Home hero), `case title` (the h1
 *    in a case hero band: Display/Page, the same size as `page`) and `page`
 *    (everything else). An h1 renders its recipe's size and is never
 *    wider than its measure. Every h1 and h2 in main is 50 characters or
 *    fewer.
 * 3. One section rhythm: every top-level section pads by --section-pad-y
 *    (the first adds the nav height, like every page). A section that
 *    follows the case showcase (.case-showcase, which clears the nav
 *    itself with the hero band) opens one block gap down, --case-gap-block,
 *    as the Figma Results slot sits 40 under the showcase.
 * 4. Radii from the set: --radius-sm/md/lg/card or a pill. A deliberate
 *    exception carries data-frame-exempt="<reason>" and is listed below,
 *    never a silent allowlist. Inside a picture (a [role=img] element) the
 *    drawn product UI keeps its own radii (Elleta, 5 Oct 2026: the Case UI
 *    kit stays as drawn); the picture's own box is still checked.
 * 5. Cards: at most 2 card signatures per route (content card + frame).
 *    A card with a shadow floats: it is allowed only on floating things
 *    (the next-case card, popovers, dialogs) and is not counted. Since
 *    site v3 (BELLA fc2c100, "at rest every card wears shadow.card") a
 *    card may rest on exactly --shadow-card; any other shadow still fails.
 * 6. Reading measure: no paragraph in main is wider than --measure-body.
 * 0. No sideways scroll: the page is never wider than the window (Part U:
 *    four routes overflowed at 390 while every check above passed).
 * 0b. No runaway height: at 1440 no page is taller than 20,000px (22 Sep
 *    2026: Drift shipped at 79,429px when unsized SVGs lost their CSS).
 * 7. The receipt: route, width, element, measured, expected; one line per
 *    route on a pass.
 * 8. Both motion settings (job 38, 5 Oct 2026): every check runs with
 *    reduced motion and without it, so a layout that only holds while
 *    motion is off (or only while it is on) fails. Receipts from the
 *    no-preference pass carry "motion".
 *
 * Browser audit: reads AUDIT_URL like the others. */
import { readdirSync, readFileSync } from "node:fs";
import { chromium } from "playwright";
import { receipt } from "./lib/receipt.mjs";
import { BASE } from "./lib/base-url.mjs";

const WIDTHS = [1440, 1024, 390];
const MOTIONS = ["reduce", "no-preference"];
let MOTION = ""; // receipt label for the current pass
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
  console.error(receipt("frame", `(${width}${MOTION} ${route}) ${offender}`, got, expected));
};

const browser = await chromium.launch();
const edges = {}; // width -> { value, route }
const exempts = new Map(); // reason -> routes
const table = [];

for (const motion of MOTIONS) for (const width of WIDTHS) {
  MOTION = motion === "reduce" ? "" : " motion";
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: motion });
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
      /* TY (Elleta, 7 Oct 2026): every h1, case titles included, is Display/Page;
         the two case-title tokens were retired with it */
      const caseTitleSize = px(probe({ fontSize: "var(--typography-font-size-display-page)" }, "fontSize"));
      const caseTitleLong = caseTitleSize;
      const blockGap = px(probe({ paddingTop: "var(--case-gap-block)" }, "paddingTop"));
      const displaySize = px(probe({ fontSize: "var(--component-heading-hero-font-size)" }, "fontSize"));
      const cardShadow = probe({ boxShadow: "var(--shadow-card)" }, "boxShadow");
      const colMax = px(probe({ width: "var(--case-col-max)" }, "width"));
      const out = { fails: [], exempt: [], cards: [], edge: null, layoutB: false, edgeB: false, heroB: false };
      /* 0b. no runaway height at 1440, and the tallest leaf-ish culprit */
      const docH = document.documentElement.scrollHeight;
      if (innerWidth === 1440 && docH > 20000) {
        const tall = [...document.querySelectorAll("main *")]
          .filter((e) => e.children.length === 0 || e.tagName === "svg")
          .sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
        out.fails.push([`the page${tall ? ` (tallest: ${tall.tagName.toLowerCase()}.${String(tall.className?.baseVal ?? tall.className).split(" ")[0]} ${Math.round(tall.getBoundingClientRect().height)}px)` : ""}`, `scrollHeight ${docH}px`, "at most 20000px at 1440"]);
      }
      /* 0. no sideways scroll, and the element that causes it */
      const docW = document.documentElement.scrollWidth;
      if (docW > innerWidth + 1) {
        const wide = [...document.querySelectorAll("body *")].find((e) => {
          const r = e.getBoundingClientRect();
          return r.right > innerWidth + 1 && r.width > 0 && !e.closest("[data-frame-exempt]");
        });
        out.fails.push([`the page${wide ? ` (first past the edge: ${wide.tagName.toLowerCase()}.${String(wide.className).split(" ")[0]} "${(wide.textContent || "").trim().slice(0, 24)}")` : ""}`, `scrollWidth ${docW}px`, `at most the window, ${innerWidth}px`]);
      }
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
        let inner = Math.round(cont.getBoundingClientRect().left + px(cc.paddingLeft));
        if (cont.classList.contains("container--case")) {
          /* Layout B: the text column, centred in the case body */
          out.layoutB = true;
          /* Layout B on the body's edge (.container--edge, About, site v3):
             the text starts on the 1056 body's left edge, x192 at 1440;
             these routes share their own edge, compared with each other */
          out.edgeB = cont.classList.contains("container--edge");
          const content = cont.getBoundingClientRect().width - px(cc.paddingLeft) - px(cc.paddingRight);
          if (!out.edgeB) inner = Math.round(inner + Math.max(0, (content - colMax) / 2));
        }
        out.edge = inner;
        const h1 = main.querySelector("h1");
        /* the case hero band: the h1 on the band's own case-body edge */
        const band = h1?.closest(".case-hero");
        const bandBox = band?.querySelector(".container--case");
        if (bandBox) {
          inner = Math.round(bandBox.getBoundingClientRect().left + px(getComputedStyle(bandBox).paddingLeft));
          out.edge = inner;
          out.heroB = true;
        }
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
        const caseTitle = h.classList.contains("display-heading--title") && h.closest(".case-hero");
        const long = h.classList.contains("display-heading--title-long");
        const want = hero ? displaySize : caseTitle ? (long ? caseTitleLong : caseTitleSize) : pageSize;
        const recipe = hero ? "display" : caseTitle ? `case title${long ? " (long)" : ""}` : "page";
        if (Math.abs(size - want) > 0.5) F(h, `font-size ${size}px`, `${recipe} ${want}px`);
        if (!hero) {
          const measure = px(probe({ fontSize: c.fontSize, maxInlineSize: "var(--measure-title)", width: "10000px" }, "maxInlineSize", h.parentElement));
          const w = h.getBoundingClientRect().width;
          if (w > measure + 1) F(h, `${Math.round(w)}px wide`, `at most --measure-title, ${Math.round(measure)}px`);
        }
      }
      for (const h of main.querySelectorAll("h1, h2")) {
        /* a named exception (data-frame-exempt on the heading's section
           content, printed below every run): the Home h1, the story line
           locked by Elleta 3 Oct 2026, hidden behind the hero v3 words
           (4 Oct 2026) */
        if (h.parentElement?.querySelector(":scope > [data-frame-exempt]")) continue;
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
        const afterShowcase = s.previousElementSibling?.classList.contains("case-showcase");
        const wantTop = afterShowcase ? blockGap : i === 0 && !embed ? header + padY : padY;
        if (Math.abs(top - wantTop) > 1) F(s, `padding-top ${top}px`, afterShowcase ? `--case-gap-block after the case showcase, ${wantTop}px` : `${i === 0 && !embed ? "nav + " : ""}--section-pad-y, ${wantTop}px`);
        /* a Section flushBottom (named, printed with the exemptions below):
           no bottom pad by design (Home's proof row, Elleta, 4 Oct 2026) */
        const flush = s.classList.contains("l-section--flush-bottom") && s.hasAttribute("data-frame-exempt");
        if (flush ? bottom !== 0 : Math.abs(bottom - padY) > 1) F(s, `padding-bottom ${bottom}px`, flush ? "0 (flushBottom)" : `--section-pad-y, ${padY}px`);
      });

      /* 4 + 5. radii and cards */
      const CONTROL = "button, input, textarea, select, a.btn-key, [role=tab], .seg-control, .filter-chip";
      for (const el of main.querySelectorAll("*")) {
        if (exemptOf(el) || !visible(el)) continue;
        const c = getComputedStyle(el);
        const rc = el.getBoundingClientRect();
        const inPicture = el.parentElement?.closest('[role="img"]');
        for (const corner of inPicture ? [] : ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"]) {
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
        /* a Layout B picture (a figure's art, not its caption; or any
           [role=img] picture, such as the case hero's collage and the
           showcase's pieces) draws the Case UI kit: its boxes are not site
           cards (CLAUDE.md section 1, pictures only) */
        if (out.layoutB && (inPicture || (el.closest("figure") && !el.closest("figcaption, blockquote") && !el.matches("figure")))) continue;
        if (el.parentElement.closest("[data-card]")) continue;
        el.setAttribute("data-card", "");
        /* a shadow means it floats: allowed only on floating things (the
           next-case card, popovers, dialogs), and not a content card */
        if (c.boxShadow !== "none") {
          if (c.boxShadow !== cardShadow && !el.closest("[popover], [role=dialog], [role=tooltip]"))
            F(el, "a resting card with a shadow", "no shadow: shadows are for floating things only");
          continue;
        }
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
      const group = `${width}${r.layoutB ? (r.heroB ? " layout B hero" : r.edgeB ? " layout B edge" : " layout B") : ""}`;
      edges[group] ??= { value: r.edge, route };
      if (Math.abs(edges[group].value - r.edge) > 1)
        fail(route, width, "content edge", `${r.edge}px`, `${edges[group].value}px, as on ${edges[group].route}`);
    }
    for (const reason of r.exempt) exempts.set(reason, [...(exempts.get(reason) ?? []), `${route}@${width}`]);
    table.push(`  ${(String(width) + MOTION).padEnd(12)} ${route.padEnd(46)} edge ${r.edge ?? "-"}px  cards ${sigs.length}  ${r.fails.length ? `${r.fails.length} fail` : "ok"}`);
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
console.log(`frame gate: PASS (${ROUTES.length} routes × ${WIDTHS.length} widths × ${MOTIONS.length} motion settings)`);
