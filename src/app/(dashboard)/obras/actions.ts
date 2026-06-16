"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { obraSchema } from "@/lib/validations/obra";
import { createObra } from "@/services/obra.service";
import { PlanLimitError } from "@/services/plano.service";

export interface ObraActionState {
  error?: string;
}

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
