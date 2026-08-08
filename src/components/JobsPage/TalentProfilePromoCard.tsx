"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/common/AuthModal";

export default function TalentProfilePromoCard() {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card/60 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-mono text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Get discovered
        </h3>
      </div>
      <p className="mb-3 text-sm text-foreground">
        Recruiters browse WorkWay Talents every day looking for people like you. A live profile means opportunities find <span className="text-primary font-medium">you</span> — no applications needed.
      </p>
      {session ? (
        <Button size="sm" className="w-full" asChild>
          <Link href="/dashboard/seeker/talent-profile">Build my profile</Link>
        </Button>
      ) : (
        <>
          <Button size="sm" className="w-full" onClick={() => setAuthOpen(true)}>
            Build my profile
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl="/dashboard/seeker/talent-profile" />
        </>
      )}
      <p className="mt-2 text-center text-xs text-muted-foreground">Free &middot; takes 2 minutes</p>
    </div>
  );
}
