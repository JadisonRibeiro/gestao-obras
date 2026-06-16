import type { Metadata } from "next";
import Link from "next/link";
import { Contact, Plus } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { listClientes } from "@/services/cliente.service";
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
import { deleteClienteAction } from "./actions";

export const metadata: Metadata = {
  title: "Clientes",
};

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const user = await requireUser();
  const search = searchParams.q?.trim() || undefined;
  const clientes = await listClientes(user.tenantId, search);

  return (
    <>
      <PageHeader
        title="Clientes"
        description="Clientes da sua construtora."
        actions={
          <Button asChild>
            <Link href="/clientes/nova">
              <Plus className="h-4 w-4" />
              Novo cliente
            </Link>
          </Button>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Buscar por nome, CPF/CNPJ ou e-mail..." />
      </div>

      {clientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Contact className="h-6 w-6" />
            </span>
            <div>
              <p className="font-medium">
                {search ? "Nenhum cliente encontrado" : "Nenhum cliente ainda"}
              </p>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Tente outro termo de busca."
                  : "Cadastre seu primeiro cliente."}
              </p>
            </div>
            {!search && (
              <Button asChild>
                <Link href="/clientes/nova">
                  <Plus className="h-4 w-4" />
                  Novo cliente
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
                  <TableHead className="hidden md:table-cell">
                    CPF / CNPJ
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Contato</TableHead>
                  <TableHead className="hidden sm:table-cell">Cidade</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => {
                  const address = cliente.address as {
                    city?: string;
                    state?: string;
                  } | null;
                  return (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.name}
                      </TableCell>
                      <TableCell className="hidden font-mono text-sm text-muted-foreground md:table-cell">
                        {cliente.cpfCnpj || "—"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {cliente.email || cliente.phone || "—"}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {address?.city
                          ? `${address.city}${address.state ? `/${address.state}` : ""}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <RowActions
                          editHref={`/clientes/${cliente.id}/editar`}
                          onDelete={deleteClienteAction.bind(null, cliente.id)}
                          deleteTitle="Excluir cliente"
                          deleteDescription={`Tem certeza que deseja excluir "${cliente.name}"? Esta ação não pode ser desfeita.`}
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
