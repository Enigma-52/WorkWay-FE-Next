"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Eye, FileText, X } from "lucide-react";

type Props = {
  url: string;
  filename?: string;
};

/**
 * Resume as a compact card: download it, or open a full-height preview overlay
 * to skim it without leaving the profile. Browsers can refuse to render
 * cross-origin PDFs inline, so the overlay always offers a new-tab fallback.
 */
export function ResumeViewer({ url, filename }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const label = filename || "Resume.pdf";

  // Escape closes the overlay; lock the page behind it while open.
  useEffect(() => {
    if (!previewOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [previewOpen]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary">
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{label}</p>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            PDF document
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-1.5 h-4 w-4" />
            Preview
          </Button>
          <a href={url} download={label}>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              Download
            </Button>
          </a>
        </div>
      </div>

      {previewOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} preview`}
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <FileText className="h-4 w-4 shrink-0 text-primary" />
              <p className="truncate text-sm font-medium text-foreground">{label}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Open in new tab
                </Button>
              </a>
              <a href={url} download={label}>
                <Button variant="outline" size="sm">
                  <Download className="mr-1.5 h-4 w-4" />
                  Download
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <object
            data={url}
            type="application/pdf"
            className="min-h-0 w-full flex-1 bg-muted"
            aria-label={label}
          >
            <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                This browser can&apos;t display the PDF inline.
              </p>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="mr-1.5 h-4 w-4" />
                  Open resume in a new tab
                </Button>
              </a>
            </div>
          </object>
        </div>
      )}
    </>
  );
}
