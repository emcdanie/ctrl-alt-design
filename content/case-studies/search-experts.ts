import type { CaseStudy } from "@/lib/content";

/* Search for experts (Elleta, approved mock case-study-search-mock.html,
 * 21 Sep 2026): the flight results page, shipped and refined, with the
 * working prototype and its six notes. Copy is the mock's. NDA: a B2B
 * travel platform, industry only. */
const study: CaseStudy = {
  slug: "search-experts",
  title: "Search for people who know what they want.",
  category: "PRODUCT DESIGN",
  year: "2024-2026",
  scope: "Flight search and results",
  timeline: "2024 to 2026",
  images: [],
  tags: ["Product design", "Search", "Prototyping"],
  description: "The people booking used it every day. I shipped a results page that kept their search in view and put filters behind one button.",
  summary: "The people booking used it every day. They knew the route, the fare and the policy. I shipped a results page that kept their search in view and put filters behind one button. This is that page, and the version I'd build with the time for every micro-interaction.",
};

export default study;
