import "server-only";
import { prisma } from "@/lib/prisma";
import type { RdoInput } from "@/lib/validations/rdo";

interface ListParams {
  search?: string;
  obraId?: string;
}

export async function listRdos(tenantId: string, params: ListParams = {}) {
  return prisma.rdo.findMany({
    where: {
      tenantId,
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? { activities: { contains: params.search, mode: "insensitive" } }
        : {}),
    },
    include: {
      obra: { select: { name: true } },
      user: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function getRdo(tenantId: string, id: string) {
  return prisma.rdo.findFirst({ where: { id, tenantId } });
}

async function assertObra(tenantId: string, obraId: string) {
  const obra = await prisma.obra.findFirst({
    where: { id: obraId, tenantId },
    select: { id: true },
  });
  if (!obra) throw new Error("Obra inválida.");
}

function toData(input: RdoInput) {
  return {
    obraId: input.obraId,
    date: input.date,
    weather: input.weather,
    temperature: input.temperature,
    workers: input.workers,
    activities: input.activities,
    occurrences: input.occurrences,
  };
}

export async function createRdo(
  tenantId: string,
  userId: string,
  input: RdoInput
) {
  await assertObra(tenantId, input.obraId);
  return prisma.rdo.create({
    data: { tenantId, userId, ...toData(input) },
  });
}

export async function updateRdo(
  tenantId: string,
  id: string,
  input: RdoInput
) {
  await assertObra(tenantId, input.obraId);
  const result = await prisma.rdo.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteRdo(tenantId: string, id: string) {
  const result = await prisma.rdo.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}

export async function getRdosCount(tenantId: string) {
  return prisma.rdo.count({ where: { tenantId } });
}
