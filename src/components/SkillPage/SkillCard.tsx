"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SkillCardProps {
  skill: string;
  slug: string;
  jobCount: number;
  index: number;
}

const SkillCard = ({
  skill,
  slug,
  jobCount,
}: SkillCardProps) => {
  return (
    <div>
      <Link href={`/skill/${slug}`} className="group block">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_40px_hsl(82_100%_55%/0.15)]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative z-10">

            <h3 className="mb-1 text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
              All {skill} Jobs
            </h3>

            <p className="mb-4 font-mono text-sm text-muted-foreground">
              {jobCount.toLocaleString()} openings
            </p>

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
              <span>Explore jobs</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SkillCard;
