import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET() {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(new URL(`/api/user/me?user_id=${session.user.dbId}`, env.BACKEND_API_URL), {
    cache: "no-store",
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // The verified session email/identity always wins — never the client's,
  // even if the request body claims a different one. This route previously
  // trusted a client-supplied `email` directly against the backend with no
  // session check at all, letting anyone modify any account's role by
  // guessing their email.
  const res = await fetch(new URL("/api/user/me", env.BACKEND_API_URL), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, email: session.user.email }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
