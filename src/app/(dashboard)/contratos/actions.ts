"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { contratoSchema } from "@/lib/validations/contrato";
import {
  createContrato,
  updateContrato,
  deleteContrato,
} from "@/services/contrato.service";

export interface ContratoActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const BASE = "/contratos";

export async function createContratoAction(
  values: unknown
): Promise<ContratoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contratoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createContrato(user.tenantId, parsed.data);
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar o contrato.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateContratoAction(
  id: string,
  values: unknown
): Promise<ContratoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = contratoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateContrato(user.tenantId, id, parsed.data);
    if (!ok) return { error: "Contrato não encontrado." };
  } catch (e) {
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar o contrato.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteContratoAction(
  id: string
): Promise<ContratoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteContrato(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error: "Contrato com medições vinculadas. Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir o contrato." };
  }

  revalidatePath(BASE);
  return {};
}
