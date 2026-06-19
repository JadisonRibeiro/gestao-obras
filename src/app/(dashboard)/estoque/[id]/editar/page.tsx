import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getMovimentacao } from "@/services/estoque.service";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { PageHeader } from "@/components/shared/page-header";
import { MovimentacaoForm } from "@/components/estoque/movimentacao-form";

export const metadata: Metadata = {
  title: "Editar movimentação",
};

export default async function EditarMovimentacaoPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [mov, obrasFull, fornecedoresFull] = await Promise.all([
    getMovimentacao(user.tenantId, params.id),
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
  ]);
  if (!mov) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({ id: f.id, name: f.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar movimentação" description={mov.material} />
      <MovimentacaoForm
        obras={obras}
        fornecedores={fornecedores}
        movimentacaoId={mov.id}
        defaultValues={{
          obraId: mov.obraId,
          fornecedorId: mov.fornecedorId ?? "",
          material: mov.material,
          unit: mov.unit,
          quantity: mov.quantity,
          unitPrice: mov.unitPrice ?? undefined,
          type: mov.type,
          date: mov.date.toISOString().slice(0, 10),
          notes: mov.notes ?? "",
        }}
      />
    </div>
  );
}
