"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { requireUser, isManagerRole } from "@/lib/auth";
import { fornecedorSchema } from "@/lib/validations/fornecedor";
import {
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
} from "@/services/fornecedor.service";

export interface FornecedorActionState {
  error?: string;
}

const SEM_PERMISSAO = "Você não tem permissão para esta ação.";

export async function createFornecedorAction(
  values: unknown
): Promise<FornecedorActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = fornecedorSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  await createFornecedor(user.tenantId, parsed.data);
  revalidatePath("/fornecedores");
  redirect("/fornecedores");
}

export async function updateFornecedorAction(
  id: string,
  values: unknown
): Promise<FornecedorActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  const parsed = fornecedorSchema.safeParse(values);
  if (!parsed.success) return { error: "Dados inválidos." };

  const ok = await updateFornecedor(user.tenantId, id, parsed.data);
  if (!ok) return { error: "Fornecedor não encontrado." };

  revalidatePath("/fornecedores");
  redirect("/fornecedores");
}

export async function deleteFornecedorAction(
  id: string
): Promise<FornecedorActionState> {
  const user = await requireUser();
  if (!isManagerRole(user.role)) return { error: SEM_PERMISSAO };

  try {
    await deleteFornecedor(user.tenantId, id);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2003"
    ) {
      return {
        error:
          "Fornecedor vinculado a contas, notas ou contratos. Não é possível excluir.",
      };
    }
    return { error: "Não foi possível excluir o fornecedor." };
  }

  revalidatePath("/fornecedores");
  return {};
}
