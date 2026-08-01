import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const res = await fetch(new URL(`/api/applications/${id}`, env.BACKEND_API_URL), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, user_id: session.user.dbId }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
