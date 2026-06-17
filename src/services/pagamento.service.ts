import "server-only";
import { prisma } from "@/lib/prisma";
import { PagamentoType } from "@prisma/client";
import type { PagamentoInput } from "@/lib/validations/pagamento";

interface ListParams {
  search?: string;
  type?: PagamentoType;
  obraId?: string;
}

export async function listPagamentos(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.pagamento.findMany({
    where: {
      tenantId,
      ...(params.type ? { type: params.type } : {}),
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? { description: { contains: params.search, mode: "insensitive" } }
        : {}),
    },
    include: { obra: { select: { name: true } } },
    orderBy: { paidAt: "desc" },
  });
}

export async function getPagamento(tenantId: string, id: string) {
  return prisma.pagamento.findFirst({ where: { id, tenantId } });
}

async function assertObra(tenantId: string, obraId: string) {
  const obra = await prisma.obra.findFirst({
    where: { id: obraId, tenantId },
    select: { id: true },
  });
  if (!obra) throw new Error("Obra inválida.");
}

function toData(input: PagamentoInput) {
  return {
    obraId: input.obraId,
    type: input.type,
    description: input.description,
    amount: input.amount,
    paidAt: input.paidAt,
    paymentMethod: input.paymentMethod,
    notes: input.notes,
  };
}

export async function createPagamento(
  tenantId: string,
  input: PagamentoInput
) {
  await assertObra(tenantId, input.obraId);
  return prisma.pagamento.create({ data: { tenantId, ...toData(input) } });
}

export async function updatePagamento(
  tenantId: string,
  id: string,
  input: PagamentoInput
) {
  await assertObra(tenantId, input.obraId);
  const result = await prisma.pagamento.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deletePagamento(tenantId: string, id: string) {
  const result = await prisma.pagamento.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}

/** Totais de entradas, saídas e saldo. */
export async function getPagamentosSummary(tenantId: string) {
  const grouped = await prisma.pagamento.groupBy({
    by: ["type"],
    where: { tenantId },
    _sum: { amount: true },
  });

  let entradas = 0;
  let saidas = 0;
  for (const g of grouped) {
    if (g.type === PagamentoType.ENTRADA) entradas = g._sum.amount ?? 0;
    if (g.type === PagamentoType.SAIDA) saidas = g._sum.amount ?? 0;
  }
  return { entradas, saidas, saldo: entradas - saidas };
}
