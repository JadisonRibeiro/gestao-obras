"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser, isManagerRole } from "@/lib/auth";
import { pagamentoSchema } from "@/lib/validations/pagamento";
import {
  createPagamento,
  updatePagamento,
  deletePagamento,
} from "@/services/pagamento.service";

export interface PagamentoActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/financeiro/pagamentos";

export async function createPagamentoAction(
  values: unknown
): Promise<PagamentoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = pagamentoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createPagamento(user.tenantId, parsed.data);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível registrar o pagamento.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updatePagamentoAction(
  id: string,
  values: unknown
): Promise<PagamentoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = pagamentoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updatePagamento(user.tenantId, id, parsed.data);
    if (!ok) return { error: "Pagamento não encontrado." };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar o pagamento.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deletePagamentoAction(
  id: string
): Promise<PagamentoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deletePagamento(user.tenantId, id);
  } catch {
    return { error: "Não foi possível excluir o pagamento." };
  }

  revalidatePath(BASE);
  return {};
}
