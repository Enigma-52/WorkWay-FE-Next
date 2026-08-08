import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { tag, enabled } = await req.json();
  if (!tag || typeof enabled !== "boolean") {
    return Response.json({ error: "tag and enabled (boolean) required" }, { status: 400 });
  }

  const res = await fetch(
    new URL(
      `/api/cron/toggle/${encodeURIComponent(tag)}?enabled=${enabled}&user_id=${session.user.dbId}`,
      env.BACKEND_API_URL
    ),
    { headers: { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" } }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
