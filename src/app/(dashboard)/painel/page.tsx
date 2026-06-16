import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Layers,
  Wallet,
  CheckCircle2,
  Plus,
  MapPin,
  ArrowRight,
} from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { formatBRL } from "@/lib/format";
import { OBRA_TYPE_LABELS } from "@/lib/validations/obra";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ObraType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Painel",
};

const INACTIVE = ["CONCLUIDA", "CANCELADA"];

export default async function PainelPage() {
  const user = await requireUser();
  const obras = await listObras(user.tenantId);

  const ativas = obras.filter((o) => !INACTIVE.includes(o.status)).length;
  const concluidas = obras.filter((o) => o.status === "CONCLUIDA").length;
  const orcadoTotal = obras.reduce((s, o) => s + (o.totalBudget ?? 0), 0);

  const metrics = [
    {
      label: "Obras ativas",
      value: String(ativas),
      icon: Building2,
      tint: "bg-primary/10 text-primary",
    },
    {
      label: "Total de obras",
      value: String(obras.length),
      icon: Layers,
      tint: "bg-slate-100 text-slate-600",
    },
    {
      label: "Orçado (total)",
      value: formatBRL(orcadoTotal),
      icon: Wallet,
      tint: "bg-success/10 text-success",
    },
    {
      label: "Concluídas",
      value: String(concluidas),
      icon: CheckCircle2,
      tint: "bg-secondary/10 text-secondary",
    },
  ];

  const firstName = user.name.split(/\s+/)[0];
  const recentes = obras.slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Olá, ${firstName} 👋`}
        description={`Resumo de ${user.tenant.name}.`}
        actions={
          <Button asChild>
            <Link href="/obras/nova">
              <Plus className="h-4 w-4" />
              Nova obra
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {m.label}
                  </span>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.tint}`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 font-mono text-2xl font-bold tracking-tight">
                  {m.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-heading font-semibold">Obras recentes</h2>
            <Link
              href="/obras"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Ver todas
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentes.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-5 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <p className="font-medium">Nenhuma obra ainda</p>
                <p className="text-sm text-muted-foreground">
                  Cadastre sua primeira obra para começar.
                </p>
              </div>
              <Button asChild size="sm">
                <Link href="/obras/nova">
                  <Plus className="h-4 w-4" />
                  Cadastrar obra
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="divide-y">
              {recentes.map((obra) => {
                const address = obra.address as {
                  city?: string;
                  state?: string;
                } | null;
                return (
                  <li
                    key={obra.id}
                    className="flex items-center justify-between gap-3 px-5 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {obra.name}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {address?.city
                            ? `${address.city}${address.state ? `/${address.state}` : ""}`
                            : OBRA_TYPE_LABELS[obra.type as ObraType]}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={obra.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
