import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import type { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session) redirect("/");

  const role = session.user.roles?.[0] as "seeker" | "hirer" | undefined;
  if (!role) redirect("/onboarding");

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar role={role} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
