import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listFornecedores } from "@/services/fornecedor.service";
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
import { deleteFornecedorAction } from "./actions";

export const metadata: Metadata = {
  title: "Fornecedores",
};

export default async function FornecedoresPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const fornecedores = await listFornecedores(user.tenantId, search);

  return (
    <>
      <PageHeader
        title="Fornecedores"
        description="Fornecedores e prestadores da sua construtora."
        actions={
          <Button asChild>
            <Link href="/fornecedores/novo">
              <Plus className="h-4 w-4" />
              Novo fornecedor
            </Link>
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Buscar por nome, CNPJ ou categoria..." />
      </div>

      {fornecedores.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search
                  ? "Nenhum fornecedor encontrado"
                  : "Nenhum fornecedor ainda"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Cadastre seu primeiro fornecedor."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/fornecedores/novo">
                  <Plus className="h-4 w-4" />
                  Novo fornecedor
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
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">CNPJ</TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Categoria
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">Contato</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fornecedores.map((fornecedor) => (
                  <TableRow key={fornecedor.id}>
                    <TableCell className="font-medium">
                      {fornecedor.name}
                    </TableCell>
                    <TableCell className="hidden font-mono text-sm text-muted-foreground md:table-cell">
                      {fornecedor.cnpj || "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {fornecedor.category || "—"}
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {fornecedor.email || fornecedor.phone || "—"}
                    </TableCell>
                    <TableCell>
                      <RowActions
                        editHref={`/fornecedores/${fornecedor.id}/editar`}
                        onDelete={deleteFornecedorAction.bind(
                          null,
                          fornecedor.id
                        )}
                        deleteTitle="Excluir fornecedor"
                        deleteDescription={`Tem certeza que deseja excluir "${fornecedor.name}"? Esta ação não pode ser desfeita.`}
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
