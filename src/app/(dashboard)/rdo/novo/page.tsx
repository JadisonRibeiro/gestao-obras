import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { RdoForm } from "@/components/rdo/rdo-form";

export const metadata: Metadata = {
  title: "Novo RDO",
};

export default async function NovoRdoPage() {
  const user = await requireUser();
  const obrasFull = await listObras(user.tenantId);
  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Novo RDO"
        description="Registre o diário de uma obra."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de registrar RDOs.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <RdoForm obras={obras} />
      )}
    </div>
  );
}
