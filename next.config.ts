import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  cacheComponents: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    inlineCss: true,
  },
};

export default nextConfig;
