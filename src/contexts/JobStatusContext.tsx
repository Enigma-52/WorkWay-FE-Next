"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { fetchBootstrap } from "@/lib/bootstrap";

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

    // Only slugs matter here (full data lives in the dashboard); they ride on
    // the shared bootstrap request alongside the user row PlanSyncGate needs.
    fetchBootstrap(session.user.dbId)
      .then((boot) => {
        if (!boot) return;
        setSavedSlugs(new Set(boot.saved_slugs));
        setAppliedSlugs(new Set(boot.applied_slugs));
      })
      .finally(() => setReady(true));
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
