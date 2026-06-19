import type { Metadata } from "next";
import { Info } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listUsers } from "@/services/user.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { UsersTable } from "@/components/shared/users-table";

export const metadata: Metadata = {
  title: "Equipe",
};

export default async function EquipePage() {
  const user = await requireUser();
  const users = await listUsers(user.tenantId);

  return (
    <>
      <PageHeader
        title="Equipe"
        description="Usuários com acesso ao sistema na sua construtora."
      />

      <Card>
        <CardContent className="p-0">
          <UsersTable users={users} />
        </CardContent>
      </Card>

      <div className="mt-4 flex items-start gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          O convite de novos usuários por e-mail e a gestão de papéis chegam com
          os planos pagos (Pro e Enterprise).
        </p>
      </div>
    </>
  );
}
