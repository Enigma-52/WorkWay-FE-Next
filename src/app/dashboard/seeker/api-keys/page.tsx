"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ApiKey = {
  id: number;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  usage_count: number;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

const EXPIRY_OPTIONS = [
  { label: "Never", value: "" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "1 year", value: "365" },
];

const MCP_ENDPOINT = "https://api.workway.dev/mcp";

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isExpired(key: ApiKey) {
  return !!key.expires_at && new Date(key.expires_at).getTime() < Date.now();
}

function statusOf(key: ApiKey): { label: string; tone: "active" | "muted" | "warn" } {
  if (key.revoked_at) return { label: "Revoked", tone: "muted" };
  if (isExpired(key)) return { label: "Expired", tone: "warn" };
  return { label: "Active", tone: "active" };
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/api-keys")
      .then((r) => r.json())
      .then((d) => setKeys(d.keys ?? []))
      .catch(() => setError("Couldn't load your API keys."))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || creating) return;

    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          expires_in_days: expiry ? Number(expiry) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Couldn't create that key.");
        return;
      }
      setNewKey(data.raw_key);
      setKeys((prev) => [data.key, ...prev]);
      setName("");
      setExpiry("");
    } catch {
      setError("Couldn't reach the server. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleCopy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; the value stays selectable on screen.
    }
  }

  async function handleRevoke(id: number) {
    setConfirmId(null);
    // Optimistic: mark revoked locally, then reconcile if the request fails.
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k))
    );
    const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" }).catch(() => null);
    if (!res?.ok) {
      setError("Couldn't revoke that key. Refresh and try again.");
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked_at: null } : k)));
    }
  }

  const activeCount = keys.filter((k) => !k.revoked_at && !isExpired(k)).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-0.5">API Keys</h1>
        <p className="text-muted-foreground text-sm">
          Connect WorkWay to Claude and other MCP clients.{" "}
          <Link href="/mcp" className="text-primary hover:underline">
            How it works
          </Link>
        </p>
      </div>

      {/* One-time key reveal */}
      {newKey && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h2 className="text-sm font-semibold">Copy your key now</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is the only time it will be shown. We store just a hash, so it
                  can&apos;t be recovered later.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNewKey(null)}
              aria-label="Dismiss"
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
            <code className="flex-1 overflow-x-auto font-mono text-xs">{newKey}</code>
            <Button size="sm" variant="secondary" onClick={() => handleCopy(newKey)}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm text-primary hover:underline">
              Show MCP client config
            </summary>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs">
              <code className="font-mono">{`{
  "mcpServers": {
    "workway": {
      "url": "${MCP_ENDPOINT}",
      "headers": {
        "Authorization": "Bearer ${newKey}"
      }
    }
  }
}`}</code>
            </pre>
          </details>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 text-destructive" />
          {error}
        </div>
      )}

      {/* Create */}
      <form
        onSubmit={handleCreate}
        className="mb-8 rounded-xl border border-border bg-card p-5"
      >
        <h2 className="text-sm font-semibold">Create a key</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use a separate key per client so you can revoke one without breaking the rest.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Key name, e.g. Claude Desktop"
            maxLength={60}
            className="flex-1"
            aria-label="Key name"
          />
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            aria-label="Expires after"
            className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm sm:w-40"
          >
            {EXPIRY_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label === "Never" ? "Never expires" : `Expires in ${o.label}`}
              </option>
            ))}
          </select>
          <Button type="submit" disabled={!name.trim() || creating}>
            <Plus className="h-4 w-4" />
            {creating ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>

      {/* List */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Your keys{" "}
          {!loading && keys.length > 0 && (
            <span className="font-normal text-muted-foreground">
              ({activeCount} active)
            </span>
          )}
        </h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-secondary" />
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card/40 py-14 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <KeyRound className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-1 font-semibold">No API keys yet</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Create one above to connect WorkWay to Claude or any other MCP client.
          </p>
          <Link
            href="/mcp"
            className="inline-flex items-center gap-1 font-mono text-sm text-primary hover:underline"
          >
            Read the setup guide
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {keys.map((key) => {
            const status = statusOf(key);
            const inactive = status.tone !== "active";

            return (
              <li
                key={key.id}
                className={cn(
                  "rounded-xl border border-border bg-card p-4",
                  inactive && "opacity-60"
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{key.name}</span>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
                          status.tone === "active" && "bg-primary/10 text-primary",
                          status.tone === "warn" && "bg-destructive/10 text-destructive",
                          status.tone === "muted" && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {status.label}
                      </span>
                    </div>

                    <code className="mt-1.5 block font-mono text-xs text-muted-foreground">
                      {key.key_prefix}
                      {"•".repeat(12)}
                    </code>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Created {formatDate(key.created_at)}</span>
                      <span>
                        {key.usage_count > 0
                          ? `${key.usage_count.toLocaleString()} calls`
                          : "Never used"}
                      </span>
                      {key.last_used_at && <span>Last used {formatDate(key.last_used_at)}</span>}
                      <span>
                        {key.expires_at
                          ? `${isExpired(key) ? "Expired" : "Expires"} ${formatDate(key.expires_at)}`
                          : "No expiry"}
                      </span>
                    </div>
                  </div>

                  {!key.revoked_at &&
                    (confirmId === key.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Revoke?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRevoke(key.id)}
                        >
                          Yes, revoke
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmId(key.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Revoke
                      </Button>
                    ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
