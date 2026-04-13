import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@tanstack/react-query"],
    /** Avoids dev-only RSC bundler errors around `segment-explorer-node` / SegmentViewNode (Next 15 default is true). */
    devtoolSegmentExplorer: false,
  },
};

export default nextConfig;
