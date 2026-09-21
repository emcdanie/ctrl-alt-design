import type { CaseStudy } from "@/lib/content";

/* Forms and checkout (Elleta, approved mock case-study-checkout-mock.html,
 * 21 Sep 2026): the checkout before and after, as a traveller or a travel
 * manager, and the blocks it is built from. Copy is the mock's. NDA: a
 * B2B travel platform, industry only; the colleague is a role. */
const study: CaseStudy = {
  slug: "checkout",
  title: "A checkout that knows who's paying.",
  category: "PRODUCT DESIGN",
  year: "2024-2026",
  scope: "Checkout and payment, every product",
  timeline: "2024 to 2026",
  images: [],
  tags: ["Product design", "Forms", "Design systems"],
  description: "I designed the checkout and payment step once, for every product, so company rules show up as fewer choices instead of more forms.",
  summary: "Company travel has rules: who you book for, what your role allows, which cards you may see. I designed the checkout and payment step once, for every product, so those rules show up as fewer choices instead of more forms.",
};

export default study;
