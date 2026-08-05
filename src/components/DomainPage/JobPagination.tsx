"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobPaginationProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function JobPagination({
  currentPage,
  totalPages,
  buildHref,
}: JobPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show max 5 page buttons
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages;

    if (currentPage <= 3) return pages.slice(0, 5);
    if (currentPage >= totalPages - 2) return pages.slice(-5);

    return pages.slice(currentPage - 3, currentPage + 2);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-center gap-2">
      {currentPage === 1 ? (
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Previous page"
          className="border-border disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          size="icon"
          aria-label="Previous page"
          className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={buildHref(currentPage - 1)} rel="prev">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
      )}

      {visiblePages[0] > 1 && (
        <>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-mono text-muted-foreground hover:text-foreground"
          >
            <Link href={buildHref(1)}>1</Link>
          </Button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <Button
          key={page}
          asChild
          variant={page === currentPage ? "default" : "ghost"}
          size="sm"
          className={`font-mono ${
            page === currentPage
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link
            href={buildHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        </Button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-muted-foreground">...</span>
          )}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="font-mono text-muted-foreground hover:text-foreground"
          >
            <Link href={buildHref(totalPages)}>{totalPages}</Link>
          </Button>
        </>
      )}

      {currentPage === totalPages ? (
        <Button
          variant="outline"
          size="icon"
          disabled
          aria-label="Next page"
          className="border-border disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          asChild
          variant="outline"
          size="icon"
          aria-label="Next page"
          className="border-border hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Link href={buildHref(currentPage + 1)} rel="next">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
