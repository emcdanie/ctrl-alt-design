/**
 * Case study content registry.
 * Add new case studies here — they'll automatically appear
 * in the grid and be routable at /case-studies/[slug].
 *
 * Curation (Elleta, 22 Jul 2026): three star cases only. Archived
 * cases live in _archive/ with full content, deliberately unrouted.
 * The travel platform set (21 Sep 2026): the umbrella and two of its
 * stories, Search and Checkout.
 */

export { default as bookingPlatform } from "./booking-platform";
export { default as searchExperts } from "./search-experts";
export { default as checkout } from "./checkout";

export { default as designSystemTransformation } from "./design-system-transformation";
export { default as bradFrost } from "./brad-frost";
export { default as chip } from "./chip";
export { default as theming } from "./theming";
