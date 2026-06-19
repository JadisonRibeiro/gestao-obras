import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { NotaFiscalForm } from "@/components/notas/nota-fiscal-form";

export const metadata: Metadata = {
  title: "Lançar nota fiscal",
};

export default async function NovaNotaFiscalPage() {
  const user = await requireUser();
  const [obrasFull, fornecedoresFull] = await Promise.all([
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
  ]);

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({
    id: f.id,
    name: f.name,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Lançar nota fiscal"
        description="Registre uma nota vinculada a uma obra."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de lançar notas.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <NotaFiscalForm obras={obras} fornecedores={fornecedores} />
      )}
    </div>
  );
}
