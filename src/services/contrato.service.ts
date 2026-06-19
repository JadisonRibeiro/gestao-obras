import "server-only";
import { prisma } from "@/lib/prisma";
import { ContratoStatus } from "@prisma/client";
import type { ContratoInput } from "@/lib/validations/contrato";

interface ListParams {
  search?: string;
  obraId?: string;
}

export async function listContratos(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.contrato.findMany({
    where: {
      tenantId,
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? {
            OR: [
              { description: { contains: params.search, mode: "insensitive" } },
              { number: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      obra: { select: { name: true } },
      fornecedor: { select: { name: true } },
      cliente: { select: { name: true } },
    },
    orderBy: { startDate: "desc" },
  });
}

export async function getContrato(tenantId: string, id: string) {
  return prisma.contrato.findFirst({ where: { id, tenantId } });
}

async function assertRefs(tenantId: string, input: ContratoInput) {
  const obra = await prisma.obra.findFirst({
    where: { id: input.obraId, tenantId },
    select: { id: true },
  });
  if (!obra) throw new Error("Obra inválida.");

  if (input.fornecedorId) {
    const f = await prisma.fornecedor.findFirst({
      where: { id: input.fornecedorId, tenantId },
      select: { id: true },
    });
    if (!f) throw new Error("Fornecedor inválido.");
  }
  if (input.clienteId) {
    const c = await prisma.cliente.findFirst({
      where: { id: input.clienteId, tenantId },
      select: { id: true },
    });
    if (!c) throw new Error("Cliente inválido.");
  }
}

function toData(input: ContratoInput) {
  return {
    obraId: input.obraId,
    type: input.type,
    fornecedorId: input.fornecedorId,
    clienteId: input.clienteId,
    number: input.number,
    description: input.description,
    amount: input.amount,
    startDate: input.startDate,
    endDate: input.endDate,
    status: input.status,
    notes: input.notes,
  };
}

export async function createContrato(tenantId: string, input: ContratoInput) {
  await assertRefs(tenantId, input);
  return prisma.contrato.create({ data: { tenantId, ...toData(input) } });
}

export async function updateContrato(
  tenantId: string,
  id: string,
  input: ContratoInput
) {
  await assertRefs(tenantId, input);
  const result = await prisma.contrato.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteContrato(tenantId: string, id: string) {
  const result = await prisma.contrato.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}

/** Totais para os cards de resumo. */
export async function getContratosSummary(tenantId: string) {
  const agg = await prisma.contrato.aggregate({
    where: { tenantId, status: ContratoStatus.ATIVO },
    _sum: { amount: true },
    _count: true,
  });
  return {
    ativos: agg._count,
    valorAtivos: agg._sum.amount ?? 0,
  };
}
