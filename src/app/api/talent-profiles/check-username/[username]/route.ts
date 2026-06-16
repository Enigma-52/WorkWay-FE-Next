import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { username } = await params;
  const res = await fetch(
    new URL(`/api/talent-profiles/check-username/${username}?user_id=${session.user.dbId}`, env.BACKEND_API_URL)
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
