"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Building2, Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Application = {
  id: number;
  job_slug: string;
  job_title: string;
  company: string;
  company_logo_url: string | null;
  location: string | null;
  employment_type: string | null;
  status: string;
  notes: string | null;
  applied_at: string;
};

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

const statusConfig: Record<string, { className: string }> = {
  Applied:  { className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  Interview:{ className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  Offer:    { className: "bg-green-500/10 text-green-400 border-green-500/20" },
  Rejected: { className: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function InlineNotes({ app, onSave }: { app: Application; onSave: (id: number, notes: string) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(app.notes ?? "");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(app.notes ?? ""); }, [app.notes]);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);

  function save() { onSave(app.id, draft); setOpen(false); }
  function cancel() { setDraft(app.notes ?? ""); setOpen(false); }

  if (open) {
    return (
      <div className="flex flex-col gap-1.5 min-w-[180px]">
        <textarea
          ref={ref}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          placeholder="Add notes…"
          className="w-full rounded border border-primary/50 bg-secondary px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
        />
        <div className="flex items-center gap-2">
          <button onClick={save} className="flex items-center gap-1 text-xs text-green-500 hover:text-green-400">
            <Check className="w-3 h-3" /> Save
          </button>
          <button onClick={cancel} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <X className="w-3 h-3" /> Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/n flex items-center gap-1.5 min-w-[140px]">
      <span className={cn("text-xs leading-relaxed flex-1 line-clamp-2", app.notes ? "text-muted-foreground" : "text-muted-foreground/40 italic")}>
        {app.notes ?? "No notes"}
      </span>
      <button
        onClick={() => setOpen(true)}
        className="opacity-0 group-hover/n:opacity-100 shrink-0 text-muted-foreground hover:text-foreground transition-all"
        aria-label="Edit notes"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/applications")
      .then((r) => r.json())
      .then((d) => setApplications(d.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleStatusChange(id: number, status: string) {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  }

  function handleNotesSave(id: number, notes: string) {
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, notes } : a));
    fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    }).catch(() => {});
  }

  const filtered = statusFilter === "all"
    ? applications
    : applications.filter((a) => a.status === statusFilter);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">Applications</h1>
          <p className="text-muted-foreground text-sm">Track every job you've applied to.</p>
        </div>
        <div className="flex items-center gap-3">
          {applications.length > 0 && (
            <span className="text-sm text-muted-foreground">{filtered.length} of {applications.length}</span>
          )}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-secondary border-border h-8 text-xs">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 border-b border-border last:border-0 animate-pulse bg-secondary/20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-xl px-5 py-16 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            {applications.length === 0 ? "No applications yet." : "No applications match this filter."}
          </p>
          {applications.length === 0 && (
            <Link href="/jobs" className="text-sm text-primary hover:underline">Browse jobs →</Link>
          )}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[35%]">Job / Company</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[130px]">Status</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Notes</th>
                <th className="text-left px-4 py-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider w-[110px]">Applied</th>
                <th className="px-4 py-3 w-[60px]" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => {
                const cfg = statusConfig[app.status];
                return (
                  <tr
                    key={app.id}
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-secondary/20 transition-colors group",
                      i % 2 === 1 && "bg-secondary/5"
                    )}
                  >
                    {/* Job / Company */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                          {app.company_logo_url ? (
                            <img src={app.company_logo_url} alt={app.company} className="max-h-5 max-w-full object-contain" />
                          ) : (
                            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate leading-tight">{app.job_title}</p>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{app.company}{app.location ? ` · ${app.location}` : ""}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v)}>
                        <SelectTrigger className={cn("h-7 w-auto min-w-[90px] text-xs font-medium border px-2.5 rounded-full", cfg?.className ?? "")}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Notes */}
                    <td className="px-4 py-3">
                      <InlineNotes app={app} onSave={handleNotesSave} />
                    </td>

                    {/* Applied date */}
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(app.applied_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/job/${app.job_slug}`}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
