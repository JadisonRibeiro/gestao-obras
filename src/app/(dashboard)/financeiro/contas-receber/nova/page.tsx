import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { listClientes } from "@/services/cliente.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ContaReceberForm } from "@/components/financeiro/conta-receber-form";

export const metadata: Metadata = {
  title: "Nova conta a receber",
};

export default async function NovaContaReceberPage() {
  const user = await requireUser();
  const [obrasFull, clientesFull] = await Promise.all([
    listObras(user.tenantId),
    listClientes(user.tenantId),
  ]);

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const clientes = clientesFull.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nova conta a receber"
        description="Lance um recebível vinculado a uma obra."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de lançar contas.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ContaReceberForm obras={obras} clientes={clientes} />
      )}
    </div>
  );
}
