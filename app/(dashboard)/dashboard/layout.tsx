import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Connecte en tant que</p>
          <p className="font-semibold">{session.user.name} - {session.user.role}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
