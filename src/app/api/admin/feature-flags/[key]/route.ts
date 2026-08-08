import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function PATCH(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const session = await auth();
  if (!session?.user?.dbId || !session.user.roles?.includes("admin")) {
    return Response.json({ error: "Admin access required" }, { status: 403 });
  }

  const { key } = await params;
  const body = await req.json();
  const res = await fetch(new URL(`/api/admin/feature-flags/${key}`, env.BACKEND_API_URL), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "",
    },
    body: JSON.stringify({ ...body, user_id: session.user.dbId }),
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
