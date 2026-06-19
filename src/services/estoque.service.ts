import "server-only";
import { prisma } from "@/lib/prisma";
import { MovimentacaoType } from "@prisma/client";
import type { MovimentacaoInput } from "@/lib/validations/estoque";

interface ListParams {
  search?: string;
  obraId?: string;
}

export async function listMovimentacoes(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.movimentacaoEstoque.findMany({
    where: {
      tenantId,
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? { material: { contains: params.search, mode: "insensitive" } }
        : {}),
    },
    include: {
      obra: { select: { name: true } },
      fornecedor: { select: { name: true } },
    },
    orderBy: { date: "desc" },
  });
}

export async function getMovimentacao(tenantId: string, id: string) {
  return prisma.movimentacaoEstoque.findFirst({ where: { id, tenantId } });
}

async function assertRefs(tenantId: string, input: MovimentacaoInput) {
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
}

function toData(input: MovimentacaoInput) {
  const total =
    input.unitPrice != null ? input.quantity * input.unitPrice : null;
  return {
    obraId: input.obraId,
    fornecedorId: input.fornecedorId,
    material: input.material,
    unit: input.unit,
    quantity: input.quantity,
    unitPrice: input.unitPrice,
    total,
    type: input.type,
    date: input.date,
    notes: input.notes,
  };
}

export async function createMovimentacao(
  tenantId: string,
  input: MovimentacaoInput
) {
  await assertRefs(tenantId, input);
  return prisma.movimentacaoEstoque.create({
    data: { tenantId, ...toData(input) },
  });
}

export async function updateMovimentacao(
  tenantId: string,
  id: string,
  input: MovimentacaoInput
) {
  await assertRefs(tenantId, input);
  const result = await prisma.movimentacaoEstoque.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteMovimentacao(tenantId: string, id: string) {
  const result = await prisma.movimentacaoEstoque.deleteMany({
    where: { id, tenantId },
  });
  return result.count > 0;
}

/** Totais para os cards de resumo (valor de entradas e de saídas/perdas). */
export async function getEstoqueSummary(tenantId: string) {
  const grouped = await prisma.movimentacaoEstoque.groupBy({
    by: ["type"],
    where: { tenantId },
    _sum: { total: true },
    _count: true,
  });

  let entradas = 0;
  let saidas = 0;
  let movimentacoes = 0;
  for (const g of grouped) {
    movimentacoes += g._count;
    const value = g._sum.total ?? 0;
    if (g.type === MovimentacaoType.ENTRADA) entradas += value;
    else saidas += value;
  }
  return { entradas, saidas, movimentacoes };
}
