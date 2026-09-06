import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { authOptions } from "../auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <DashboardClient
      userName={session.user.name || "User"}
      userEmail={session.user.email || ""}
    />
  );
}