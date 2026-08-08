import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const targetEmail = new URL(req.url).searchParams.get("target_email");
  if (!targetEmail) return Response.json({ error: "target_email required" }, { status: 400 });

  const url = new URL("/api/admin/subscriptions", env.BACKEND_API_URL);
  url.searchParams.set("user_id", session.user.dbId);
  url.searchParams.set("target_email", targetEmail);

  const res = await fetch(url, {
    headers: { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" },
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
