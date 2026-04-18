import { auth } from "@/lib/auth";
import Link from "next/link";
import { ArrowRight, FileText, Bookmark, Sparkles, ClipboardList } from "lucide-react";
import { env } from "@/lib/config/env";

async function fetchCount(path: string, userId: string) {
  try {
    const res = await fetch(
      new URL(`${path}?user_id=${userId}`, env.BACKEND_API_URL).toString(),
      { cache: "no-store" }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

const comingSoon = [
  { title: "AI Job Match", desc: "Get ranked job recommendations based on your profile.", icon: Sparkles },
  { title: "Resume Builder", desc: "Create a standout resume directly on WorkWay.", icon: ClipboardList },
];

export default async function SeekerOverviewPage() {
  const session = await auth();
  const name = session?.user?.displayName ?? session?.user?.name ?? "there";
  const userId = session?.user?.dbId;

  const [appCount, savedCount] = userId
    ? await Promise.all([
        fetchCount("/api/applications/summary", userId),
        fetchCount("/api/saved-jobs/summary", userId),
      ])
    : [0, 0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground text-sm">Your job search dashboard — track, apply, and get hired.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/seeker/applications"
          className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold mb-0.5">{appCount}</p>
          <p className="text-sm text-muted-foreground">Applications</p>
        </Link>

        <Link
          href="/dashboard/seeker/saved-jobs"
          className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bookmark className="w-4 h-4 text-primary" />
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-3xl font-bold mb-0.5">{savedCount}</p>
          <p className="text-sm text-muted-foreground">Saved Jobs</p>
        </Link>
      </div>

      {/* Coming soon */}
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Coming soon</p>
      <div className="grid grid-cols-2 gap-4">
        {comingSoon.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="bg-card border border-border rounded-xl p-5 relative">
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                  Soon
                </span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
