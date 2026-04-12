"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
