"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser, isManagerRole } from "@/lib/auth";
import { movimentacaoSchema } from "@/lib/validations/estoque";
import {
  createMovimentacao,
  updateMovimentacao,
  deleteMovimentacao,
} from "@/services/estoque.service";

export interface MovimentacaoActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/estoque";

export async function createMovimentacaoAction(
  values: unknown
): Promise<MovimentacaoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = movimentacaoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createMovimentacao(user.tenantId, parsed.data);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar a movimentação.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateMovimentacaoAction(
  id: string,
  values: unknown
): Promise<MovimentacaoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = movimentacaoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateMovimentacao(user.tenantId, id, parsed.data);
    if (!ok) return { error: "Movimentação não encontrada." };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar a movimentação.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteMovimentacaoAction(
  id: string
): Promise<MovimentacaoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteMovimentacao(user.tenantId, id);
  } catch {
    return { error: "Não foi possível excluir a movimentação." };
  }

  revalidatePath(BASE);
  return {};
}
