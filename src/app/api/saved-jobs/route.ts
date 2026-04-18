import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const res = await fetch(new URL(`/api/saved-jobs?user_id=${session.user.dbId}`, env.BACKEND_API_URL));
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const res = await fetch(new URL("/api/saved-jobs", env.BACKEND_API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, user_id: session.user.dbId }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
