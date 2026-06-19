import type { Metadata } from "next";
import Link from "next/link";

import { requireUser } from "@/lib/auth";
import { listObras } from "@/services/obra.service";
import { listFornecedores } from "@/services/fornecedor.service";
import { listClientes } from "@/services/cliente.service";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ContratoForm } from "@/components/contratos/contrato-form";

export const metadata: Metadata = {
  title: "Novo contrato",
};

export default async function NovoContratoPage() {
  const user = await requireUser();
  const [obrasFull, fornecedoresFull, clientesFull] = await Promise.all([
    listObras(user.tenantId),
    listFornecedores(user.tenantId),
    listClientes(user.tenantId),
  ]);

  const obras = obrasFull.map((o) => ({ id: o.id, name: o.name }));
  const fornecedores = fornecedoresFull.map((f) => ({ id: f.id, name: f.name }));
  const clientes = clientesFull.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Novo contrato"
        description="Cadastre um contrato vinculado a uma obra."
      />
      {obras.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Cadastre uma obra antes de criar contratos.{" "}
            <Link href="/obras/nova" className="text-primary hover:underline">
              Criar obra
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ContratoForm
          obras={obras}
          fornecedores={fornecedores}
          clientes={clientes}
        />
      )}
    </div>
  );
}
