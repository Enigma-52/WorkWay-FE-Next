"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Users, User, Plus } from "lucide-react";
import type { TalentProfile, TalentSearchResponse } from "@/types/talent";
import AuthModal from "@/components/common/AuthModal";

export default function RecentTalentsCard() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [profiles, setProfiles] = useState<TalentProfile[] | null>(null);

  useEffect(() => {
    fetch("/api/talent-profiles/search?sort=newest&limit=5")
      .then((r) => r.json())
      .then((d: TalentSearchResponse) => setProfiles(Array.isArray(d.profiles) ? d.profiles : []))
      .catch(() => setProfiles([]));
  }, []);

  if (profiles && profiles.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Recently joined
        </h3>
      </div>

      {!profiles ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-secondary" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 rounded bg-secondary" />
                <div className="h-2.5 w-1/2 rounded bg-secondary" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              href={`/p/${profile.username}`}
              className="group flex items-center gap-3 -mx-1 rounded-lg px-1 py-1 transition-colors hover:bg-secondary/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name ?? profile.username}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {profile.display_name || profile.username}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {profile.professional_title || "Open to opportunities"}
                </p>
              </div>
            </Link>
          ))}

          {!session && (
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="group flex w-full items-center gap-3 -mx-1 rounded-lg border border-dashed border-border px-1 py-1.5 text-left transition-colors hover:border-primary/40 hover:bg-secondary/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
                <Plus className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  You could be here
                </p>
                <p className="truncate text-xs text-muted-foreground">Create your free talent profile</p>
              </div>
            </button>
          )}
        </div>
      )}

      <Link
        href="/talents"
        className="mt-3 block text-center text-xs text-primary hover:underline"
      >
        Browse all talent →
      </Link>

      {!session && (
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl="/dashboard/seeker/talent-profile" />
      )}
    </div>
  );
}
