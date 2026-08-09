import { env } from "@/lib/config/env";

export async function GET() {
  const res = await fetch(new URL("/api/analytics/public-stats", env.BACKEND_API_URL), {
    next: { revalidate: 1800 },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
