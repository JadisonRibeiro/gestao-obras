import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, Plus, Users } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listRdos } from "@/services/rdo.service";
import { WEATHER_LABELS } from "@/lib/validations/rdo";
import { formatDate } from "@/lib/format";
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
import { deleteRdoAction } from "./actions";

export const metadata: Metadata = {
  title: "RDO",
};

export default async function RdoPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const rdos = await listRdos(user.tenantId, { search });

  return (
    <>
      <PageHeader
        title="RDO — Registro Diário de Obra"
        description="Acompanhe o dia a dia das obras."
        actions={
          <Button asChild>
            <Link href="/rdo/novo">
              <Plus className="h-4 w-4" />
              Novo RDO
            </Link>
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Buscar por atividade..." />
      </div>

      {rdos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ClipboardList className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhum RDO encontrado" : "Nenhum RDO registrado"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Registre o primeiro diário de obra."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/rdo/novo">
                  <Plus className="h-4 w-4" />
                  Novo RDO
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
                  <TableHead>Data</TableHead>
                  <TableHead className="hidden md:table-cell">Obra</TableHead>
                  <TableHead className="hidden lg:table-cell">Clima</TableHead>
                  <TableHead>Equipe</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Atividades
                  </TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {rdos.map((rdo) => (
                  <TableRow key={rdo.id}>
                    <TableCell className="font-medium">
                      {formatDate(rdo.date)}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                      {rdo.obra.name}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {WEATHER_LABELS[rdo.weather]}
                    </TableCell>
                    <TableCell className="text-sm">
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3.5 w-3.5" />
                        {rdo.workers}
                      </span>
                    </TableCell>
                    <TableCell className="hidden max-w-xs truncate text-sm text-muted-foreground sm:table-cell">
                      {rdo.activities}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/rdo/${rdo.id}/editar`}
                        onDelete={deleteRdoAction.bind(null, rdo.id)}
                        deleteTitle="Excluir RDO"
                        deleteDescription={`Excluir o RDO de ${formatDate(rdo.date)}? Esta ação não pode ser desfeita.`}
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
