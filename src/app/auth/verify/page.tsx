"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const called = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token || called.current) return;
    called.current = true;

    signIn("magic-link", { token, callbackUrl: "/dashboard", redirect: true }).catch(() => {
      setError(true);
    });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-2">
        {error ? (
          <>
            <p className="text-destructive font-medium">Invalid or expired link.</p>
            <p className="text-sm text-muted-foreground">
              <a href="/" className="underline hover:text-foreground">
                Return home
              </a>
            </p>
          </>
        ) : (
          <p className="text-muted-foreground text-sm">Signing you in…</p>
        )}
      </div>
    </div>
  );
}
