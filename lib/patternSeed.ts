/* The pattern-field seed for a route (PatternField brief, 22 Sep 2026):
   FNV-1a over the pathname, so every route draws its own field and the
   same route draws the same one every build. Shared by RouteField (the
   client) and the /pattern/ SVG route (the server). */

export function routeSeed(pathname: string) {
  const path = pathname.replace(/\/+$/, "") || "/";
  let h = 0x811c9dc5;
  for (let i = 0; i < path.length; i++) {
    h ^= path.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) % 999983) + 1;
}

/** Quiet section fields per page, after the hero. */
export const SECTION_FIELDS = 8;

/* the routes whose fields are prerendered at build; any other route's
   files render on first request and cache */
export const PRERENDERED_FIELD_SEEDS = ["/", "/work", "/quick", "/about", "/design-system", "/learning"].map(routeSeed);
