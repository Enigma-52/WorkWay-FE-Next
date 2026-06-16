import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const qs = new URLSearchParams({ user_id: session.user.dbId });
  if (searchParams.get("check")) qs.set("check", "1");
  if (searchParams.get("alert_type")) qs.set("alert_type", searchParams.get("alert_type")!);
  if (searchParams.get("company_slug")) qs.set("company_slug", searchParams.get("company_slug")!);

  const res = await fetch(new URL(`/api/alerts?${qs}`, env.BACKEND_API_URL));
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const res = await fetch(new URL("/api/alerts", env.BACKEND_API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, user_id: session.user.dbId }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
