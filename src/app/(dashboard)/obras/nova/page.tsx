import type { Metadata } from "next";

import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { ObraForm } from "@/components/obras/obra-form";

export const metadata: Metadata = {
  title: "Nova obra",
};

export default async function NovaObraPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nova obra"
        description="Cadastre os dados gerais da obra."
      />
      <ObraForm />
    </div>
  );
}
