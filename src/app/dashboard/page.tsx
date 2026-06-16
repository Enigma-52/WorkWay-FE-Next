import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/");

  const role = session.user.roles?.[0];
  if (!role) redirect("/onboarding");

  redirect(`/dashboard/${role}`);
}
