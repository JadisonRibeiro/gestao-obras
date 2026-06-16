import "server-only";
import { prisma } from "@/lib/prisma";
import { ObraStatus } from "@prisma/client";
import type { ObraInput } from "@/lib/validations/obra";
import { assertCanCreateObra } from "./plano.service";

interface ListObrasParams {
  status?: ObraStatus;
  search?: string;
}

/** Lista as obras do tenant (sempre isolado por tenantId). */
export async function listObras(tenantId: string, params: ListObrasParams = {}) {
  return prisma.obra.findMany({
    where: {
      tenantId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { code: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

/** Busca uma obra do tenant pelo id (retorna null se não pertencer). */
export async function getObra(tenantId: string, id: string) {
  return prisma.obra.findFirst({ where: { id, tenantId } });
}

/**
 * Cria uma obra após verificar o limite do plano. O endereço é gravado como
 * JSON. Lança PlanLimitError se o limite do plano tiver sido atingido.
 */
export async function createObra(tenantId: string, input: ObraInput) {
  await assertCanCreateObra(tenantId);

  const { street, number, city, state, zip, area, totalBudget, ...rest } =
    input;

  return prisma.obra.create({
    data: {
      tenantId,
      name: rest.name,
      code: rest.code,
      description: rest.description,
      type: rest.type,
      status: rest.status,
      area,
      totalBudget,
      address: { street, number, city, state, zip },
    },
  });
}
