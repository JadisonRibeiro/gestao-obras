import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getContaReceber } from "@/services/conta-receber.service";
import { listObras } from "@/services/obra.service";
import { listClientes } from "@/services/cliente.service";
import { PageHeader } from "@/components/shared/page-header";
import { ContaReceberForm } from "@/components/financeiro/conta-receber-form";

export const metadata: Metadata = {
  title: "Editar conta a receber",
};

export default async function EditarContaReceberPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [conta, obrasFull, clientesFull] = await Promise.all([
    getContaReceber(user.tenantId, params.id),
    listObras(user.tenantId),
    listClientes(user.tenantId),
  ]);
  if (!conta) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const clientes = clientesFull.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Editar conta a receber"
        description={conta.description}
      />
      <ContaReceberForm
        obras={obras}
        clientes={clientes}
        contaId={conta.id}
        defaultValues={{
          obraId: conta.obraId,
          clienteId: conta.clienteId ?? "",
          description: conta.description,
          amount: conta.amount,
          dueDate: conta.dueDate.toISOString().slice(0, 10),
          status: conta.status,
          notes: conta.notes ?? "",
        }}
      />
    </div>
  );
}
