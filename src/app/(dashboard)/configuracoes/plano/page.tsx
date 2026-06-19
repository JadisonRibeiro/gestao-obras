import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { getObraUsage } from "@/services/plano.service";
import { countUsers } from "@/services/user.service";
import { listPlans } from "@/services/config.service";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Plano e assinatura",
};

function UsageBar({
  label,
  current,
  max,
}: {
  label: string;
  current: number;
  max: number | null;
}) {
  const pct = max == null ? 0 : Math.min(100, (current / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current}
          {max == null ? " (ilimitado)" : ` / ${max}`}
        </span>
      </div>
      {max != null && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full",
              pct >= 100 ? "bg-destructive" : "bg-primary"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default async function PlanoPage() {
  const user = await requireUser();
  const [obraUsage, usersCount, plans] = await Promise.all([
    getObraUsage(user.tenantId),
    countUsers(user.tenantId),
    listPlans(),
  ]);

  const currentSlug = user.tenant.plan.slug;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/configuracoes"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Configurações
      </Link>

      <PageHeader
        title="Plano e assinatura"
        description={`Plano atual: ${user.tenant.plan.name}`}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Uso do plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <UsageBar
            label="Obras ativas"
            current={obraUsage.current}
            max={obraUsage.max}
          />
          <UsageBar
            label="Usuários"
            current={usersCount}
            max={user.tenant.plan.maxUsers}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const isCurrent = plan.slug === currentSlug;
          const features = Array.isArray(plan.features)
            ? (plan.features as string[])
            : [];
          return (
            <Card
              key={plan.id}
              className={cn(isCurrent && "border-primary ring-1 ring-primary")}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{plan.name}</CardTitle>
                  {isCurrent && <Badge>Atual</Badge>}
                </div>
                <p className="font-mono text-2xl font-bold">
                  {formatBRL(plan.priceMonthly)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /mês
                  </span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrent ? "outline" : "default"}
                  disabled
                >
                  {isCurrent ? "Plano atual" : "Em breve"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        A troca de plano e o pagamento serão habilitados com a integração de
        cobrança.
      </p>
    </div>
  );
}
