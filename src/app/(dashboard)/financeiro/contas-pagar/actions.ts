"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { contaPagarSchema } from "@/lib/validations/conta-pagar";
import {
  createContaPagar,
  updateContaPagar,
  deleteContaPagar,
  markContaPagarPaid,
} from "@/services/conta-pagar.service";

export interface ContaPagarActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/financeiro/contas-pagar";

export async function createContaPagarAction(
  values: unknown
): Promise<ContaPagarActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contaPagarSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createContaPagar(user.tenantId, parsed.data);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível criar a conta.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateContaPagarAction(
  id: string,
  values: unknown
): Promise<ContaPagarActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contaPagarSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateContaPagar(user.tenantId, id, parsed.data);
    if (!ok) return { error: "Conta não encontrada." };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar a conta.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteContaPagarAction(
  id: string
): Promise<ContaPagarActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteContaPagar(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return { error: "Conta vinculada a outros registros. Não é possível excluir." };
    }
    return { error: "Não foi possível excluir a conta." };
  }

  revalidatePath(BASE);
  return {};
}

export async function markContaPagarPaidAction(
  id: string
): Promise<ContaPagarActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const ok = await markContaPagarPaid(user.tenantId, id);
  if (!ok) return { error: "Conta não encontrada." };

  revalidatePath(BASE);
  return {};
}
