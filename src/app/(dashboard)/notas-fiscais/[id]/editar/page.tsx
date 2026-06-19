import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getNotaFiscal } from "@/services/nota-fiscal.service";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { PageHeader } from "@/components/shared/page-header";
import { NotaFiscalForm } from "@/components/notas/nota-fiscal-form";

export const metadata: Metadata = {
  title: "Editar nota fiscal",
};

export default async function EditarNotaFiscalPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [nota, obrasFull, fornecedoresFull] = await Promise.all([
    getNotaFiscal(user.tenantId, params.id),
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
  ]);
  if (!nota) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({
    id: f.id,
    name: f.name,
  }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar nota fiscal" description={`NF ${nota.number}`} />
      <NotaFiscalForm
        obras={obras}
        fornecedores={fornecedores}
        notaId={nota.id}
        defaultValues={{
          obraId: nota.obraId,
          fornecedorId: nota.fornecedorId ?? "",
          number: nota.number,
          series: nota.series ?? "",
          type: nota.type,
          issueDate: nota.issueDate.toISOString().slice(0, 10),
          totalAmount: nota.totalAmount,
          taxAmount: nota.taxAmount ?? undefined,
          status: nota.status,
          notes: nota.notes ?? "",
        }}
      />
    </div>
  );
}
