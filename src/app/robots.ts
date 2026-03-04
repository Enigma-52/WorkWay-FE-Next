import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "MetaBot" , "AhrefsSiteAudit" , "Bytespider" , "Meta-ExternalAgent" , "AhrefsBot" , "meta-externalagent"],
        disallow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
