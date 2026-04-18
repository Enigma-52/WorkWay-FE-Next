import type { ReactNode } from "react";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <img src="/logo.png" alt="WorkWay" className="w-8 h-8" />
          <span className="text-base font-semibold">WorkWay</span>
        </div>
        {children}
      </div>
    </div>
  );
}
