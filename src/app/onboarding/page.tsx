"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [name, setName] = useState(session?.user?.displayName ?? session?.user?.name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !session?.user?.email) return;
    setLoading(true);

    await fetch(`/api/user/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "seeker", display_name: name.trim() }),
    });

    await update({ roles: ["seeker"], displayName: name.trim() });
    router.push("/dashboard/seeker");
  }

  return (
    <div className="text-center max-w-sm mx-auto">
      <h1 className="text-3xl font-bold mb-2">What should we call you?</h1>
      <p className="text-muted-foreground mb-8">This is how you'll appear on WorkWay.</p>

      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="mb-4 h-12 text-center text-base"
      />

      <Button
        onClick={handleSubmit}
        disabled={!name.trim() || loading}
        className="w-full h-11"
      >
        {loading ? "Setting up your dashboard..." : "Go to my dashboard"}
      </Button>
    </div>
  );
}
