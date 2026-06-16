import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Plus, MapPin } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { getObraUsage } from "@/services/plano.service";
import { OBRA_TYPE_LABELS } from "@/lib/validations/obra";
import { formatBRL } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ObraType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Obras",
};

export default async function ObrasPage() {
  const user = await requireUser();
  const [obras, usage] = await Promise.all([
    listObras(user.tenantId),
    getObraUsage(user.tenantId),
  ]);

  const limitLabel =
    usage.max == null
      ? `${usage.current} ativa(s) — ilimitado`
      : `${usage.current} de ${usage.max} obras ativas`;

  return (
    <>
      <PageHeader
        title="Obras"
        description={limitLabel}
        actions={
          <Button asChild>
            <Link href="/obras/nova">
              <Plus className="h-4 w-4" />
              Nova obra
            </Link>
          </Button>
        }
      />

      {obras.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">Nenhuma obra cadastrada</p>
              <p className="text-sm text-muted-foreground">
                Comece cadastrando a primeira obra da sua construtora.
              </p>
            </div>
            <Button asChild>
              <Link href="/obras/nova">
                <Plus className="h-4 w-4" />
                Cadastrar obra
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {obras.map((obra) => {
            const address = obra.address as {
              city?: string;
              state?: string;
            } | null;
            return (
              <Card key={obra.id}>
                <CardContent className="space-y-3 pt-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{obra.name}</p>
                      {obra.code && (
                        <p className="text-xs text-muted-foreground">
                          {obra.code}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={obra.status} />
                  </div>

                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {address?.city
                        ? `${address.city}${address.state ? `/${address.state}` : ""}`
                        : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t pt-3 text-sm">
                    <span className="text-muted-foreground">
                      {OBRA_TYPE_LABELS[obra.type as ObraType]}
                    </span>
                    <span className="font-mono font-medium">
                      {formatBRL(obra.totalBudget)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}
