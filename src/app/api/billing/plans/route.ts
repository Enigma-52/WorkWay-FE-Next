import { env } from "@/lib/config/env";

// No auth — pricing is public info, this is what signed-out visitors on
// /pricing hit too. Falls through the generic /api/ nginx location straight
// to the backend, same as any other unauthenticated read.
export async function GET() {
  const res = await fetch(new URL("/api/billing/plans", env.BACKEND_API_URL), {
    next: { revalidate: 300 },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
