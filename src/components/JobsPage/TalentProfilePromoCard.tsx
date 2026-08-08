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
        Companies are looking for talent like yours. Will they find you?
      </p>
      {session ? (
        <Button size="sm" className="w-full" asChild>
          <Link href="/dashboard/seeker/talent-profile">Create your profile</Link>
        </Button>
      ) : (
        <>
          <Button size="sm" className="w-full" onClick={() => setAuthOpen(true)}>
            Create your profile
          </Button>
          <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl="/dashboard/seeker/talent-profile" />
        </>
      )}
      <p className="mt-2 text-center text-xs text-muted-foreground">It&apos;s free.</p>
    </div>
  );
}
