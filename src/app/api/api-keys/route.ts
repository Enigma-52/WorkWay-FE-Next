import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const res = await fetch(
    new URL(`/api/api-keys?user_id=${session.user.dbId}`, env.BACKEND_API_URL)
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // user_id comes from the session, never the request body — otherwise a caller
  // could mint a key against someone else's account.
  const res = await fetch(new URL("/api/api-keys", env.BACKEND_API_URL), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: session.user.dbId,
      name: body?.name,
      expires_in_days: body?.expires_in_days ?? null,
    }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
