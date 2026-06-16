"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { obraSchema, OBRA_STATUSES } from "@/lib/validations/obra";
import {
  createObra,
  updateObra,
  updateObraStatus,
  deleteObra,
} from "@/services/obra.service";
import { PlanLimitError } from "@/services/plano.service";

export interface ObraActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";

export async function createObraAction(
  values: unknown
): Promise<ObraActionState> {
  const user = await requireUser();

  // Apenas ADMIN e GESTOR podem criar obras.
  if (user.role !== "ADMIN" && user.role !== "GESTOR") {
    return { error: "Você não tem permissão para criar obras." };
  }

  const parsed = obraSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados inválidos. Verifique os campos." };
  }

  try {
    await createObra(user.tenantId, parsed.data);
  } catch (e) {
    if (e instanceof PlanLimitError) return { error: e.message };
    return { error: "Não foi possível criar a obra. Tente novamente." };
  }

  revalidatePath("/obras");
  redirect("/obras");
}

export async function updateObraAction(
  id: string,
  values: unknown
): Promise<ObraActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = obraSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos. Verifique os campos." };

  const ok = await updateObra(user.tenantId, id, parsed.data);
  if (!ok) return { error: "Obra não encontrada." };

  revalidatePath("/obras");
  revalidatePath(`/obras/${id}`);
  redirect(`/obras/${id}`);
}

export async function updateObraStatusAction(
  id: string,
  status: string
): Promise<ObraActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const valid = OBRA_STATUSES.includes(
    status as (typeof OBRA_STATUSES)[number]
  );
  if (!valid) return { error: "Status inválido." };

  const ok = await updateObraStatus(
    user.tenantId,
    id,
    status as (typeof OBRA_STATUSES)[number]
  );
  if (!ok) return { error: "Obra não encontrada." };

  revalidatePath("/obras");
  revalidatePath(`/obras/${id}`);
  return {};
}

export async function deleteObraAction(
  id: string
): Promise<ObraActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteObra(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error:
          "Obra com lançamentos vinculados (financeiro, notas, etc.). Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir a obra." };
  }

  revalidatePath("/obras");
  redirect("/obras");
}
