import type { Metadata } from "next";
import Link from "next/link";
import { Package, Plus, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { requireUser } from "@/lib/auth";
import {
  listMovimentacoes,
  getEstoqueSummary,
} from "@/services/estoque.service";
import { MOVIMENTACAO_TYPE_LABELS } from "@/lib/validations/estoque";
import { formatBRL, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { deleteMovimentacaoAction } from "./actions";
import type { MovimentacaoType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Estoque",
};

const TYPE_VARIANT: Record<
  MovimentacaoType,
  "success" | "warning" | "destructive" | "outline"
> = {
  ENTRADA: "success",
  SAIDA: "warning",
  TRANSFERENCIA: "outline",
  PERDA: "destructive",
};

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [movimentacoes, summary] = await Promise.all([
    listMovimentacoes(user.tenantId, { search }),
    getEstoqueSummary(user.tenantId),
  ]);

  return (
    <>
      <PageHeader
        title="Estoque"
        description="Movimentações de materiais por obra."
        actions={
          <Button asChild>
            <Link href="/estoque/nova">
              <Plus className="h-4 w-4" />
              Nova movimentação
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <ArrowDownLeft className="h-4 w-4 text-success" />
              Entradas
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-success">
              {formatBRL(summary.entradas)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-warning" />
              Saídas / perdas
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {formatBRL(summary.saidas)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Movimentações
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {summary.movimentacoes}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar por material..." />
      </div>

      {movimentacoes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search
                  ? "Nenhuma movimentação encontrada"
                  : "Nenhuma movimentação"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Registre a primeira entrada ou saída de material."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/estoque/nova">
                  <Plus className="h-4 w-4" />
                  Nova movimentação
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
                  <TableHead>Material</TableHead>
                  <TableHead className="hidden md:table-cell">Obra</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Total
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="font-medium">{mov.material}</TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {mov.obra.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={TYPE_VARIANT[mov.type]}>
                        {MOVIMENTACAO_TYPE_LABELS[mov.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {mov.quantity} {mov.unit}
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-sm lg:table-cell">
                      {mov.total != null ? formatBRL(mov.total) : "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm sm:table-cell">
                      {formatDate(mov.date)}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/estoque/${mov.id}/editar`}
                        onDelete={deleteMovimentacaoAction.bind(null, mov.id)}
                        deleteTitle="Excluir movimentação"
                        deleteDescription={`Excluir a movimentação de "${mov.material}"? Esta ação não pode ser desfeita.`}
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
