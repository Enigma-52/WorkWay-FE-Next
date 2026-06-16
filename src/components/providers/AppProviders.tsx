"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import GuestPromoModal from "@/components/common/GuestPromoModal";
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
        <Toaster richColors position="bottom-right" />
      </JobStatusProvider>
    </SessionProvider>
  );
}
