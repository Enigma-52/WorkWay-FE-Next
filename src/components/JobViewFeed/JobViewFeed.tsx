"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Globe2, MapPin } from "lucide-react";

type JobViewEvent = {
  id: number;
  job_slug: string;
  job_title: string;
  company: string;
  viewer_country: string | null;
  viewer_city?: string | null;
  source_page: string;
  created_at: string;
};

type Props = {
  title?: string;
  pollIntervalMs?: number;
  limit?: number;
};


function formatTimeAgo(iso: string) {
  const created = new Date(iso).getTime();
  if (Number.isNaN(created)) return "";
  const diffMs = Date.now() - created;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `${diffH} hr${diffH > 1 ? "s" : ""} ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD} day${diffD > 1 ? "s" : ""} ago`;
}

export default function JobViewFeed({
  title = "Live job views",
  pollIntervalMs = 60000,
  limit = 20,
}: Props) {
  const [events, setEvents] = useState<JobViewEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | undefined;

    async function fetchEvents() {
      try {
        setIsLoading((prev) => (events.length === 0 ? true : prev));
        const res = await fetch(`/api/feed/job-views?limit=${limit}`);
        if (!res.ok) return;
        const payload = (await res.json()) as { events?: JobViewEvent[] };
        if (!isMounted || !payload?.events) return;
        setEvents(payload.events);
      } catch {
        // fail silently on network errors
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchEvents();
    intervalId = setInterval(fetchEvents, pollIntervalMs);

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, pollIntervalMs]);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-2 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {isLoading && (
          <span className="text-[11px] font-mono uppercase tracking-wide text-muted-foreground">
            Updating…
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Once candidates start viewing jobs, you&apos;ll see live activity here.
        </p>
      ) : (
        <ul className="space-y-2">
          {events.map((e) => {
            const locationParts: string[] = [];
            if (e.viewer_city) locationParts.push(e.viewer_city);
            if (e.viewer_country) locationParts.push(e.viewer_country);
            const location =
              locationParts.join(", ") || "Somewhere in the world";

            return (
              <li
                key={e.id}
                className="rounded-lg bg-background/80 px-3 py-2 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span className="text-muted-foreground">
                    Someone{" "}
                    <span className="text-foreground">
                      from {location}
                    </span>
                  </span>
                </div>
                <div className="mt-0.5 text-foreground">
                  <span className="text-muted-foreground">viewed </span>
                  <Link
                    href={`/job/${e.job_slug}`}
                    className="font-semibold underline underline-offset-2 hover:text-primary"
                  >
                    {e.job_title}
                  </Link>{" "}
                  <span className="text-muted-foreground">at </span>
                  <Link
                    href={`/company/${e.company.toLowerCase().replace(/ /g, '-')}`}
                    className="font-semibold underline underline-offset-2 hover:text-primary"
                  >
                    {e.company}
                  </Link>
                  .
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground/80">
                  {formatTimeAgo(e.created_at)}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

