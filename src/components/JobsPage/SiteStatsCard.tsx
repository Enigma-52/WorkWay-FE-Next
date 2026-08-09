"use client";

import { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";

type Stats = { configured: boolean; last30Days: { views: number; users: number } | null };

export default function SiteStatsCard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/analytics/public-stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats?.configured || !stats.last30Days) return null;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Last 30 days</h3>
        <span className="text-[11px] font-mono text-muted-foreground">Real visitors</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">
              {stats.last30Days.users.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">Active users</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-primary" />
          <div>
            <div className="text-sm font-semibold text-foreground">
              {stats.last30Days.views.toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">Views</div>
          </div>
        </div>
      </div>
    </div>
  );
}
