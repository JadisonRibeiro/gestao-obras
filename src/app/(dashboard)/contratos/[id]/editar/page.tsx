import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getContrato } from "@/services/contrato.service";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { listClientes } from "@/services/cliente.service";
import { PageHeader } from "@/components/shared/page-header";
import { ContratoForm } from "@/components/contratos/contrato-form";

export const metadata: Metadata = {
  title: "Editar contrato",
};

export default async function EditarContratoPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [contrato, obrasFull, fornecedoresFull, clientesFull] =
    await Promise.all([
      getContrato(user.tenantId, params.id),
      listObras(user.tenantId),
      listFornecedores(user.tenantId),
      listClientes(user.tenantId),
    ]);
  if (!contrato) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({ id: f.id, name: f.name }));
  const clientes = clientesFull.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar contrato" description={contrato.description} />
      <ContratoForm
        obras={obras}
        fornecedores={fornecedores}
        clientes={clientes}
        contratoId={contrato.id}
        defaultValues={{
          obraId: contrato.obraId,
          type: contrato.type,
          fornecedorId: contrato.fornecedorId ?? "",
          clienteId: contrato.clienteId ?? "",
          number: contrato.number ?? "",
          description: contrato.description,
          amount: contrato.amount,
          startDate: contrato.startDate.toISOString().slice(0, 10),
          endDate: contrato.endDate
            ? contrato.endDate.toISOString().slice(0, 10)
            : "",
          status: contrato.status,
          notes: contrato.notes ?? "",
        }}
      />
    </div>
  );
}
