import { env } from "@/lib/config/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const backendUrl = new URL("/api/feed/job-views", env.BACKEND_API_URL);
  backendUrl.searchParams.set("limit", searchParams.get("limit") || "20");

  const response = await fetch(backendUrl.toString(), {
    headers: { "x-workway-next-ssr": "1" },
  });

  const responseText = await response.text();
  return new Response(responseText, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/json",
      "Cache-Control": "public, max-age=30, stale-while-revalidate=30",
    },
  });
}
