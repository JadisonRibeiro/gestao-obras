"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { notaFiscalSchema } from "@/lib/validations/nota-fiscal";
import {
  createNotaFiscal,
  updateNotaFiscal,
  deleteNotaFiscal,
} from "@/services/nota-fiscal.service";

export interface NotaFiscalActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/notas-fiscais";

export async function createNotaFiscalAction(
  values: unknown
): Promise<NotaFiscalActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = notaFiscalSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createNotaFiscal(user.tenantId, user.id, parsed.data);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar a nota.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateNotaFiscalAction(
  id: string,
  values: unknown
): Promise<NotaFiscalActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = notaFiscalSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateNotaFiscal(user.tenantId, id, parsed.data);
    if (!ok) return { error: "Nota não encontrada." };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar a nota.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteNotaFiscalAction(
  id: string
): Promise<NotaFiscalActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteNotaFiscal(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error: "Nota vinculada a contas a pagar. Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir a nota." };
  }

  revalidatePath(BASE);
  return {};
}
