import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { FornecedorForm } from "@/components/fornecedores/fornecedor-form";

export const metadata: Metadata = {
  title: "Novo fornecedor",
};

export default async function NovoFornecedorPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Novo fornecedor"
        description="Cadastre um novo fornecedor."
      />
      <FornecedorForm />
    </div>
  );
}
