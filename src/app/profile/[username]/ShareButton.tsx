"use client";

import { Button } from "@/components/ui/button";
import { Share2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? (
        <Check className="mr-1.5 h-4 w-4" />
      ) : (
        <Share2 className="mr-1.5 h-4 w-4" />
      )}
      {copied ? "Copied!" : "Share"}
    </Button>
  );
}
