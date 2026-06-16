"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { clienteSchema } from "@/lib/validations/cliente";
import {
  createCliente,
  updateCliente,
  deleteCliente,
} from "@/services/cliente.service";

export interface ClienteActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";

export async function createClienteAction(
  values: unknown
): Promise<ClienteActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = clienteSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  await createCliente(user.tenantId, parsed.data);
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateClienteAction(
  id: string,
  values: unknown
): Promise<ClienteActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = clienteSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const ok = await updateCliente(user.tenantId, id, parsed.data);
  if (!ok) return { error: "Cliente não encontrado." };

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function deleteClienteAction(
  id: string
): Promise<ClienteActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteCliente(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error:
          "Cliente vinculado a obras ou contratos. Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir o cliente." };
  }

  revalidatePath("/clientes");
  return {};
}
