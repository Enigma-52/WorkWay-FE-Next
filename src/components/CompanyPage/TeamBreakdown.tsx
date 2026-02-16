"use client";
import { type JobListing, getDomainStats } from "@/data/companyData";

interface TeamBreakdownProps {
  jobs: JobListing[];
}

export function TeamBreakdown({ jobs }: TeamBreakdownProps) {
  const stats = getDomainStats(jobs);
  const maxCount = Math.max(...stats.map((s) => s.count));

  return (
    <section className="border border-border rounded-xl gradient-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold">Team Breakdown</h2>
        <p className="text-sm text-muted-foreground">Open roles by domain</p>
      </div>

      <div className="divide-y divide-border">
        {stats.map((stat) => (
          <div
            key={stat.domain}
            className="px-6 py-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
          >
            <span className="flex-1 font-medium">{stat.domain}</span>

            {/* Progress bar */}
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(stat.count / maxCount) * 100}%` }}
              />
            </div>

            <span className="w-8 text-right font-mono text-sm text-primary">
              {stat.count}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
