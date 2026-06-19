import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { MovimentacaoForm } from "@/components/estoque/movimentacao-form";

export const metadata: Metadata = {
  title: "Nova movimentação",
};

export default async function NovaMovimentacaoPage() {
  const user = await requireUser();
  const [obrasFull, fornecedoresFull] = await Promise.all([
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
  ]);

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({ id: f.id, name: f.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nova movimentação"
        description="Registre uma entrada ou saída de material."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de movimentar estoque.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <MovimentacaoForm obras={obras} fornecedores={fornecedores} />
      )}
    </div>
  );
}
