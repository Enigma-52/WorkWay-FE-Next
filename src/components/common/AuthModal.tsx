"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

type AuthModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  callbackUrl?: string;
};

export default function AuthModal({ open, onOpenChange, callbackUrl = "/dashboard" }: AuthModalProps) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailError("");
    setEmailLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/magic-link/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        }
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        setEmailError(data.message ?? "Failed to send link. Please try again.");
      } else {
        setEmailSent(true);
      }
    } catch {
      setEmailError("Something went wrong. Please try again.");
    } finally {
      setEmailLoading(false);
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) {
      setEmail("");
      setEmailSent(false);
      setEmailError("");
    }
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Welcome to WorkWay
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground pt-1">
            Sign in to track applications, save jobs, and more.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          {/* Google */}
          <Button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            variant="outline"
            className="w-full gap-3 h-11"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Magic link */}
          {emailSent ? (
            <div className="flex flex-col items-center gap-2 py-4 px-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <p className="text-sm font-medium text-center">Check your inbox</p>
              <p className="text-xs text-muted-foreground text-center">
                We sent a sign-in link to <span className="font-medium text-foreground">{email}</span>
              </p>
              <button
                onClick={() => { setEmailSent(false); setEmail(""); }}
                className="text-xs text-muted-foreground hover:text-foreground underline mt-1"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-11 pl-9 pr-4 rounded-lg border border-border bg-secondary text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
              <Button
                type="submit"
                disabled={emailLoading || !email.trim()}
                className="w-full h-11 gap-2"
              >
                {emailLoading ? "Sending..." : (
                  <>
                    Send magic link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="text-center text-xs text-muted-foreground">
            By signing in you agree to our{" "}
            <a href="/terms" className="underline hover:text-foreground">Terms</a>{" "}
            and{" "}
            <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
