import { auth } from "@/lib/auth";

const upcomingFeatures = [
  { title: "AI Job Match", desc: "Get ranked job recommendations based on your profile." },
  { title: "Resume Builder", desc: "Create a standout resume directly on WorkWay." },
  { title: "Interview Prep", desc: "Practice with role-specific questions and tips." },
  { title: "Salary Insights", desc: "See real compensation ranges before you apply." },
];

export default async function SeekerOverviewPage() {
  const session = await auth();
  const name = session?.user?.displayName ?? session?.user?.name ?? "there";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {name} 👋</h1>
        <p className="text-muted-foreground text-sm">Your job search dashboard — track, apply, and get hired.</p>
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
