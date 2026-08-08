import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const qs = new URLSearchParams({ user_id: session.user.dbId });
  if (tag) qs.set("tag", tag);

  const res = await fetch(new URL(`/api/cron/runs?${qs}`, env.BACKEND_API_URL), {
    headers: { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" },
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
