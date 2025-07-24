import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
      {
        hostname: "customer-afly4gowro09dhrh.cloudflarestream.com",
      },
    ],
  },
};

export default nextConfig;
