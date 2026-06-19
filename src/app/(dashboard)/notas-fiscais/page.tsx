import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import {
  listNotasFiscais,
  getNotasFiscaisSummary,
} from "@/services/nota-fiscal.service";
import { NOTA_TYPE_LABELS } from "@/lib/validations/nota-fiscal";
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
import { deleteNotaFiscalAction } from "./actions";

export const metadata: Metadata = {
  title: "Notas Fiscais",
};

export default async function NotasFiscaisPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [notas, summary] = await Promise.all([
    listNotasFiscais(user.tenantId, { search }),
    getNotasFiscaisSummary(user.tenantId),
  ]);

  return (
    <>
      <PageHeader
        title="Notas Fiscais"
        description="Notas fiscais vinculadas às obras."
        actions={
          <Button asChild>
            <Link href="/notas-fiscais/nova">
              <Plus className="h-4 w-4" />
              Lançar nota
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Total lançado
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {formatBRL(summary.total)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Notas</p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {summary.quantidade}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Pendentes
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-warning">
              {summary.pendentes}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar por número..." />
      </div>

      {notas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhuma nota encontrada" : "Nenhuma nota lançada"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Lance a primeira nota fiscal de uma obra."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/notas-fiscais/nova">
                  <Plus className="h-4 w-4" />
                  Lançar nota
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
                  <TableHead>Número</TableHead>
                  <TableHead className="hidden md:table-cell">Obra</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Fornecedor
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Emissão</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {notas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell className="font-medium">
                      <span className="font-mono">{nota.number}</span>
                      <p className="text-xs text-muted-foreground">
                        {NOTA_TYPE_LABELS[nota.type]}
                      </p>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {nota.obra.name}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {nota.fornecedor?.name ?? "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm sm:table-cell">
                      {formatDate(nota.issueDate)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {formatBRL(nota.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={nota.status} />
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/notas-fiscais/${nota.id}/editar`}
                        onDelete={deleteNotaFiscalAction.bind(null, nota.id)}
                        deleteTitle="Excluir nota"
                        deleteDescription={`Excluir a nota ${nota.number}? Esta ação não pode ser desfeita.`}
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
