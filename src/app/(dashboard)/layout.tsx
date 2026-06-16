import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const { tenant } = user;

  const trialLabel =
    tenant.subscriptionStatus === "TRIAL" && tenant.trialEndsAt
      ? `Trial • ${Math.max(
          0,
          Math.ceil((tenant.trialEndsAt.getTime() - Date.now()) / 86_400_000)
        )} dias restantes`
      : null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar planName={tenant.plan.name} trialLabel={trialLabel} />
      <div className="flex min-h-screen flex-col md:pl-64">
        <Header
          tenantName={user.tenant.name}
          user={{
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl ?? undefined,
          }}
        />
        <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
