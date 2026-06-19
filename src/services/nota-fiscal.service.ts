import "server-only";
import { prisma } from "@/lib/prisma";
import { NotaStatus } from "@prisma/client";
import type { NotaFiscalInput } from "@/lib/validations/nota-fiscal";

interface ListParams {
  search?: string;
  obraId?: string;
}

export async function listNotasFiscais(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.notaFiscal.findMany({
    where: {
      tenantId,
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? {
            OR: [
              { number: { contains: params.search, mode: "insensitive" } },
              { notes: { contains: params.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      obra: { select: { name: true } },
      fornecedor: { select: { name: true } },
    },
    orderBy: { issueDate: "desc" },
  });
}

export async function getNotaFiscal(tenantId: string, id: string) {
  return prisma.notaFiscal.findFirst({ where: { id, tenantId } });
}

async function assertRefs(tenantId: string, input: NotaFiscalInput) {
  const obra = await prisma.obra.findFirst({
    where: { id: input.obraId, tenantId },
    select: { id: true },
  });
  if (!obra) throw new Error("Obra inválida.");

  if (input.fornecedorId) {
    const fornecedor = await prisma.fornecedor.findFirst({
      where: { id: input.fornecedorId, tenantId },
      select: { id: true },
    });
    if (!fornecedor) throw new Error("Fornecedor inválido.");
  }
}

function toData(input: NotaFiscalInput) {
  return {
    obraId: input.obraId,
    fornecedorId: input.fornecedorId,
    number: input.number,
    series: input.series,
    type: input.type,
    issueDate: input.issueDate,
    totalAmount: input.totalAmount,
    taxAmount: input.taxAmount,
    status: input.status,
    notes: input.notes,
  };
}

export async function createNotaFiscal(
  tenantId: string,
  userId: string,
  input: NotaFiscalInput
) {
  await assertRefs(tenantId, input);
  return prisma.notaFiscal.create({
    data: { tenantId, lancadoPorId: userId, ...toData(input) },
  });
}

export async function updateNotaFiscal(
  tenantId: string,
  id: string,
  input: NotaFiscalInput
) {
  await assertRefs(tenantId, input);
  const result = await prisma.notaFiscal.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteNotaFiscal(tenantId: string, id: string) {
  const result = await prisma.notaFiscal.deleteMany({
    where: { id, tenantId },
  });
  return result.count > 0;
}

/** Totais para os cards de resumo. */
export async function getNotasFiscaisSummary(tenantId: string) {
  const [agg, pendentes] = await Promise.all([
    prisma.notaFiscal.aggregate({
      where: { tenantId, status: { not: NotaStatus.CANCELADA } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.notaFiscal.count({
      where: { tenantId, status: NotaStatus.PENDENTE },
    }),
  ]);

  return {
    total: agg._sum.totalAmount ?? 0,
    quantidade: agg._count,
    pendentes,
  };
}
