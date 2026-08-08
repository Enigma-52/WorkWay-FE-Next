import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const res = await fetch(new URL("/api/admin/revoke-role", env.BACKEND_API_URL), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "",
    },
    body: JSON.stringify({ ...body, user_id: session.user.dbId }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
