import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const newForm = new FormData();
  const file = formData.get("resume");
  if (file) newForm.append("resume", file);
  newForm.append("user_id", session.user.dbId);

  const res = await fetch(new URL("/api/talent-profiles/resume", env.BACKEND_API_URL), {
    method: "POST",
    body: newForm,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(
    new URL(`/api/talent-profiles/resume?user_id=${session.user.dbId}`, env.BACKEND_API_URL),
    { method: "DELETE" }
  );
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
