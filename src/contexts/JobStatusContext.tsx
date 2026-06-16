"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSession } from "next-auth/react";

type JobStatusContextValue = {
  savedSlugs: Set<string>;
  appliedSlugs: Set<string>;
  addSaved: (slug: string) => void;
  removeSaved: (slug: string) => void;
  addApplied: (slug: string) => void;
  ready: boolean; // true once the initial fetch is done (or user not logged in)
};

const JobStatusContext = createContext<JobStatusContextValue>({
  savedSlugs: new Set(),
  appliedSlugs: new Set(),
  addSaved: () => {},
  removeSaved: () => {},
  addApplied: () => {},
  ready: false,
});

export function useJobStatus() {
  return useContext(JobStatusContext);
}

export function JobStatusProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());
  const [appliedSlugs, setAppliedSlugs] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.dbId) {
      setReady(true);
      return;
    }

    // Fetch both in parallel — only slugs matter, full data is in the dashboard
    Promise.all([
      fetch("/api/saved-jobs").then((r) => r.json()).catch(() => ({ saved_jobs: [] })),
      fetch("/api/applications").then((r) => r.json()).catch(() => ({ applications: [] })),
    ]).then(([savedData, appsData]) => {
      setSavedSlugs(new Set((savedData.saved_jobs ?? []).map((j: any) => j.job_slug as string)));
      setAppliedSlugs(new Set((appsData.applications ?? []).map((a: any) => a.job_slug as string)));
    }).catch(() => {}).finally(() => setReady(true));
  }, [session?.user?.dbId, status]);

  const addSaved = useCallback((slug: string) => {
    setSavedSlugs((prev) => new Set(prev).add(slug));
  }, []);

  const removeSaved = useCallback((slug: string) => {
    setSavedSlugs((prev) => { const s = new Set(prev); s.delete(slug); return s; });
  }, []);

  const addApplied = useCallback((slug: string) => {
    setAppliedSlugs((prev) => new Set(prev).add(slug));
  }, []);

  return (
    <JobStatusContext.Provider value={{ savedSlugs, appliedSlugs, addSaved, removeSaved, addApplied, ready }}>
      {children}
    </JobStatusContext.Provider>
  );
}
