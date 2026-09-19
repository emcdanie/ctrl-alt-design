import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      // IA lock 2026-07-17: Point of View folded into About
      { source: "/point-of-view", destination: "/about#how-i-think", permanent: true },
      // learning build 2026-09-19: the skills matrix is a view of /learning
      { source: "/skills", destination: "/learning?view=skills", permanent: true },
    ];
  },
};

export default nextConfig;
