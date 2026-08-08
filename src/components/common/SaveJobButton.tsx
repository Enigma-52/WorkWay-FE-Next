"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import AuthModal from "./AuthModal";
import { cn } from "@/lib/utils";
import { useJobStatus } from "@/contexts/JobStatusContext";
import { track } from "@/lib/analytics";

interface SaveJobButtonProps {
  jobSlug: string;
  jobTitle: string;
  company: string;
  companyLogoUrl?: string | null;
  location?: string | null;
  employmentType?: string | null;
  jobUrl?: string | null;
  className?: string;
  /** `lg` matches the height of an xl Button, for sitting beside "Apply Now". */
  size?: "sm" | "md" | "lg";
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
  const router = useRouter();
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
      try {
        const res = await fetch(`/api/saved-jobs/${jobSlug}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        toast("Removed from saved jobs", { description: jobTitle });
        track("Job Unsaved", { job_slug: jobSlug, job_title: jobTitle, company });
      } catch {
        addSaved(jobSlug);
        toast.error("Could not remove that job", {
          description: "Check your connection and try again.",
        });
      }
      return;
    }

    setLoading(true);
    addSaved(jobSlug); // optimistic
    try {
      const res = await fetch("/api/saved-jobs", {
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
      if (!res.ok) throw new Error();
      toast.success("Saved", {
        description: `${jobTitle} at ${company}`,
        action: { label: "View saved", onClick: () => router.push("/dashboard/seeker/saved-jobs") },
      });
      track("Job Saved", { job_slug: jobSlug, job_title: jobTitle, company, location: location ?? null });
    } catch {
      removeSaved(jobSlug); // revert on failure
      toast.error("Could not save that job", {
        description: "Check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const sizeClasses = {
    sm: "h-9 w-9 rounded-md",
    md: "h-10 w-10 rounded-md",
    lg: "h-14 w-14 rounded-xl",
  }[size];

  const iconSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <>
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        aria-label={saved ? "Unsave job" : "Save job"}
        className={cn(
          "inline-flex shrink-0 items-center justify-center border border-border bg-secondary transition-colors hover:border-primary hover:text-primary disabled:opacity-50",
          sizeClasses,
          saved && "border-primary text-primary bg-primary/10",
          className
        )}
      >
        <Bookmark className={cn(iconSize, saved && "fill-current")} />
      </button>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} callbackUrl={pathname} source="save_job" />
    </>
  );
}
