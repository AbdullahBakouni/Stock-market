import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static2.finnhub.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "finnhub.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
