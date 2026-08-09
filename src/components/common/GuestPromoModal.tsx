"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { X, Bell, BarChart2, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "ww_guest_promo_dismissed";

export default function GuestPromoModal() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (session) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => {
      setVisible(true);
      track("Guest Promo Shown");
    }, 8000);
    return () => clearTimeout(t);
  }, [status, session]);

  function dismiss(reason: "cta" | "close" | "later") {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    track("Guest Promo Dismissed", { reason });
  }

  return (
    <>
      {visible && (
        <div className="fixed bottom-6 right-6 z-50 w-[22rem] bg-card border border-border rounded-2xl shadow-xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <button
            onClick={() => dismiss("close")}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="mb-1 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">Don&apos;t apply late again</span>
          </div>
          <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
            Sign in free, then follow a company — Pro sends you an email the instant they post.
          </p>

          <ul className="space-y-2 mb-4">
            {[
              { icon: Bell, text: "Instant alerts when companies post", badge: "New" },
              { icon: BarChart2, text: "Track every application in one place" },
              { icon: UserCircle, text: "Get discovered with a Talent Profile" },
            ].map(({ icon: Icon, text, badge }) => (
              <li key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="flex-1">{text}</span>
                {badge && (
                  <span className="shrink-0 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {badge}
                  </span>
                )}
              </li>
            ))}
          </ul>

          <Button className="w-full" size="sm" onClick={() => { setAuthOpen(true); dismiss("cta"); }}>
            Get started — it&apos;s free
          </Button>
          <button onClick={() => dismiss("later")} className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center transition-colors">
            Not now
          </button>
        </div>
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} source="guest_promo" />
    </>
  );
}
