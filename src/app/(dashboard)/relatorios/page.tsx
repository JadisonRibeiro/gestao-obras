import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, BarChart3 } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getRelatorioFinanceiro } from "@/services/relatorio.service";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
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
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata: Metadata = {
  title: "Relatórios",
};

export default async function RelatoriosPage() {
  const user = await requireUser();
  const rel = await getRelatorioFinanceiro(user.tenantId);

  const cards = [
    {
      label: "A receber (aberto)",
      value: formatBRL(rel.aReceber),
      icon: TrendingUp,
      tint: "bg-success/10 text-success",
    },
    {
      label: "A pagar (aberto)",
      value: formatBRL(rel.aPagar),
      icon: TrendingDown,
      tint: "bg-destructive/10 text-destructive",
    },
    {
      label: "Saldo realizado",
      value: formatBRL(rel.saldoRealizado),
      icon: Wallet,
      tint: "bg-primary/10 text-primary",
    },
    {
      label: "Resultado projetado",
      value: formatBRL(rel.resultadoProjetado),
      icon: BarChart3,
      tint: "bg-secondary/10 text-secondary",
    },
  ];

  return (
    <>
      <PageHeader
        title="Relatórios"
        description="Visão gerencial financeira da construtora."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {c.label}
                  </span>
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                      c.tint
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 font-mono text-xl font-bold tracking-tight">
                  {c.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="border-b px-5 py-4">
            <h2 className="font-heading font-semibold">Resultado por obra</h2>
          </div>
          {rel.obras.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              Cadastre obras e lançamentos para ver o relatório por obra.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obra</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Orçado
                  </TableHead>
                  <TableHead className="text-right">A receber</TableHead>
                  <TableHead className="text-right">A pagar</TableHead>
                  <TableHead className="hidden text-right md:table-cell">
                    Resultado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rel.obras.map((o) => {
                  const resultado = o.aReceber - o.aPagar;
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/obras/${o.id}`}
                          className="hover:text-primary hover:underline"
                        >
                          {o.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={o.status} />
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-sm sm:table-cell">
                        {formatBRL(o.orcado)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-success">
                        {formatBRL(o.aReceber)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm text-destructive">
                        {formatBRL(o.aPagar)}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "hidden text-right font-mono text-sm font-medium md:table-cell",
                          resultado >= 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        {formatBRL(resultado)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
