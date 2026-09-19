"use client";

export type Bootstrap = {
  me: { plan_key?: string; roles?: string[] } | null;
  saved_slugs: string[];
  applied_slugs: string[];
};

// Several providers mount together and all need /api/me/bootstrap as soon as
// the session resolves. Memoise the in-flight promise per user so they share
// one request instead of racing three identical ones.
let inflight: { userId: string; promise: Promise<Bootstrap | null> } | null = null;

export function fetchBootstrap(userId: string): Promise<Bootstrap | null> {
  if (inflight && inflight.userId === userId) return inflight.promise;
  const promise = fetch("/api/me/bootstrap")
    .then((r) => (r.ok ? (r.json() as Promise<Bootstrap>) : null))
    .catch(() => null);
  inflight = { userId, promise };
  // Let a later mount (e.g. after a save/apply elsewhere) refetch rather than
  // reuse stale data forever — the memo only spans the concurrent burst.
  promise.finally(() => {
    setTimeout(() => {
      if (inflight?.promise === promise) inflight = null;
    }, 5000);
  });
  return promise;
}
