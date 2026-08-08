"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/common/AuthModal";

type ProfileState = "loading" | "none" | "published" | "offline";

export default function TalentProfilePromoCard() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [profileState, setProfileState] = useState<ProfileState>("loading");
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setProfileState("none");
      return;
    }
    fetch("/api/talent-profiles")
      .then((r) => r.json())
      .then((d) => {
        if (!d.profile) {
          setProfileState("none");
        } else {
          setProfileState(d.profile.status === "published" ? "published" : "offline");
          setUsername(d.profile.username ?? null);
        }
      })
      .catch(() => setProfileState("none"));
  }, [session]);

  const isPublished = profileState === "published";

  const message = isPublished
    ? "Recruiters browsing WorkWay Talents can already find you. Keep it fresh so it stays worth finding."
    : profileState === "offline"
      ? "You've started a profile but it's not visible yet. Finish and publish it so recruiters can find you."
      : (
          <>
            Recruiters browse WorkWay Talents every day looking for people like you. A live profile means opportunities
            find <span className="text-primary font-medium">you</span> — no applications needed.
          </>
        );

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        {isPublished ? (
          <CheckCircle2 className="h-4 w-4 text-primary" />
        ) : (
          <Sparkles className="h-4 w-4 text-primary" />
        )}
        <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {isPublished ? "Your profile is live" : "Get discovered"}
        </h3>
      </div>

      <p className="mb-3 text-sm text-foreground">{message}</p>

      {isPublished ? (
        <Button size="sm" className="w-full" asChild>
          <Link href={`/p/${username}`}>View my profile</Link>
        </Button>
      ) : session ? (
        <Button size="sm" className="w-full" asChild>
          <Link href="/dashboard/seeker/talent-profile">
            {profileState === "offline" ? "Finish my profile" : "Build my profile"}
          </Link>
        </Button>
      ) : (
        <>
          <Button size="sm" className="w-full" onClick={() => setAuthOpen(true)}>
            Build my profile
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl="/dashboard/seeker/talent-profile" />
        </>
      )}

      <p className="mt-2 text-center text-xs text-muted-foreground">
        {isPublished ? "Live on WorkWay Talents" : "Free · takes 2 minutes"}
      </p>
    </div>
  );
}
