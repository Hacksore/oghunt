/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;
