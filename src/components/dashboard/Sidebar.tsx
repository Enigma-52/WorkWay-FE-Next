"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  Building2,
  UserCircle,
  PlusSquare,
  Users,
  BarChart2,
  LogOut,
} from "lucide-react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  comingSoon?: boolean;
};

const seekerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/seeker", icon: LayoutDashboard },
  { label: "Applications", href: "/dashboard/seeker/applications", icon: FileText },
  { label: "Saved Jobs", href: "/dashboard/seeker/saved-jobs", icon: Bookmark },
  { label: "Companies", href: "/dashboard/seeker/companies", icon: Building2 },
  { label: "Hire Me Profile", icon: UserCircle, comingSoon: true },
];

const hirerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/hirer", icon: LayoutDashboard },
  { label: "Post a Job", icon: PlusSquare, comingSoon: true },
  { label: "Candidates", icon: Users, comingSoon: true },
  { label: "Analytics", icon: BarChart2, comingSoon: true },
];

export default function Sidebar({ role }: { role: "seeker" | "hirer" }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const nav = role === "seeker" ? seekerNav : hirerNav;

  return (
    <aside className="w-60 shrink-0 h-screen sticky top-0 flex flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="WorkWay" className="w-8 h-8" />
          <span className="font-semibold text-sm">WorkWay</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;

          if (item.comingSoon) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground/50 cursor-not-allowed select-none"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="text-sm flex-1">{item.label}</span>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border-l-2 border-primary pl-[10px]"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          {session?.user?.image ? (
            <img src={session.user.image} alt="avatar" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {(session?.user?.displayName ?? session?.user?.name ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">
              {session?.user?.displayName ?? session?.user?.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
