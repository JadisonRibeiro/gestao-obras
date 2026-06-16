import "server-only";
import { prisma } from "@/lib/prisma";
import type { FornecedorInput } from "@/lib/validations/fornecedor";

/** Lista fornecedores do tenant, com busca por nome/CNPJ/categoria. */
export async function listFornecedores(tenantId: string, search?: string) {
  return prisma.fornecedor.findMany({
    where: {
      tenantId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { cnpj: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getFornecedor(tenantId: string, id: string) {
  return prisma.fornecedor.findFirst({ where: { id, tenantId } });
}

function toData(input: FornecedorInput) {
  const { city, state, ...rest } = input;
  return {
    ...rest,
    address: city || state ? { city, state } : undefined,
  };
}

export async function createFornecedor(
  tenantId: string,
  input: FornecedorInput
) {
  return prisma.fornecedor.create({ data: { tenantId, ...toData(input) } });
}

export async function updateFornecedor(
  tenantId: string,
  id: string,
  input: FornecedorInput
) {
  const result = await prisma.fornecedor.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteFornecedor(tenantId: string, id: string) {
  const result = await prisma.fornecedor.deleteMany({
    where: { id, tenantId },
  });
  return result.count > 0;
}
