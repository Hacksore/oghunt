import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ph-files.imgix.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "my.flosa.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.seattlesafeeats.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "splist.fm",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cook-around-find-out-v2.vercel.app",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "oghunt.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
