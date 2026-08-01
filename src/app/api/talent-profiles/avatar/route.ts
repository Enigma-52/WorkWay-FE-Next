import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.dbId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const newForm = new FormData();
  const file = formData.get("avatar");
  if (file) newForm.append("avatar", file);
  newForm.append("user_id", session.user.dbId);

  const res = await fetch(new URL("/api/talent-profiles/avatar", env.BACKEND_API_URL), {
    method: "POST",
    body: newForm,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
