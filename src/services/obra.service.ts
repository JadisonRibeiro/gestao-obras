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

function toData(input: ObraInput) {
  const { street, number, city, state, zip, ...rest } = input;
  return {
    name: rest.name,
    code: rest.code,
    description: rest.description,
    type: rest.type,
    status: rest.status,
    area: rest.area,
    totalBudget: rest.totalBudget,
    address: { street, number, city, state, zip },
  };
}

/**
 * Cria uma obra após verificar o limite do plano. O endereço é gravado como
 * JSON. Lança PlanLimitError se o limite do plano tiver sido atingido.
 */
export async function createObra(tenantId: string, input: ObraInput) {
  await assertCanCreateObra(tenantId);
  return prisma.obra.create({ data: { tenantId, ...toData(input) } });
}

/** Atualiza uma obra do tenant. Retorna false se não pertencer ao tenant. */
export async function updateObra(
  tenantId: string,
  id: string,
  input: ObraInput
) {
  const result = await prisma.obra.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

/** Altera apenas o status da obra. */
export async function updateObraStatus(
  tenantId: string,
  id: string,
  status: ObraStatus
) {
  const result = await prisma.obra.updateMany({
    where: { id, tenantId },
    data: { status },
  });
  return result.count > 0;
}

export async function deleteObra(tenantId: string, id: string) {
  const result = await prisma.obra.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}
