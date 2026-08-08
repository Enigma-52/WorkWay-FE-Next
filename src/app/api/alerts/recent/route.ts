import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(new URL(`/api/alerts/recent?user_id=${session.user.dbId}`, env.BACKEND_API_URL), {
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
