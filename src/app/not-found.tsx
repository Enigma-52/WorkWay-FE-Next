import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-7xl font-semibold tracking-tight">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          This page does not exist.
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

