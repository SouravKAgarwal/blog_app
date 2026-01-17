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
    optimizePackageImports: ["lucide-react", "react-icons"],
    inlineCss: true,
  },
};

export default nextConfig;
