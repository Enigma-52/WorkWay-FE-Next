import { auth } from "@/lib/auth";
import { env } from "@/lib/config/env";

// One round-trip for everything the app shell needs right after hydration for
// a signed-in visitor. Previously PlanSyncGate and JobStatusProvider each hit
// their own BFF route (/api/user/me, /api/saved-jobs, /api/applications) —
// three browser→edge→origin round-trips, each running auth() and each ~300 ms
// from outside the droplet. The fan-out now happens here, BFF→backend on the
// same Docker network, and the response carries only what the client reads:
// the user row for plan/role sync plus the saved/applied job slugs.
export const dynamic = "force-dynamic";

const INTERNAL_HEADERS = { "x-internal-api-secret": process.env.INTERNAL_API_SECRET || "" };

async function backendJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(new URL(path, env.BACKEND_API_URL), {
      cache: "no-store",
      headers: INTERNAL_HEADERS,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await auth();
  const userId = session?.user?.dbId;
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const [me, saved, applications] = await Promise.all([
    backendJson<Record<string, unknown>>(`/api/user/me?user_id=${userId}`),
    backendJson<{ saved_jobs?: { job_slug: string }[] }>(`/api/saved-jobs?user_id=${userId}`),
    backendJson<{ applications?: { job_slug: string }[] }>(`/api/applications?user_id=${userId}`),
  ]);

  return Response.json(
    {
      me,
      saved_slugs: (saved?.saved_jobs ?? []).map((j) => j.job_slug),
      applied_slugs: (applications?.applications ?? []).map((a) => a.job_slug),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
