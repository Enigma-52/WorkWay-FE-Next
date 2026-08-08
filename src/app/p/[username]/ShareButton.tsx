"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { track } from "@/lib/analytics";

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied", { description: url });
      track("Talent Profile Shared", { url });
    } catch {
      // Clipboard access is refused on insecure origins and in some browsers.
      toast.error("Could not copy the link", {
        description: "Copy it from the address bar instead.",
      });
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={copy}>
      {copied ? (
        <Check className="mr-1.5 h-4 w-4" />
      ) : (
        <Share2 className="mr-1.5 h-4 w-4" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
