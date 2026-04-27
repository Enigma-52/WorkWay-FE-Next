import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
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
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: [
              "</sitemap.xml>; rel=\"sitemap\"",
              "</robots.txt>; rel=\"robots\"",
            ].join(", "),
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
