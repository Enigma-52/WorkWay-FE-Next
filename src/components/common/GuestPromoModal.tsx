"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, Sparkles, BarChart2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

const STORAGE_KEY = "ww_guest_promo_dismissed";

export default function GuestPromoModal() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => setVisible(true), 8000);
    return () => clearTimeout(t);
  }, [status, session]);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-2xl shadow-xl p-5">
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">Unlock your job search</span>
        </div>

        <ul className="space-y-2 mb-4">
          {[
            { icon: BarChart2, text: "Track all your applications" },
            { icon: UserCircle, text: "Create a Hire Me profile" },
            { icon: Sparkles, text: "AI-powered job search" },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
              {text}
            </li>
          ))}
        </ul>

        <Button className="w-full" size="sm" onClick={() => { setAuthOpen(true); dismiss(); }}>
          Create free account
        </Button>
        <button onClick={dismiss} className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center transition-colors">
          Maybe later
        </button>
      </div>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}
