import Link from "next/link";
import { ArrowRight, GraduationCap, TrendingUp, Wrench, Newspaper } from "lucide-react";

// Reused across domain/skill/location category pages to pass internal link
// equity to newer page types (blog, tools, internships, senior-jobs) that
// otherwise are only reachable from the navbar/footer — the same "index
// pages are linked, detail pages aren't" gap already diagnosed for the
// original domain/skill/location taxonomy.
const LINKS = [
  { href: "/internships", label: "Internship roles", icon: GraduationCap },
  { href: "/senior-jobs", label: "Senior-level roles", icon: TrendingUp },
  { href: "/tools/ats-finder", label: "Find any company's ATS", icon: Wrench },
  { href: "/blog", label: "Job search & hiring blog", icon: Newspaper },
];

type Props = {
  exclude?: string;
};

export default function ExploreMoreLinks({ exclude }: Props = {}) {
  const links = exclude ? LINKS.filter((l) => l.href !== exclude) : LINKS;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors"
        >
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium leading-snug">{label}</span>
          <span className="inline-flex items-center gap-1 text-xs font-mono text-primary mt-auto">
            Explore
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      ))}
    </div>
  );
}
