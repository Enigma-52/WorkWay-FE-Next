"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export default function Pagination({
  currentPage,
  totalPages,
  buildHref,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {currentPage === 1 ? (
        <button
          disabled
          aria-label="Previous page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-foreground opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      ) : (
        <Link
          href={buildHref(currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-all hover:border-primary/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Link
            key={index}
            href={buildHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono text-sm transition-all ${
              currentPage === page
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-secondary text-foreground hover:border-primary/50"
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-2 text-muted-foreground">
            {page}
          </span>
        ),
      )}

      {currentPage === totalPages ? (
        <button
          disabled
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-foreground opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <Link
          href={buildHref(currentPage + 1)}
          rel="next"
          aria-label="Next page"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-foreground transition-all hover:border-primary/50"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

