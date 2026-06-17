import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Plus, Wallet } from "lucide-react";

import { requireUser } from "@/lib/auth";
import {
  listPagamentos,
  getPagamentosSummary,
} from "@/services/pagamento.service";
import { PAGAMENTO_TYPE_LABELS } from "@/lib/validations/pagamento";
import { formatBRL, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
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
import { deletePagamentoAction } from "./actions";

export const metadata: Metadata = {
  title: "Pagamentos",
};

export default async function PagamentosPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [pagamentos, summary] = await Promise.all([
    listPagamentos(user.tenantId, { search }),
    getPagamentosSummary(user.tenantId),
  ]);

  return (
    <>
      <PageHeader
        title="Pagamentos"
        description="Registro de entradas e saídas financeiras."
        actions={
          <Button asChild>
            <Link href="/financeiro/pagamentos/novo">
              <Plus className="h-4 w-4" />
              Registrar
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
              <ArrowUpRight className="h-4 w-4 text-destructive" />
              Saídas
            </p>
            <p className="mt-2 font-mono text-2xl font-bold text-destructive">
              {formatBRL(summary.saidas)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-muted-foreground">Saldo</p>
            <p
              className={cn(
                "mt-2 font-mono text-2xl font-bold",
                summary.saldo >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {formatBRL(summary.saldo)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Buscar por descrição..." />
      </div>

      {pagamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Wallet className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhum pagamento encontrado" : "Nenhum pagamento"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Registre a primeira entrada ou saída."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/financeiro/pagamentos/novo">
                  <Plus className="h-4 w-4" />
                  Registrar
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
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagamentos.map((pag) => {
                  const isEntrada = pag.type === "ENTRADA";
                  return (
                    <TableRow key={pag.id}>
                      <TableCell className="font-medium">
                        {pag.description}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {pag.obra.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant={isEntrada ? "success" : "destructive"}>
                          {PAGAMENTO_TYPE_LABELS[pag.type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden text-sm sm:table-cell">
                        {formatDate(pag.paidAt)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono text-sm font-medium",
                          isEntrada ? "text-success" : "text-destructive"
                        )}
                      >
                        {isEntrada ? "+" : "-"}
                        {formatBRL(pag.amount)}
                      </TableCell>
                      <TableCell>
                        <RowActions
                          editHref={`/financeiro/pagamentos/${pag.id}/editar`}
                          onDelete={deletePagamentoAction.bind(null, pag.id)}
                          deleteTitle="Excluir pagamento"
                          deleteDescription={`Excluir "${pag.description}"? Esta ação não pode ser desfeita.`}
                        />
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
