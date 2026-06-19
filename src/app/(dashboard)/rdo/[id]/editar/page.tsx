import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getRdo } from "@/services/rdo.service";
import { listObras } from "@/services/obra.service";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { RdoForm } from "@/components/rdo/rdo-form";

export const metadata: Metadata = {
  title: "Editar RDO",
};

export default async function EditarRdoPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await requireUser();
  const [rdo, obrasFull] = await Promise.all([
    getRdo(user.tenantId, params.id),
    listObras(user.tenantId),
  ]);
  if (!rdo) notFound();

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Editar RDO" description={formatDate(rdo.date)} />
      <RdoForm
        obras={obras}
        rdoId={rdo.id}
        defaultValues={{
          obraId: rdo.obraId,
          date: rdo.date.toISOString().slice(0, 10),
          weather: rdo.weather,
          temperature: rdo.temperature ?? undefined,
          workers: rdo.workers,
          activities: rdo.activities,
          occurrences: rdo.occurrences ?? "",
        }}
      />
    </div>
  );
}
