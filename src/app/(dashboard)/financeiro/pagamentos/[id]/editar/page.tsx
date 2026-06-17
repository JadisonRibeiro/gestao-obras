import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getPagamento } from "@/services/pagamento.service";
import { listObras } from "@/services/obra.service";
import { PageHeader } from "@/components/shared/page-header";
import { PagamentoForm } from "@/components/financeiro/pagamento-form";

export const metadata: Metadata = {
  title: "Editar pagamento",
};

export default async function EditarPagamentoPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [pagamento, obrasFull] = await Promise.all([
    getPagamento(user.tenantId, params.id),
    listObras(user.tenantId),
  ]);
  if (!pagamento) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar pagamento" description={pagamento.description} />
      <PagamentoForm
        obras={obras}
        pagamentoId={pagamento.id}
        defaultValues={{
          obraId: pagamento.obraId,
          type: pagamento.type,
          description: pagamento.description,
          amount: pagamento.amount,
          paidAt: pagamento.paidAt.toISOString().slice(0, 10),
          paymentMethod: pagamento.paymentMethod ?? "",
          notes: pagamento.notes ?? "",
        }}
      />
    </div>
  );
}
