import { buildLlmsFullTxt } from "@/lib/mcp/llms";

// Full MCP documentation as one plain-text file, generated from the same
// MCP_TOOLS source the HTML docs render from.
export const revalidate = 3600;

export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
