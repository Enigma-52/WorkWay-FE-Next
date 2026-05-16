"use client";
import { cn } from "@/lib/utils";

interface JobBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "muted";
  className?: string;
  title?: string;
}

const JobBadge = ({
  children,
  variant = "default",
  className,
  title,
}: JobBadgeProps) => {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
        variant === "default" &&
          "border border-border bg-secondary text-secondary-foreground",
        variant === "primary" &&
          "border border-primary/30 bg-primary/10 text-primary",
        variant === "muted" && "bg-muted text-muted-foreground",
        className
      )}
    >
      {children}
    </span>
  );
};

export default JobBadge;
