import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getObra } from "@/services/obra.service";
import { OBRA_TYPE_LABELS } from "@/lib/validations/obra";
import { formatBRL, formatDate } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RowActions } from "@/components/shared/row-actions";
import { ObraStatusControl } from "@/components/obras/obra-status-control";
import { deleteObraAction } from "../actions";
import type { ObraType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Detalhe da obra",
};

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

export default async function ObraDetailPage({
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

  const enderecoLinha = [
    [address?.street, address?.number].filter(Boolean).join(", "),
    [address?.city, address?.state].filter(Boolean).join("/"),
    address?.zip,
  ]
    .filter(Boolean)
    .join(" — ");

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/obras"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para obras
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            {obra.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {obra.code ? `${obra.code} · ` : ""}
            {OBRA_TYPE_LABELS[obra.type as ObraType]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ObraStatusControl obraId={obra.id} status={obra.status} />
          <RowActions
            editHref={`/obras/${obra.id}/editar`}
            onDelete={deleteObraAction.bind(null, obra.id)}
            deleteTitle="Excluir obra"
            deleteDescription={`Tem certeza que deseja excluir "${obra.name}"? Esta ação não pode ser desfeita.`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Informações</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <DetailRow
              label="Tipo"
              value={OBRA_TYPE_LABELS[obra.type as ObraType]}
            />
            <DetailRow label="Área" value={obra.area ? `${obra.area} m²` : "—"} />
            <DetailRow label="Início" value={formatDate(obra.startDate)} />
            <DetailRow label="Previsão de término" value={formatDate(obra.endDate)} />
            <DetailRow label="Cadastrada em" value={formatDate(obra.createdAt)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Financeiro</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <DetailRow
              label="Orçado"
              value={
                <span className="font-mono">{formatBRL(obra.totalBudget)}</span>
              }
            />
            <DetailRow
              label="Custo realizado"
              value={
                <span className="font-mono">{formatBRL(obra.totalCost)}</span>
              }
            />
            <DetailRow label="Avanço físico" value={`${obra.progress}%`} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Endereço</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{enderecoLinha || "Endereço não informado."}</span>
            </div>
          </CardContent>
        </Card>

        {obra.description && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Descrição</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">
                {obra.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
