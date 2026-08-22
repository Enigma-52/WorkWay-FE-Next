"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  code: string;
  label?: string;
};

export default function CodeBlock({ code, label }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (insecure origin, denied permission).
      // The code is selectable either way, so there's nothing to recover.
    }
  };

  return (
    <div className="relative rounded-xl border border-border bg-secondary/40 overflow-hidden">
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">{label}</span>
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        style={label ? { top: "2.75rem" } : undefined}
      >
        {copied ? <Check className="h-3.5 w-3.5 text-primary" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto p-4 pr-24 text-xs leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}
