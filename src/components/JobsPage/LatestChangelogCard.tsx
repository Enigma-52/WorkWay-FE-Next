"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import changelogData from "@/content/changelog.json";

export default function LatestChangelogCard() {
  const latest = changelogData.entries[0];
  if (!latest) return null;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Latest Update</h3>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground">
          {latest.date}
        </span>
      </div>

      <div className="mb-3">
        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary mb-2">
          {latest.tag}
        </span>
        <p className="text-sm font-medium text-foreground">{latest.title}</p>
      </div>

      <ul className="mb-3 space-y-1.5">
        {latest.highlights.slice(0, 2).map((h, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
          >
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
            <span>{h.replace(/\*\*/g, "")}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/changelog"
        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        View all updates
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
