import type { Metadata } from "next";
import { Building2, Wallet, FileText, TrendingUp } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

export const metadata: Metadata = {
  title: "Painel",
};

const RESUMO = [
  { label: "Obras ativas", value: "3", icon: Building2 },
  { label: "A pagar (mês)", value: "R$ 48.200,00", icon: Wallet },
  { label: "A receber (mês)", value: "R$ 72.500,00", icon: TrendingUp },
  { label: "Notas pendentes", value: "5", icon: FileText },
];

export default function PainelPage() {
  return (
    <>
      <PageHeader
        title="Painel"
        description="Visão geral da sua construtora."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {RESUMO.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </CardTitle>
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-2xl font-bold tracking-tight">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Obras recentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { nome: "Residencial Aurora", status: "ativa" },
            { nome: "Galpão Logístico Sul", status: "em_andamento" },
            { nome: "Reforma Sede Centro", status: "concluida" },
          ].map((obra) => (
            <div
              key={obra.nome}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <span className="text-sm font-medium">{obra.nome}</span>
              <StatusBadge status={obra.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
