import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const backendApiUrl = process.env.BACKEND_API_URL;
    if (!backendApiUrl) return [];

    return [
      {
        source: "/sitemap.xml",
        destination: `${backendApiUrl}/api/sitemap.xml`,
      },
      {
        source: "/sitemaps/:file",
        destination: `${backendApiUrl}/api/sitemaps/:file`,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
