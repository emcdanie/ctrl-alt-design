/* The Drift case's recreated pictures (Geist refresh, 22 Sep 2026),
 * ported from Part B of bella/docs/reference/case-study-mock.html.
 * Each returns the inner markup of a data-bella-diagram <svg>: 1px ink
 * strokes (.s), line fills (.f), chip fills (.c1/.c2/.c3), Mono labels
 * (.t/.ti/.tk, 13px). Highlight groups (.k1-.k4, .p1-.p5, .lc) carry an
 * .hlr rect the page lights up on hover, focus and decision. Labels the
 * mock set at 10-11px are at 13px; where a label no longer fitted, it
 * was shortened (role pill widths, the row actions). */

const R = (x: number, y: number, w: number, h: number, rx: number, c = "s", st = "") =>
  `<rect class="${c}" x="${x + 0.5}" y="${y + 0.5}" width="${w}" height="${h}" rx="${rx}"${st ? ` style="${st}"` : ""}/>`;
const T = (x: number, y: number, t: string, c = "t", a = "start", st = "") =>
  `<text class="${c}" x="${x}" y="${y}" text-anchor="${a}"${st ? ` style="${st}"` : ""}>${t}</text>`;
const d = (i: number) => `animation-delay:${(i * 0.03).toFixed(2)}s`;

/* 01: seventeen buttons, 9 + 8 rows, centred; the lavender one was kept */
export function buttonGrave() {
  const radii = [2, 6, 13, 4, 0, 10, 8, 13, 3, 12, 5, 1, 9, 7, 11, 13, 4];
  const labels = ["Book", "Book now", "Search", "Continue", "Book", "Book", "Book now", "Search", "Continue", "Book", "Book", "Book now", "Search", "Continue", "Book", "Book", "Book now"];
  let h = "";
  radii.forEach((r, i) => {
    const row = i < 9 ? 0 : 1;
    const n = row ? 8 : 9;
    const col = row ? i - 9 : i;
    const w = 82;
    const gap = 12;
    const total = n * w + (n - 1) * gap;
    const x = (900 - total) / 2 + col * (w + gap);
    const y = row ? 112 : 52;
    const keep = i === 7;
    const wt = [400, 500, 400, 500, 400, 500, 400, 500][i % 8];
    h += R(x, y, w, 34, r, keep ? "c1" : "s") + T(x + w / 2, y + 22, labels[i], keep ? "tk" : "ti", "middle", `font-weight:${wt}`);
  });
  return h;
}

/* 1 the file: an overloaded canvas, dense and uneven (seeded, so it is
   the same picture every time), shown whole (item 7, 22 Sep 2026; was a
   crop with a slow zoom to the duplicates): the canvas is measured as it
   is drawn and scaled to fit the 900 x 340 window, so nothing is cut */
function sceneFile() {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const ri = (a: number, b: number) => Math.floor(a + rnd() * (b - a + 1));
  const B = (x: number, y: number, w: number, h: number, c = "f", st = "") => R(x, y, w, h, Math.min(3, h / 2), c, st);
  const L = (x: number, y: number, t: string) => `<text class="t" x="${x}" y="${y}">◆ ${t}</text>`;
  const kinds: Record<string, (x: number, y: number, w: number, h: number) => string> = {
    cards: (x, y, w, h) => {
      let o = "";
      for (let yy = y + 10; yy < y + h - 34; yy += 40)
        o += B(x + 8, yy, 40, 30) + B(x + 54, yy + 3, w - 90, 5) + B(x + 54, yy + 12, w - 110, 4) + B(x + 54, yy + 20, w - 100, 4) + B(x + w - 30, yy + 3, 20, 8, "c3", "opacity:.7");
      return o;
    },
    table: (x, y, w, h) => {
      let o = "";
      for (let yy = y + 10; yy < y + h - 12; yy += 13) o += B(x + 8, yy, w * 0.3, 4) + B(x + w * 0.4, yy, w * 0.2, 4) + B(x + w * 0.68, yy - 1, w * 0.22, 6, rnd() < 0.5 ? "c3" : "c2", "opacity:.6");
      return o;
    },
    chips: (x, y, w, h) => {
      let o = "";
      for (let yy = y + 10; yy < y + h - 16; yy += 16) for (let xx = x + 8; xx < x + w - 40; xx += ri(38, 52)) o += R(xx, yy, 34, 10, ri(0, 5), rnd() < 0.3 ? "fill-ink" : "s", "opacity:.8");
      return o;
    },
    inputs: (x, y, w, h) => {
      let o = "";
      for (let yy = y + 12; yy < y + h - 18; yy += 20) o += R(x + 10, yy, w - 20, 13, ri(0, 6), "s") + B(x + 16, yy + 5, ri(20, 50), 3);
      return o;
    },
    text: (x, y, w, h) => {
      let o = "";
      let t = 9;
      for (let yy = y + 12; yy < y + h - 8; yy += t + 6) {
        o += B(x + 8, yy, w - ri(16, 60), t, "f");
        t = Math.max(3, t - 1);
      }
      return o;
    },
    swatch: (x, y, w, h) => {
      let o = "";
      const cs = ["f", "f", "fill-ink", "c1", "c2", "c3", "f"];
      for (let yy = y + 10; yy < y + h - 14; yy += 18) for (let xx = x + 8; xx < x + w - 14; xx += 16) o += R(xx, yy, 12, 12, 2, cs[ri(0, 6)], "opacity:.8");
      return o;
    },
  };
  const names: Record<string, string[]> = {
    cards: ["Cards", "Highlighted info", "Highlighte…", "_old_Cards", "Hotel card", "Car card"],
    table: ["Fares", "Fares v2", "_old_Fares", "Guest & rooms", "Pricing"],
    chips: ["Chips", "Pills", "Badge", "Tags", "Segment control"],
    text: ["Text styles", "_tokens/sizes", "Headings"],
    swatch: ["Colors", "_tokens/colour", "Accent"],
  };
  const dupNames = ["Inputs", "Input v2", "_old_Users/Edit form", "InputField", "Search input"];
  let o = "";
  let right = 0;
  let bottom = 0;
  let x = 20;
  let colI = 0;
  let dupPlaced = 0;
  const dupCols = [1, 3, 5, 8, 10];
  while (x < 1760) {
    const w = ri(120, 210);
    let y = ri(14, 50);
    while (y < 640) {
      const h = ri(70, 190);
      const isDup = dupCols.includes(colI) && dupPlaced < 5 && y > 120 && y < 420 && !o.includes("dup" + colI);
      const kind = isDup ? "inputs" : ["cards", "table", "chips", "text", "swatch", "cards", "table"][ri(0, 6)];
      const nm = isDup ? dupNames[dupPlaced] : names[kind][ri(0, names[kind].length - 1)];
      o += `<g class="${isDup ? "k k1 dup" + colI : ""}">` + (isDup ? R(x - 5, y - 18, w + 10, h + 24, 10, "hlr", "opacity:.45") : "") + L(x, y - 5, nm) + R(x, y, w, h, 6, "s", "opacity:.55") + kinds[kind](x, y, w, h) + "</g>";
      if (isDup) dupPlaced++;
      right = Math.max(right, x + w + 5);
      bottom = Math.max(bottom, y + h + 6);
      y += h + ri(26, 40);
    }
    x += w + ri(14, 26);
    colI++;
  }
  /* fit the whole canvas inside the window with a 10px margin, centred */
  const k = Math.min(880 / right, 320 / bottom);
  const tx = (900 - right * k) / 2;
  const ty = (340 - bottom * k) / 2;
  return `<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${k.toFixed(4)})">${o}</g>`;
}

/* 2 one field, five ways */
function sceneField() {
  let o = "";
  const v: [number, string][] = [
    [4, "outside"],
    [12, "inside"],
    [0, "floating"],
    [8, "none"],
    [20, "outside"],
  ];
  v.forEach(([rx, lab], i) => {
    const x = 40 + i * 168;
    const y = 90;
    o += `<g class="pop k k2" style="${d(i * 3)}">` + R(x - 8, y - 40, 152, 150, 12, "hlr");
    if (lab === "outside") o += T(x, y - 10, "Label", "ti");
    o += R(x, y, 136, i === 3 ? 30 : 40, rx);
    if (lab === "inside") o += T(x + 12, y + 25, "Label", "t");
    if (lab === "floating") o += T(x + 12, y + 15, "Label", "t") + R(x + 12, y + 22, 60, 5, 2, "f");
    if (lab === "none") o += `<circle class="s" cx="${x + 16}" cy="${y + 15}" r="6"/>` + R(x + 30, y + 12, 60, 5, 2, "f");
    if (lab === "outside") o += R(x + 12, y + 17, 70, 5, 2, "f");
    o += `<path class="x" d="M${x + 60} ${y + 80} l14 14 M${x + 74} ${y + 80} l-14 14"/>` + T(x + 68, y + 120, "radius " + rx, "t", "middle") + T(x + 68, y + 138, "label " + lab, "t", "middle") + "</g>";
  });
  return o;
}

/* 3 the fix: size x intent */
function sceneFix() {
  let o = "";
  const sizes = ["small", "medium", "large"];
  const colW = 100; /* 6 x 100 + the frame fits the 900 viewBox (was 110: cut off, 22 Sep 2026) */
  const x0 = 240;
  const y0 = 70;
  o += T(150, y0 + 60, "intent", "t", "end") + T(150, y0 + 78, "positive", "ti", "end") + T(150, y0 + 150, "intent", "t", "end") + T(150, y0 + 168, "negative", "ti", "end");
  o += R(x0 - 10, y0 + 10, colW * 6 + 20, 190, 12, "dash");
  [0, 1].forEach((emph) =>
    sizes.forEach((sz, i) => {
      const cx = x0 + (emph * 3 + i) * colW + colW / 2;
      const k = emph === 1 && i === 1 ? "k k3" : "";
      o += `<g class="pop ${k}" style="${d(emph * 3 + i)}">` + (k ? R(cx - colW / 2 + 4, y0 + 14, colW - 8, 182, 10, "hlr") : "") + T(cx, y0 - 22, "size", "t", "middle") + T(cx, y0 - 4, sz, "ti", "middle");
      const w = [54, 64, 76][i];
      const h = [22, 26, 30][i];
      (
        [
          ["c3", y0 + 70],
          ["c2", y0 + 160],
        ] as [string, number][]
      ).forEach(([c, yy]) => {
        o += emph ? R(cx - w / 2, yy - h / 2 - 4, w, h, h / 2, c) : R(cx - w / 2, yy - h / 2 - 4, w, h, h / 2, "s") + R(cx - w / 2 + 1, yy - h / 2 - 3, w - 2, h - 2, h / 2, c, "opacity:.45");
        o += T(cx, yy + 1, "Label", "tk", "middle");
      });
      o += "</g>";
    }),
  );
  o += T(x0 + colW * 1.5, y0 + 230, "subtle", "t", "middle") + T(x0 + colW * 4.5, y0 + 230, "strong", "t", "middle");
  return o;
}

/* 4 users & roles: everything looked the same, so nothing was clear */
function sceneUsers() {
  let o = "";
  const H = (n: number, x: number, y: number, w: number, h: number, r = 8) => `<g class="p${n}">${R(x, y, w, h, r, "hlr")}</g>`;
  const LC = (x: number, y: number, w: number, h: number, r: number) => `<g class="lc">${R(x - 4, y - 4, w + 8, h + 8, r + 4, "hlr")}</g>`;
  const ico = (x: number, y: number) => R(x, y, 12, 10, 2);
  const onInk = (x: number, y: number, t: string) => `<text class="t on-ink" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
  /* before */
  let g = R(20, 20, 400, 290, 12) + T(20, 336, "before", "t");
  g += H(4, 26, 26, 388, 28) + [0, 1, 2].map((i) => `<path class="s" d="M36 ${34 + i * 5} h14"/>`).join("") + R(60, 33, 40, 10, 5, "f") + R(116, 33, 44, 10, 5, "f") + R(170, 33, 56, 10, 5, "f");
  g += T(40, 82, "Users", "ti");
  g += H(1, 236, 62, 176, 30) + LC(248, 68, 70, 20, 4) + R(248, 68, 70, 20, 4) + T(283, 83, "import", "t", "middle") + LC(326, 68, 76, 20, 4) + R(326, 68, 76, 20, 4, "fill-ink") + onInk(364, 83, "new user");
  g += LC(40, 104, 56, 18, 9) + R(40, 104, 56, 18, 9, "fill-ink") + onInk(68, 118, "users");
  g += H(3, 344, 98, 72, 30) + LC(354, 104, 52, 18, 9) + R(354, 104, 52, 18, 9) + T(380, 118, "roles", "t", "middle");
  g += R(40, 134, 300, 18, 4) + R(348, 134, 52, 18, 4);
  const roles = ["superadmin", "admin", "member", "member", "member"];
  for (let r = 0; r < 5; r++) {
    const y = 168 + r * 28;
    g += `<circle class="s" cx="48" cy="${y + 9}" r="8"/>` + R(62, y + 4, 60, 6, 3, "f") + R(62, y + 13, 44, 4, 2, "f");
    const filled = r < 2;
    g += (r === 0 ? H(1, 128, y - 4, 96, 26) : "") + LC(132, y, 88, 18, 9) + R(132, y, 88, 18, 9, filled ? "fill-ink" : "s") + (filled ? onInk(176, y + 14, roles[r]) : T(176, y + 14, roles[r], "t", "middle"));
    g += R(232, y + 6, 70, 6, 3, "f") + (r === 0 ? H(2, 316, y - 4, 90, 26) : "") + LC(322, y + 4, 12, 10, 2) + ico(322, y + 4) + LC(342, y + 4, 12, 10, 2) + (r === 2 ? R(342, y + 4, 12, 10, 2, "c2") : ico(342, y + 4)) + LC(362, y + 4, 12, 10, 2) + ico(362, y + 4);
  }
  o += `<g class="pop" style="${d(0)}">${g}</g>`;
  o += `<path class="s" d="M444 170 H464 m-6 -5 l6 5 l-6 5"/>` /* in the gap between the halves at 390 (they show 10-440 and 470-900) */;
  /* after */
  let h = R(480, 20, 400, 290, 12) + T(480, 336, "after", "t");
  h += H(4, 486, 26, 388, 28) + R(500, 33, 40, 10, 5, "f") + R(556, 33, 44, 10, 5, "f") + R(610, 33, 56, 10, 5, "f");
  h += H(3, 616, 58, 128, 30) + LC(626, 64, 54, 18, 9) + R(626, 64, 54, 18, 9, "c1") + T(653, 78, "users", "tk", "middle") + LC(686, 64, 52, 18, 9) + R(686, 64, 52, 18, 9) + T(712, 78, "roles", "t", "middle");
  h += T(500, 108, "Users", "ti") + H(5, 494, 112, 272, 22) + T(500, 128, "10 users · 8 unregistered · invite", "t");
  h += H(1, 770, 92, 100, 34) + LC(780, 98, 82, 22, 6) + R(780, 98, 82, 22, 6, "fill-ink") + onInk(821, 114, "new user +");
  h += LC(500, 142, 120, 18, 4) + R(500, 142, 120, 18, 4) + LC(628, 142, 56, 18, 4) + R(628, 142, 56, 18, 4) + LC(692, 142, 64, 18, 4) + R(692, 142, 64, 18, 4) + T(862, 156, "clear ×", "t", "end");
  h += R(500, 170, 360, 1, 0, "f") + LC(790, 176, 30, 12, 3) + R(790, 176, 30, 12, 3) + LC(826, 176, 30, 12, 3) + R(826, 176, 30, 12, 3);
  h += T(500, 202, "name", "t") + H(2, 588, 188, 176, 120) + T(596, 202, "role", "t") + T(670, 202, "status", "t") + T(800, 202, "action", "t");
  const rl = ["admin", "member", "viewer", "viewer"];
  const st = ["✓ registered", "✉ send email", "✓ registered", "✓ registered"];
  rl.forEach((role, r) => {
    const y = 216 + r * 24;
    h += R(500, y, 70, 6, 3, "f") + `<circle class="s" cx="601" cy="${y + 3}" r="4"/>` + T(610, y + 8, role, "t") + T(670, y + 8, st[r], "t") + `<g class="lc">${R(796, y - 6, 70, 16, 4, "hlr")}</g>` + T(800, y + 8, "edit", "t");
  });
  o += `<g class="pop" style="${d(6)}">${h}</g>`;
  return o;
}

export const SCENES = [
  {
    svg: sceneFile(),
    caption: "Before: one Figma file held every style and every component. The lavender frames are the same input, built again and again. Recreated from my deck.",
    label: "An overloaded Figma file: dozens of uneven frames of cards, tables, chips and swatches; five of them, highlighted, are the same input built again.",
  },
  {
    svg: sceneField(),
    caption: "The same field, five ways: different corners, heights and label positions. Recreated.",
    label: "Five versions of one text field side by side, each with a different corner radius and label position.",
  },
  {
    svg: sceneFix(),
    caption: "One badge, with size and intent as variants instead of new components. Recreated.",
    label: "One badge component laid out as a matrix: three sizes across, positive and negative intent down, subtle and strong emphasis.",
  },
  {
    svg: sceneUsers(),
    caption: "Users and roles, before and after. Before, roles, tabs and actions all wore the same filled pill, so nothing said “click me”. Recreated from my deck; the client, people and emails are removed.",
    label: "The users and roles screen before and after. Before, tabs, roles and actions are all filled pills; after, one filled button, tabs at the top, roles as text and actions as words.",
  },
];

export const DECISIONS: { t: string; b: string; w: string; pins: [number, number, "a" | "b"][] }[] = [
  {
    t: "One clear call to action.",
    b: "“New user”, the users tab and the role badges were the same filled pill, so there was no clear CTA.",
    w: "One filled button per page. Import and export move into the table, smaller.",
    pins: [
      [222, 78, "b"],
      [757, 111, "a"],
    ],
  },
  {
    t: "Badges stop looking like buttons.",
    b: "Roles were pills that looked clickable, and actions were a row of icons.",
    w: "A role is information, not an action: icon plus text. Status gets its own column; actions are words.",
    pins: [
      [300, 177, "b"],
      [644, 197, "a"],
    ],
  },
  {
    t: "Users and roles become tabs at the top.",
    b: "Roles was a small pill on the far right, a hidden entry point.",
    w: "You can find it, and the navigation reads in one order.",
    pins: [
      [330, 114, "b"],
      [604, 73, "a"],
    ],
  },
  {
    t: "The side nav goes.",
    b: "A hamburger menu added another layer to open.",
    w: "Fewer layers: the top nav and a breadcrumb carry it.",
    pins: [
      [26, 26, "b"],
      [486, 26, "a"],
    ],
  },
  {
    t: "The header tells you where you stand.",
    b: "You had to count the table to know who was set up.",
    w: "“10 users · 8 unregistered”, with invite right there, so the next step is obvious.",
    pins: [[490, 118, "a"]],
  },
];
