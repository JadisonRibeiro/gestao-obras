import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getContaPagar } from "@/services/conta-pagar.service";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { PageHeader } from "@/components/shared/page-header";
import { ContaPagarForm } from "@/components/financeiro/conta-pagar-form";

export const metadata: Metadata = {
  title: "Editar conta a pagar",
};

export default async function EditarContaPagarPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [conta, obrasFull, fornecedoresFull] = await Promise.all([
    getContaPagar(user.tenantId, params.id),
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
  ]);
  if (!conta) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({
    id: f.id,
    name: f.name,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar conta a pagar" description={conta.description} />
      <ContaPagarForm
        obras={obras}
        fornecedores={fornecedores}
        contaId={conta.id}
        defaultValues={{
          obraId: conta.obraId,
          fornecedorId: conta.fornecedorId ?? "",
          description: conta.description,
          amount: conta.amount,
          dueDate: conta.dueDate.toISOString().slice(0, 10),
          status: conta.status,
          paymentMethod: conta.paymentMethod ?? "",
          notes: conta.notes ?? "",
        }}
      />
    </div>
  );
}
