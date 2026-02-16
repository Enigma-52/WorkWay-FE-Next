import { Flame, Sparkles, Zap, Briefcase } from "lucide-react";
import Link from "next/link";
import RemoteLogo from "@/components/common/RemoteLogo";
import type { Company } from "@/types/company";

interface FeaturedSectionProps {
  title: string;
  icon: "trending" | "new" | "hiring" | "featured";
  companies: Company[];
}

const iconMap = {
  trending: Flame,
  new: Sparkles,
  hiring: Briefcase,
  featured: Zap,
};

export default function FeaturedSection({
  title,
  icon,
  companies,
}: FeaturedSectionProps) {
  const Icon = iconMap[icon];
  if (companies.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold text-foreground">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {companies.slice(0, 6).map((company) => (
          <Link
            href={`/company/${company.slug}`}
            key={company.id}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 transition-all hover:border-primary/50 hover:bg-secondary"
          >
            <RemoteLogo
              src={company.logo_url}
              alt={company.name}
              width={24}
              height={24}
              className="h-6 w-6 rounded-md object-cover"
              fallback={
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-[10px] font-semibold text-primary">
                  {company.name.slice(0, 1).toUpperCase()}
                </div>
              }
            />
            <span className="text-sm font-medium text-foreground">
              {company.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
