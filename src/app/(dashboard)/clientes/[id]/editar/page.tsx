import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getCliente } from "@/services/cliente.service";
import { PageHeader } from "@/components/shared/page-header";
import { ClienteForm } from "@/components/clientes/cliente-form";

export const metadata: Metadata = {
  title: "Editar cliente",
};

export default async function EditarClientePage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const cliente = await getCliente(user.tenantId, params.id);
  if (!cliente) notFound();

  const address = cliente.address as {
    city?: string;
    state?: string;
  } | null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar cliente" description={cliente.name} />
      <ClienteForm
        clienteId={cliente.id}
        defaultValues={{
          name: cliente.name,
          cpfCnpj: cliente.cpfCnpj ?? "",
          email: cliente.email ?? "",
          phone: cliente.phone ?? "",
          city: address?.city ?? "",
          state: address?.state ?? "",
          notes: cliente.notes ?? "",
        }}
      />
    </div>
  );
}
