"use client";

import { useState } from "react";
import { Flag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { track } from "@/lib/analytics";

const REASONS: { value: string; label: string }[] = [
  { value: "position_filled", label: "Position already filled" },
  { value: "link_broken", label: "Apply link is broken" },
  { value: "spam", label: "Spam or fake listing" },
  { value: "other", label: "Other" },
];

export default function ReportJobButton({ jobSlug }: { jobSlug: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit() {
    if (!reason) return;
    setSubmitting(true);
    try {
      await fetch("/api/job/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: jobSlug, reason }),
      });
      track("Job Reported", { job_slug: jobSlug, reason });
      setDone(true);
    } catch {
      setDone(true); // fail quiet — reporting is best-effort, not worth a retry UI
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset a beat after close so the closing animation doesn't flash new content.
      setTimeout(() => {
        setReason(null);
        setDone(false);
      }, 200);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
      >
        <Flag className="h-4 w-4" />
        Report this job
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-sm">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-foreground">Thanks for the report</p>
              <p className="text-xs text-muted-foreground">
                We&apos;ll take a look and remove it if it&apos;s no longer valid.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Report this job</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 py-2">
                {REASONS.map((r) => (
                  <label
                    key={r.value}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      reason === r.value
                        ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report-reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={() => setReason(r.value)}
                      className="accent-primary"
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              <DialogFooter>
                <Button
                  size="sm"
                  className="w-full"
                  disabled={!reason || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting..." : "Submit report"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
