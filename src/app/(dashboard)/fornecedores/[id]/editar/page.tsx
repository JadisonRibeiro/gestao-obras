import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getFornecedor } from "@/services/fornecedor.service";
import { PageHeader } from "@/components/shared/page-header";
import { FornecedorForm } from "@/components/fornecedores/fornecedor-form";

export const metadata: Metadata = {
  title: "Editar fornecedor",
};

export default async function EditarFornecedorPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const fornecedor = await getFornecedor(user.tenantId, params.id);
  if (!fornecedor) notFound();

  const address = fornecedor.address as {
    city?: string;
    state?: string;
  } | null;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Editar fornecedor" description={fornecedor.name} />
      <FornecedorForm
        fornecedorId={fornecedor.id}
        defaultValues={{
          name: fornecedor.name,
          cnpj: fornecedor.cnpj ?? "",
          category: fornecedor.category ?? "",
          email: fornecedor.email ?? "",
          phone: fornecedor.phone ?? "",
          city: address?.city ?? "",
          state: address?.state ?? "",
          notes: fornecedor.notes ?? "",
        }}
      />
    </div>
  );
}
