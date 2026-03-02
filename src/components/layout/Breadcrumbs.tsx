import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-4 text-xs text-muted-foreground sm:text-sm"
    >
      <ol className="flex flex-wrap items-center gap-1 sm:gap-1.5">
        {items.map((item, index) => {
          const isLast = index === lastIndex;

          return (
            <li key={`${item.name}-${index}`} className="flex items-center">
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <span className="mx-1 text-muted-foreground/70">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

