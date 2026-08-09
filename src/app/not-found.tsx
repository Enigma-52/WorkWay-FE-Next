import type { Metadata } from "next";
import Link from "next/link";

// Without its own metadata, this boundary inherited the root layout's
// brand title/robots (index, follow) while Next separately injected its
// own noindex for the 404 status — two conflicting robots tags on every
// 404 page. Declaring both explicitly here replaces both with one.
export const metadata: Metadata = {
  title: "Page Not Found — WorkWay",
  description: "The page you're looking for doesn't exist or may have been removed.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-7xl font-semibold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Even our crawlers couldn&apos;t find this one — the job board is
          probably still open, but this exact page isn&apos;t.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Go to Home
          </Link>
          <Link
            href="/jobs"
            className="rounded-md border border-border px-5 py-2.5 text-sm"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}

