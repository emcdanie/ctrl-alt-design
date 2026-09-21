import type { CaseStudy } from "@/lib/content";

/* The travel platform, the umbrella case (Elleta, approved mock
 * case-study-booking-mock.html, 21 Sep 2026). Copy is the mock's, as
 * written, with the 21 Sep corrections (the developer line matches Drift
 * 05). NDA: a B2B travel platform, industry only; screens de-branded. */
const study: CaseStudy = {
  slug: "booking-platform",
  title: "A booking platform, rebuilt mid-flight.",
  category: "PRODUCT DESIGN",
  year: "2024-2026",
  scope: "System, search, flights, cars, checkout, admin",
  timeline: "2024 to 2026",
  metrics: {
    role: "Lead product designer, design systems",
    team: "My squads: engineering and product",
    timeline: "2024 to 2026",
    scope: "System, search, flights, cars, checkout, admin",
  },
  images: [],
  tags: ["Product design", "Design systems", "Research"],
  description: "A redesign that had not shipped in two years became a platform that did: a system in code, a funded team and six product areas live.",
  summary: "A redesign that had not shipped in two years became a platform that did: a system in code, a funded team and six product areas live.",
};

export default study;
