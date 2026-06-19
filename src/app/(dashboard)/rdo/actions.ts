"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { rdoSchema } from "@/lib/validations/rdo";
import { createRdo, updateRdo, deleteRdo } from "@/services/rdo.service";

export interface RdoActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";
const DUPLICADO = "Já existe um RDO para esta obra nesta data.";
const BASE = "/rdo";

function isUniqueError(e: unknown) {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
  );
}

export async function createRdoAction(
  values: unknown
): Promise<RdoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = rdoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    await createRdo(user.tenantId, user.id, parsed.data);
  } catch (e) {
    if (isUniqueError(e)) return { error: DUPLICADO };
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar o RDO.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function updateRdoAction(
  id: string,
  values: unknown
): Promise<RdoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = rdoSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  try {
    const ok = await updateRdo(user.tenantId, id, parsed.data);
    if (!ok) return { error: "RDO não encontrado." };
  } catch (e) {
    if (isUniqueError(e)) return { error: DUPLICADO };
    return {
      error:
        e instanceof Error && e.message.includes("inválid")
          ? e.message
          : "Não foi possível salvar o RDO.",
    };
  }

  revalidatePath(BASE);
  redirect(BASE);
}

export async function deleteRdoAction(id: string): Promise<RdoActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteRdo(user.tenantId, id);
  } catch {
    return { error: "Não foi possível excluir o RDO." };
  }

  revalidatePath(BASE);
  return {};
}
