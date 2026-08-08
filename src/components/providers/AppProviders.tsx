"use client";

import { Suspense, type ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import GuestPromoModal from "@/components/common/GuestPromoModal";
import AuthRedirectGate from "@/components/common/AuthRedirectGate";
import OnboardingGate from "@/components/Onboarding/OnboardingGate";
import { JobStatusProvider } from "@/contexts/JobStatusContext";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SessionProvider>
      <JobStatusProvider>
        {children}
        <GuestPromoModal />
        <Suspense fallback={null}>
          <AuthRedirectGate />
        </Suspense>
        <Suspense fallback={null}>
          <OnboardingGate />
        </Suspense>
        {/* richColors floods the toast with green/red, which fights the acid
            brand colour. Style against the app's own surface tokens instead
            and let the icon alone carry the status. */}
        <Toaster
          theme="dark"
          position="bottom-right"
          offset={80}
          toastOptions={{
            // Sonner sets its surface through its own CSS variables, which
            // outrank utility classes; inline style is what actually lands.
            style: {
              background: "hsl(220 18% 8% / 0.97)",
              border: "1px solid hsl(220 15% 18%)",
              borderRadius: "0.75rem",
              backdropFilter: "blur(8px)",
            },
            classNames: {
              toast:
                "group items-start gap-3 rounded-xl border border-border bg-card/95 p-4 text-foreground shadow-lg backdrop-blur",
              title: "text-sm font-medium leading-snug",
              description: "text-xs leading-relaxed text-muted-foreground",
              actionButton:
                "rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground",
              cancelButton:
                "rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-foreground",
              closeButton: "border-border bg-card text-muted-foreground",
              success: "[&_[data-icon]]:text-primary",
              error: "[&_[data-icon]]:text-destructive",
            },
          }}
        />
      </JobStatusProvider>
    </SessionProvider>
  );
}
