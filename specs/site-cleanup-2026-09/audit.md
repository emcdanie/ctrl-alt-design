# Visual audit, elleta.design, 18 Sep 2026

Live site, 11 routes, 390 + 1440 wide, light + dark (44 full-page frames, all viewed at thumbnail scale; 768/1024/360 not captured yet).
Ranked by how much each one says "doesn't get UX" to a hiring manager.

## P1, fix first (duplicates and contradictions)
1. **Two buttons for one action, CHIP case.** "Open the live CHIP prototype" (outline) sits directly above a card with "Load the live prototype" (filled). Same destination, two styles. Keep one.
2. **Three CTAs in the home hero.** "Browse the library" + "Short on time? The quick version" + "Inspect it live". A hero should ask for one thing. Keep one primary, move the others.
3. **The same card, three times, on the Code First case.** The "Operational Clarity" demo card renders in beat 01, inside the layer journey, and again in beat 03. Reads as a copy-paste mistake.
4. **Numbers disagree across pages.** System page: "17 checks". Code First case: "13/13" and "13 audits waiting". Spec says 16. A reviewer who spots this doubts every other claim. One number, from one source.
5. **Design Lab card duplicates CHIP (/quick).** Titled "Design Lab", labelled "Personal OS · 2026", description starts "CHIP: ...", and its image is a grey placeholder that just says DESIGN LAB. Looks unfinished.
6. **/skills is the same matrix as /quick**, a whole nav item for a table that already exists. And the "UX Research" row has no dots at all: a skill with zero evidence, shown on purpose.
7. **Mango logo 404** in Experience (`/images/logos/mango.png`), so it falls back to an "M" square. Several other rows use letter placeholders too, so the list looks half-branded.

## P2, layout and hierarchy
8. **Orphan cards on /work.** Case grid row 2 has two cards and an empty third slot; the F1 dashboard and Pattern Mentor sit alone in their rows. Grid should fill or be deliberately 2-up.
9. **Left edges don't line up on /work.** The case grid starts at one x, the Design Lab and Interactive sections are indented further. Breaks the one-container rule.
10. **CHIP is the featured card on /work AND a card on home AND /quick**, with the same screenshot at every size. The featured slot loses meaning.
11. **"Try demo →" looks like a tag.** It is styled like the grey metadata chips next to it, so the only action on the card has no affordance.
12. **Filter row mixes two kinds of filter.** Skill chips and type chips ("case study", "prototype") sit in one row with a "+3 more" link in the middle. On mobile the row wraps to 5 lines before any content.
13. **About is a CV dump.** Stats, collaborate cards, problem cards, learning accordion, 9 experience rows, 4 education rows, vinyl player, podcasts, testimonials. No story, and certifications (Brad Frost Maker Program etc.) are buried in the middle as accordions.
14. **Testimonials only exist while scrolled into view.** They fade in on scroll; before that the section is a big blank gap (visible in full-page captures and to anyone jumping via anchor). The quote mark glyph also renders as a tiny speck.
15. **Closing CTA on About uses a third heading style** (Geist caps, not Unique, not the Heading primitive) and a secondary button, so the page's final ask is its quietest.
16. **Big empty band at the bottom of /design-system** under "The claim", before the footer.

## P3, mobile
17. **Contact card at 390**: the name/bio column is squeezed beside the photo to one or two words per line.
18. **Home at 390**: the photo lands after all three CTAs, so the first screen is text-only and the photo floats mid-page.
19. **Work toolbar at 390**: search, button, 5 rows of chips, then view switcher before the first card (roughly a full screen of controls).

## P4, housekeeping
20. Link prefetch 404s for the static demos (`/demos/*.html?_rsc=`): harmless for users, noisy in the console. Use a plain `<a>` for static HTML, not `next/link`.
21. The home page has no footer or closing contact prompt; it ends on the bubble cluster.

## Not verified
768, 1024 and 360 widths; hover/focus states; the nav overlay menu on mobile; the Map and Table views on /work; the inspector interaction; keyboard pass.
