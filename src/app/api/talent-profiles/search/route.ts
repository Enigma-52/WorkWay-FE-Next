import { env } from "@/lib/config/env";

export async function GET(req: Request) {
  const { search } = new URL(req.url);
  const res = await fetch(new URL(`/api/talent-profiles/search${search}`, env.BACKEND_API_URL));
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
