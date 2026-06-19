import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listUsers } from "@/services/user.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/shared/users-table";

export const metadata: Metadata = {
  title: "Usuários",
};

export default async function UsuariosPage() {
  const user = await requireUser();
  const users = await listUsers(user.tenantId);

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/configuracoes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Configurações
      </Link>

      <PageHeader
        title="Usuários"
        description="Equipe com acesso ao sistema."
      />

      <Card>
        <CardContent className="p-0">
          <UsersTable users={users} />
        </CardContent>
      </Card>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          O convite de novos usuários e a alteração de papéis serão habilitados
          nos planos pagos.
        </p>
      </div>
    </div>
  );
}
