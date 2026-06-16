import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { getObraUsage } from "@/services/plano.service";
import { OBRA_TYPE_LABELS } from "@/lib/validations/obra";
import { formatBRL } from "@/lib/format";
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
import { deleteObraAction } from "./actions";
import type { ObraType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Obras",
};

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const [obras, usage] = await Promise.all([
    listObras(user.tenantId, { search }),
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

      <div className="mb-4">
        <SearchInput placeholder="Buscar por nome ou código..." />
      </div>

      {obras.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhuma obra encontrada" : "Nenhuma obra cadastrada"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Comece cadastrando a primeira obra."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/obras/nova">
                  <Plus className="h-4 w-4" />
                  Cadastrar obra
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
                  <TableHead>Obra</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden sm:table-cell">Cidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden text-right lg:table-cell">
                    Orçado
                  </TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {obras.map((obra) => {
                  const address = obra.address as {
                    city?: string;
                    state?: string;
                  } | null;
                  return (
                    <TableRow key={obra.id}>
                      <TableCell>
                        <Link
                          href={`/obras/${obra.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {obra.name}
                        </Link>
                        {obra.code && (
                          <p className="text-xs text-muted-foreground">
                            {obra.code}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                        {OBRA_TYPE_LABELS[obra.type as ObraType]}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {address?.city
                          ? `${address.city}${address.state ? `/${address.state}` : ""}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={obra.status} />
                      </TableCell>
                      <TableCell className="hidden text-right font-mono text-sm lg:table-cell">
                        {formatBRL(obra.totalBudget)}
                      </TableCell>
                      <TableCell>
                        <RowActions
                          editHref={`/obras/${obra.id}/editar`}
                          onDelete={deleteObraAction.bind(null, obra.id)}
                          deleteTitle="Excluir obra"
                          deleteDescription={`Tem certeza que deseja excluir "${obra.name}"? Esta ação não pode ser desfeita.`}
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
