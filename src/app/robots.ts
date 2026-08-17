import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/metadata";

// robots.txt is hit by every crawler on essentially every visit, including
// Google before it's willing to crawl anything else on the domain — if it
// can't be fetched, Google backs off crawling broadly rather than skipping
// one page. The content changes rarely, so serve it from Cloudflare's edge
// cache instead of hitting origin on every single fetch (previously
// `Cache-Control: max-age=0, must-revalidate` — zero cushion against any
// transient origin blip).
export const revalidate = 3600;

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      // Ported from Cloudflare's "Managed robots.txt" feature so this file
      // is a complete, self-contained source of truth once that feature is
      // turned off — previously these were only blocked via Cloudflare's
      // edge-injected block, invisible to anything reading this file
      // directly. Google-Extended is Google's separate AI-training
      // crawler — distinct from Googlebot, which is unaffected by this and
      // keeps crawling/indexing for Search normally.
      {
        userAgent: "Amazonbot",
        disallow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        disallow: "/",
      },
      {
        userAgent: "ClaudeBot",
        disallow: "/",
      },
      {
        userAgent: "CloudflareBrowserRenderingCrawler",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      // Retrieval/citation bots, not training bots — these are what let
      // ChatGPT/Claude/Perplexity actually cite our job listings when a user
      // asks them a live question. Keep these allowed while GPTBot/ClaudeBot
      // (training crawlers) stay blocked above.
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
      },
      {
        userAgent: "Claude-User",
        allow: "/",
      },
      // Fetches docs for coding-assistant tasks, not training — same
      // user-driven-fetch category as Claude-User/ChatGPT-User.
      {
        userAgent: "Claude-Code",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Perplexity-User",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Bytespider",
        disallow: "/",
      },
      {
        userAgent: "Meta-ExternalAgent",
        disallow: "/",
      },
      {
        userAgent: "meta-externalagent",
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
