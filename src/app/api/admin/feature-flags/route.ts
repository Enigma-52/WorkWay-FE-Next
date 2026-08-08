import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

async function requireAdminSession() {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return Response.json({ error: "Admin access required" }, { status: 403 });

  const res = await fetch(
    new URL(`/api/admin/feature-flags?user_id=${session.user.dbId}`, env.BACKEND_API_URL),
    { headers: { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" } }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
