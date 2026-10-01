import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      // IA lock 2026-07-17: Point of View folded into About
      { source: "/point-of-view", destination: "/about#how-i-think", permanent: true },
      // learning build 2026-09-19: the skills matrix is a view of /learning
      { source: "/skills", destination: "/learning?view=skills", permanent: true },
      // short links 2026-10-01: /in is the LinkedIn link, tagged for Umami; temporary so the target can change
      { source: "/in", destination: "/?utm_source=linkedin&utm_medium=social", permanent: false },
    ];
  },
};

export default nextConfig;
