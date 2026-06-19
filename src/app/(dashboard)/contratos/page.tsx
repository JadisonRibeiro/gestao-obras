import type { Metadata } from "next";
import Link from "next/link";
import { FileSignature, Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import {
  listContratos,
  getContratosSummary,
} from "@/services/contrato.service";
import { CONTRATO_TYPE_LABELS } from "@/lib/validations/contrato";
import { formatBRL, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { RowActions } from "@/components/shared/row-actions";
import { StatusBadge } from "@/components/shared/status-badge";
import { deleteContratoAction } from "./actions";

export const metadata: Metadata = {
  title: "Contratos",
};

export default async function ContratosPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [contratos, summary] = await Promise.all([
    listContratos(user.tenantId, { search }),
    getContratosSummary(user.tenantId),
  ]);

  return (
    <>
      <PageHeader
        title="Contratos"
        description="Contratos com fornecedores, clientes e subempreiteiros."
        actions={
          <Button asChild>
            <Link href="/contratos/novo">
              <Plus className="h-4 w-4" />
              Novo contrato
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Contratos ativos
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {summary.ativos}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Valor em contratos ativos
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {formatBRL(summary.valorAtivos)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar por descrição ou número..." />
      </div>

      {contratos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileSignature className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search
                  ? "Nenhum contrato encontrado"
                  : "Nenhum contrato cadastrado"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Cadastre o primeiro contrato de uma obra."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/contratos/novo">
                  <Plus className="h-4 w-4" />
                  Novo contrato
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="hidden md:table-cell">Obra</TableHead>
                  <TableHead className="hidden lg:table-cell">Parte</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="hidden sm:table-cell">Início</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {contratos.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell className="font-medium">
                      {contrato.description}
                      <p className="text-xs text-muted-foreground">
                        {CONTRATO_TYPE_LABELS[contrato.type]}
                      </p>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {contrato.obra.name}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {contrato.fornecedor?.name ??
                        contrato.cliente?.name ??
                        "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatBRL(contrato.amount)}
                    </TableCell>
                    <TableCell className="hidden text-sm sm:table-cell">
                      {formatDate(contrato.startDate)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contrato.status} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/contratos/${contrato.id}/editar`}
                        onDelete={deleteContratoAction.bind(null, contrato.id)}
                        deleteTitle="Excluir contrato"
                        deleteDescription={`Excluir "${contrato.description}"? Esta ação não pode ser desfeita.`}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
