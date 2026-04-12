"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AuthModal from "@/components/common/AuthModal";

const Navbar = () => {
  const { data: session } = useSession();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="WorkWay" className="w-9 h-9" />
            <span className="text-base font-semibold">WorkWay</span>
          </Link>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <a href="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Jobs</a>
          <a href="/companies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Companies</a>
          <a href="/domains" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Domains</a>
          <a href="/skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Skills</a>
          <a href="/hireme" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create your Hire Me Profile</a>
        </nav>

        {/* CTA */}
        {session ? (
          <Button size="sm" className="gap-1" asChild>
            <Link href="/dashboard">
              Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
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
    </header>
  );
};

export default Navbar;
