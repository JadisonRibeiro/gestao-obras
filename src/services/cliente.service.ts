import "server-only";
import { prisma } from "@/lib/prisma";
import type { ClienteInput } from "@/lib/validations/cliente";

/** Lista clientes do tenant, com busca opcional por nome/CPF-CNPJ/e-mail. */
export async function listClientes(tenantId: string, search?: string) {
  return prisma.cliente.findMany({
    where: {
      tenantId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { cpfCnpj: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
  });
}

export async function getCliente(tenantId: string, id: string) {
  return prisma.cliente.findFirst({ where: { id, tenantId } });
}

function toData(input: ClienteInput) {
  const { city, state, ...rest } = input;
  return {
    ...rest,
    address: city || state ? { city, state } : undefined,
  };
}

export async function createCliente(tenantId: string, input: ClienteInput) {
  return prisma.cliente.create({ data: { tenantId, ...toData(input) } });
}

/** Atualiza um cliente do tenant. Retorna false se não pertencer ao tenant. */
export async function updateCliente(
  tenantId: string,
  id: string,
  input: ClienteInput
) {
  const result = await prisma.cliente.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteCliente(tenantId: string, id: string) {
  const result = await prisma.cliente.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}
