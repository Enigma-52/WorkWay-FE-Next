import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await params;
  const res = await fetch(
    new URL(`/api/saved-jobs/${slug}?user_id=${session.user.dbId}`, env.BACKEND_API_URL),
    { method: "DELETE" }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
