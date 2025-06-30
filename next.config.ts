import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.faceit.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "distribution.faceit-cdn.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
