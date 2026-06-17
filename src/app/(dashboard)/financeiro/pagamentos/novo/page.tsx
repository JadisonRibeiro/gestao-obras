import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { PagamentoForm } from "@/components/financeiro/pagamento-form";

export const metadata: Metadata = {
  title: "Registrar pagamento",
};

export default async function NovoPagamentoPage() {
  const user = await requireUser();
  const obrasFull = await listObras(user.tenantId);
  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Registrar pagamento"
        description="Registre uma entrada ou saída financeira."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de registrar pagamentos.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <PagamentoForm obras={obras} />
      )}
    </div>
  );
}
