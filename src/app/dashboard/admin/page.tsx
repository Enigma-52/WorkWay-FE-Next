import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminPanelClient from "@/components/Admin/AdminPanelClient";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.roles?.includes("admin")) {
    redirect("/dashboard");
  }

  return <AdminPanelClient />;
}
