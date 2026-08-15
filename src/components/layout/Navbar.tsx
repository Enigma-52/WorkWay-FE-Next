"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "@/components/common/AuthModal";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/talents", label: "Talents" },
  { href: "/jobs", label: "Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/domains", label: "Domains" },
  { href: "/skills", label: "Skills" },
  { href: "/pricing", label: "Pricing" },
];

const Navbar = () => {
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          {NAV_LINKS.map(({ href, label }) => (
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
          {NAV_LINKS.map(({ href, label }) => (
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
