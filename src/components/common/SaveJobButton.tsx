"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import AuthModal from "./AuthModal";
import { cn } from "@/lib/utils";
import { useJobStatus } from "@/contexts/JobStatusContext";

interface SaveJobButtonProps {
  jobSlug: string;
  jobTitle: string;
  company: string;
  companyLogoUrl?: string | null;
  location?: string | null;
  employmentType?: string | null;
  jobUrl?: string | null;
  className?: string;
  size?: "sm" | "md";
}

export default function SaveJobButton({
  jobSlug,
  jobTitle,
  company,
  companyLogoUrl,
  location,
  employmentType,
  jobUrl,
  className,
  size = "sm",
}: SaveJobButtonProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { savedSlugs, addSaved, removeSaved } = useJobStatus();
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const saved = savedSlugs.has(jobSlug);

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user?.dbId) {
      setAuthOpen(true);
      return;
    }

    if (saved) {
      removeSaved(jobSlug);
      fetch(`/api/saved-jobs/${jobSlug}`, { method: "DELETE" }).catch(() => addSaved(jobSlug));
      return;
    }

    setLoading(true);
    addSaved(jobSlug); // optimistic
    try {
      await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_slug: jobSlug,
          job_title: jobTitle,
          company,
          company_logo_url: companyLogoUrl ?? null,
          location: location ?? null,
          employment_type: employmentType ?? null,
          job_url: jobUrl ?? null,
        }),
      });
    } catch {
      removeSaved(jobSlug); // revert on failure
    } finally {
      setLoading(false);
    }
  }

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        aria-label={saved ? "Unsave job" : "Save job"}
        className={cn(
          "inline-flex items-center justify-center rounded-md border transition-colors disabled:opacity-50",
          size === "sm"
            ? "h-9 w-9 border-border bg-secondary hover:border-primary hover:text-primary"
            : "h-9 w-9 border-border bg-secondary hover:border-primary hover:text-primary",
          saved && "border-primary text-primary bg-primary/10",
          className
        )}
      >
        <Bookmark className={cn(iconSize, saved && "fill-current")} />
      </button>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl={pathname} />
    </>
  );
}
