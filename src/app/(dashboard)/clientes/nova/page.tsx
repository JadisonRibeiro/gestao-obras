import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { ClienteForm } from "@/components/clientes/cliente-form";

export const metadata: Metadata = {
  title: "Novo cliente",
};

export default async function NovoClientePage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Novo cliente" description="Cadastre um novo cliente." />
      <ClienteForm />
    </div>
  );
}
