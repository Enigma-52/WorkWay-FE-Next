import { buildLlmsTxt } from "@/lib/mcp/llms";

// llms.txt — the emerging convention for giving AI agents a curated, plain-text
// map of a site. Retrieval crawlers (Claude-User, ChatGPT-User, PerplexityBot)
// are allowed in robots.ts, so this is what they should find first.
export const revalidate = 3600;

export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
