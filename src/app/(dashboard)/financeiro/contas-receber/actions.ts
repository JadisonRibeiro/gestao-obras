"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { contaReceberSchema } from "@/lib/validations/conta-receber";
import {
  createContaReceber,
  updateContaReceber,
  deleteContaReceber,
  markContaReceberReceived,
} from "@/services/conta-receber.service";

export interface ContaReceberActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/financeiro/contas-receber";

export async function createContaReceberAction(
  values: unknown
): Promise<ContaReceberActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contaReceberSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createContaReceber(user.tenantId, parsed.data);
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

export async function updateContaReceberAction(
  id: string,
  values: unknown
): Promise<ContaReceberActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contaReceberSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateContaReceber(user.tenantId, id, parsed.data);
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

export async function deleteContaReceberAction(
  id: string
): Promise<ContaReceberActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteContaReceber(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error: "Conta vinculada a outros registros. Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir a conta." };
  }

  revalidatePath(BASE);
  return {};
}

export async function markContaReceberReceivedAction(
  id: string
): Promise<ContaReceberActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const ok = await markContaReceberReceived(user.tenantId, id);
  if (!ok) return { error: "Conta não encontrada." };

  revalidatePath(BASE);
  return {};
}
