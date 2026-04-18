"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "seeker" | "hirer";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState(session?.user?.displayName ?? session?.user?.name ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!role || !name.trim() || !session?.user?.email) return;
    setLoading(true);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, role, display_name: name.trim() }),
    });

    await update({ roles: [role], displayName: name.trim() });
    router.push(`/dashboard/${role}`);
  }

  if (step === 1) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">What brings you to WorkWay?</h1>
        <p className="text-muted-foreground mb-10">Pick your path — you can always change this later.</p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => { setRole("seeker"); setStep(2); }}
            className={cn(
              "p-8 rounded-2xl border-2 text-left transition-all duration-200",
              "bg-card hover:border-primary hover:shadow-[0_0_40px_hsl(82_100%_55%/0.15)]",
              role === "seeker" ? "border-primary" : "border-border"
            )}
          >
            <Search className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-1">I'm job hunting</h2>
            <p className="text-sm text-muted-foreground">Find your next role, track applications, build your profile.</p>
          </button>

          <button
            onClick={() => { setRole("hirer"); setStep(2); }}
            className={cn(
              "p-8 rounded-2xl border-2 text-left transition-all duration-200",
              "bg-card hover:border-primary hover:shadow-[0_0_40px_hsl(82_100%_55%/0.15)]",
              role === "hirer" ? "border-primary" : "border-border"
            )}
          >
            <Briefcase className="w-8 h-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-1">I'm hiring</h2>
            <p className="text-sm text-muted-foreground">Post jobs, find candidates, grow your team.</p>
          </button>
        </div>
      </div>
    );
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

      <button
        onClick={() => setStep(1)}
        className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        ← Change role
      </button>
    </div>
  );
}
