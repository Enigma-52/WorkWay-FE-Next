import { auth } from "@/lib/auth";

const upcomingFeatures = [
  { title: "Job Posting", desc: "Post and manage job listings directly from your dashboard." },
  { title: "Candidate Pipeline", desc: "Review applicants, move them through stages, and collaborate." },
  { title: "Analytics", desc: "See view counts, application rates, and conversion funnels." },
  { title: "Team Seats", desc: "Invite your recruiting team and manage access." },
];

export default async function HirerOverviewPage() {
  const session = await auth();
  const name = session?.user?.displayName ?? session?.user?.name ?? "there";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground text-sm">Your hiring dashboard — post jobs, find talent, grow your team.</p>
      </div>

      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Coming soon</p>
      <div className="grid grid-cols-2 gap-4">
        {upcomingFeatures.map((f) => (
          <div key={f.title} className="bg-card border border-border rounded-xl p-5 relative">
            <div className="absolute top-3 right-3">
              <span className="text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                Soon
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
