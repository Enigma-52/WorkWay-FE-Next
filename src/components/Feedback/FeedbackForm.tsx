"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackCategory =
  | "bug"
  | "feature"
  | "data-issue"
  | "ux"
  | "other";

type FeedbackRole = "candidate" | "hiring" | "other" | "unknown";

type FeedbackFormState = {
  name: string;
  email: string;
  role: FeedbackRole;
  category: FeedbackCategory;
  rating: string;
  message: string;
};

const initialState: FeedbackFormState = {
  name: "",
  email: "",
  role: "unknown",
  category: "other",
  rating: "",
  message: "",
};

export function FeedbackForm() {
  const [form, setForm] = useState<FeedbackFormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function update<K extends keyof FeedbackFormState>(
    key: K,
    value: FeedbackFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSubmitting(true);
    setStatus("idle");
    setStatusMessage("");

    try {
      const payload = {
        name: form.name || null,
        email: form.email || null,
        role: form.role || null,
        category: form.category || null,
        rating: form.rating ? Number(form.rating) : null,
        message: form.message || null,
      };

      const endpoint =
        process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "/api/feedback";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Failed with status ${res.status}`);
      }

      setStatus("success");
      setStatusMessage("Thanks for the feedback — it really helps.");
      setForm(initialState);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setStatusMessage(
        "Something went wrong while sending your feedback. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 space-y-6 rounded-xl border border-border bg-card/80 p-6 shadow-sm"
    >
      {/* Name + Email */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Optional"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            placeholder="Optional, for follow-up"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Role + Category + Rating */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Role */}
        <div className="space-y-2">
          <label className="text-sm font-medium">You are</label>

          <select
            value={form.role}
            onChange={(e) =>
              update("role", e.target.value as FeedbackRole)
            }
            className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="unknown">Select</option>
            <option value="candidate">Looking for roles</option>
            <option value="hiring">Hiring / recruiter</option>
            <option value="other">Something else</option>
          </select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>

          <select
            value={form.category}
            onChange={(e) =>
              update("category", e.target.value as FeedbackCategory)
            }
            className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature request</option>
            <option value="data-issue">Data issue</option>
            <option value="ux">UX / usability</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Overall experience</label>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => update("rating", String(value))}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border border-border text-xs font-medium text-muted-foreground transition",
                  form.rating === String(value) &&
                    "border-primary bg-primary/10 text-primary"
                )}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="message">
          What's on your mind?
        </label>

        <textarea
          id="message"
          required
          rows={5}
          placeholder="Tell us what's working well, what feels confusing, or what you'd like to see next."
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <p className="text-xs text-muted-foreground">
          Please avoid sharing sensitive personal data.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
          size="lg"
        >
          {submitting ? "Sending..." : "Send feedback"}
        </Button>

        {status !== "idle" && (
          <p
            className={cn(
              "text-xs",
              status === "success"
                ? "text-emerald-500"
                : "text-destructive"
            )}
          >
            {statusMessage}
          </p>
        )}
      </div>
    </form>
  );
}