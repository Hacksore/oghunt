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
    ],
  },
};

export default nextConfig;
