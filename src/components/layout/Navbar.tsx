"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  Code2,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Newspaper,
  Wrench,
  FileText,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/common/AuthModal";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/talents", label: "Talents" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
];

const EXPLORE_LINKS = [
  { href: "/domains", label: "Domains", description: "Jobs grouped by field", icon: LayoutGrid },
  { href: "/skills", label: "Skills", description: "Jobs by specific skill", icon: Code2 },
  { href: "/internships", label: "Internships", description: "Roles tagged intern-level", icon: GraduationCap },
  { href: "/senior-jobs", label: "Senior Jobs", description: "Senior, staff & lead roles", icon: TrendingUp },
  { href: "/contract-jobs", label: "Contract Jobs", description: "Fixed-term & freelance roles", icon: FileText },
  { href: "/guides", label: "Guides", description: "WorkWay vs the old way", icon: BookOpen },
  { href: "/blog", label: "Blog", description: "Job search, ATS & hiring data", icon: Newspaper },
  { href: "/tools/ats-finder", label: "ATS Finder", description: "Find any company's careers page", icon: Wrench },
];

const TRAILING_LINKS = [{ href: "/pricing", label: "Pricing" }];

const Navbar = () => {
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="" width={36} height={36} priority />
            <span className="text-base font-semibold">WorkWay</span>
          </Link>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </a>
          ))}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="group flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors outline-none"
              >
                Explore
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="start"
                sideOffset={12}
                className="z-50 w-[560px] rounded-xl border border-border bg-card p-3 shadow-lg data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
              >
                <div className="grid grid-cols-2 gap-1">
                  {EXPLORE_LINKS.map(({ href, label, description, icon: Icon }) => (
                    <DropdownMenu.Item key={href} asChild>
                      <Link
                        href={href}
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5 outline-none hover:bg-background/80 focus:bg-background/80 transition-colors"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                          <Icon className="w-4 h-4 text-primary" />
                        </span>
                        <span>
                          <span className="block text-sm font-medium">{label}</span>
                          <span className="block text-xs text-muted-foreground">{description}</span>
                        </span>
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          {TRAILING_LINKS.map(({ href, label }) => (
            <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground order-3"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((v) => !v)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* CTA */}
        {status === "loading" ? (
          <div className="h-8 w-24 rounded-md bg-muted animate-pulse" />
        ) : session ? (
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1" asChild>
              <Link href="/dashboard">
                Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button size="sm" className="gap-1" onClick={() => setAuthOpen(true)}>
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
            <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
          </>
        )}
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t bg-background px-6 py-3 flex flex-col gap-1">
          {PRIMARY_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}

          <button
            type="button"
            className="flex items-center justify-between py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileExploreOpen((v) => !v)}
            aria-expanded={mobileExploreOpen}
          >
            Explore
            <ChevronDown className={`w-4 h-4 transition-transform ${mobileExploreOpen ? "rotate-180" : ""}`} />
          </button>
          {mobileExploreOpen && (
            <div className="pl-3 flex flex-col gap-1 border-l border-border ml-1">
              {EXPLORE_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              ))}
            </div>
          )}

          {TRAILING_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
