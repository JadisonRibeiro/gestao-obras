import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Plus, TriangleAlert } from "lucide-react";

import { requireUser } from "@/lib/auth";
import {
  listContasPagar,
  getContasPagarSummary,
} from "@/services/conta-pagar.service";
import { effectiveStatus } from "@/lib/finance";
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
import { MarkPaidButton } from "@/components/financeiro/mark-paid-button";
import {
  deleteContaPagarAction,
  markContaPagarPaidAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Contas a Pagar",
};

export default async function ContasPagarPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [contas, summary] = await Promise.all([
    listContasPagar(user.tenantId, { search }),
    getContasPagarSummary(user.tenantId),
  ]);

  return (
    <>
      <PageHeader
        title="Contas a Pagar"
        description="Despesas e compromissos financeiros das obras."
        actions={
          <Button asChild>
            <Link href="/financeiro/contas-pagar/nova">
              <Plus className="h-4 w-4" />
              Nova conta
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Em aberto
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {formatBRL(summary.emAberto)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <TriangleAlert className="h-4 w-4 text-destructive" />
              Vencido
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-destructive">
              {formatBRL(summary.vencido)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Contas abertas
            </p>
            <p className="mt-2 font-mono text-2xl font-bold">
              {summary.quantidade}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar por descrição..." />
      </div>

      {contas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wallet className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhuma conta encontrada" : "Nenhuma conta a pagar"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Lance a primeira despesa de uma obra."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/financeiro/contas-pagar/nova">
                  <Plus className="h-4 w-4" />
                  Nova conta
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
                  <TableHead className="hidden lg:table-cell">
                    Fornecedor
                  </TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {contas.map((conta) => {
                  const podeMarcar =
                    conta.status !== "PAGO" && conta.status !== "CANCELADO";
                  return (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium">
                        {conta.description}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {conta.obra.name}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {conta.fornecedor?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(conta.dueDate)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatBRL(conta.amount)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={effectiveStatus(conta)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {podeMarcar && (
                            <MarkPaidButton
                              action={markContaPagarPaidAction.bind(
                                null,
                                conta.id
                              )}
                            />
                          )}
                          <RowActions
                            editHref={`/financeiro/contas-pagar/${conta.id}/editar`}
                            onDelete={deleteContaPagarAction.bind(null, conta.id)}
                            deleteTitle="Excluir conta"
                            deleteDescription={`Excluir "${conta.description}"? Esta ação não pode ser desfeita.`}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
}
