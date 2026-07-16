# elleta.design — visual language (the layer above tokens)

_What makes a page reach the home hero's level. Tokens say what values exist;
this says what MOVES a page must make with them. Pairs with
`portfolio-conformance-spec.md` (system rules) and `portfolio-ia-spec.md`
(structure). Source: `_proto/_hero.html` + the shipped home hero, 16 Jul 2026._

## The five signature moves

1. **Oversized Unique DISPLAY headline on every page open.**
   Each page opens with a display-scale Unique 700 headline — the "PICK A
   PIECE" register, not the 32px section-title register the inner pages
   used. Scale tokens: `--font-hero-unique` (home), `--font-case-display`
   `clamp(40px, 5vw, 96px)` (case pages and other page opens). Uppercase,
   line-height ≤1, letter-spacing 0.005em. Unique appears ONLY at display
   scale (locked type rule); everything below it is Geist.

2. **The glossy sphere is the brand atom.**
   The BubbleCluster bubble, reused literally: radial gradient face
   (`circle at 36% 30%`, case `hi → lo`), specular highlight at the upper
   left (`::after` white radial), soft shadow falling down-right
   (`13px 22px 44px` + the two insets). Spheres recur wherever a case is
   represented — hero map, case-page hero object, cross-links, "next case"
   footers. Never a flat colour disc.

3. **The connected-system motif as a quiet through-line.**
   Thin connectors (`--hero-link` stroke, 1.5px; iris `--hero-iris-bright`
   when active) with small node dots, echoing the hero hive beyond the
   hero: a case page's sphere carries a connector nodding back to the map
   it came from; related-case links may join nodes. Always aria-hidden,
   always decoration — meaning never lives only in the line.

4. **Dimensional lighting on interactive objects.**
   Anything pressable or hoverable is lit: keycaps (face gradient, plate,
   press-sink), spheres (gloss + cast shadow), cards (raised tier on
   hover). ONE light source, upper-left; all speculars top-left, all drop
   shadows down-right. Never a flat rectangle for an interactive object.

5. **Editorial confidence.**
   Asymmetric composition (offset objects, no centred-everything), generous
   whitespace inside the 1240 container, a SINGLE iris accent (case colours
   are data, not UI accent), keycaps for actions. When in doubt: fewer,
   bigger, more space.

## The connective device: colour + sphere = case identity

Every case IS a colour and a sphere, and that identity threads the whole
journey without breaking:

| Surface | Carrier |
| --- | --- |
| Hero map | the case's bubble (gradient `--case-*-hi/lo`, ink label) |
| Reveal card | colour-trace border / dark halo in `--cc`; kicker in `--case-*-deep` |
| Case page | MUST carry both: display headline in `--case-*-text` (flips for dark) + the case SPHERE as the hero object, connector back to the map |
| Back to Work | in-container backlink returns to the library where the same sphere sits in the Map view |

Rules: colour tokens only (`--case-*-hi/lo/deep/text`), never raw hex;
`--case-*-text` for any case-coloured TEXT (AA in both themes); sphere ink
is the fixed `--hero-bub-ink` on the pastel face. The case colour never
fills a whole card or button — it lives in the headline, kicker, sphere,
trace, glow.

## Status
Rolled out (16 Jul 2026): the display headline + sphere hero + connector
are the CaseStudyShell DEFAULT (no per-page props — the template drives
every case). Top-level pages open with the shared PageHeader (Unique
display): /work, /point-of-view, /contact.
