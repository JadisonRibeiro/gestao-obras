import { Sidebar } from "@/components/layout/sidebar";
import { Header, type HeaderUser } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

// TODO(fase-1): substituir pelos dados reais do tenant e do usuário
// autenticado (Supabase Auth + sessão). Placeholder enquanto o módulo
// de autenticação não está implementado.
const PLACEHOLDER_TENANT_NAME = "Construtora Exemplo Ltda";
const PLACEHOLDER_USER: HeaderUser = {
  name: "Usuário Demo",
  email: "demo@construtora.com.br",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-64">
        <Header tenantName={PLACEHOLDER_TENANT_NAME} user={PLACEHOLDER_USER} />
        <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
