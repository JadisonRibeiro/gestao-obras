import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getObra } from "@/services/obra.service";
import { PageHeader } from "@/components/shared/page-header";
import { ObraForm } from "@/components/obras/obra-form";

export const metadata: Metadata = {
  title: "Editar obra",
};

export default async function EditarObraPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const obra = await getObra(user.tenantId, params.id);
  if (!obra) notFound();

  const address = obra.address as {
    street?: string;
    number?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={`/obras/${obra.id}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>
      <PageHeader title="Editar obra" description={obra.name} />
      <ObraForm
        obraId={obra.id}
        defaultValues={{
          name: obra.name,
          code: obra.code ?? "",
          type: obra.type,
          status: obra.status,
          description: obra.description ?? "",
          street: address?.street ?? "",
          number: address?.number ?? "",
          city: address?.city ?? "",
          state: address?.state ?? "",
          zip: address?.zip ?? "",
          area: obra.area ?? undefined,
          totalBudget: obra.totalBudget ?? undefined,
        }}
      />
    </div>
  );
}
