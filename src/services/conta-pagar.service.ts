import "server-only";
import { prisma } from "@/lib/prisma";
import { ContaStatus } from "@prisma/client";
import type { ContaPagarInput } from "@/lib/validations/conta-pagar";

interface ListParams {
  search?: string;
  status?: ContaStatus;
  obraId?: string;
}

export async function listContasPagar(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.contaPagar.findMany({
    where: {
      tenantId,
      ...(params.status ? { status: params.status } : {}),
      ...(params.obraId ? { obraId: params.obraId } : {}),
      ...(params.search
        ? { description: { contains: params.search, mode: "insensitive" } }
        : {}),
    },
    include: {
      obra: { select: { name: true } },
      fornecedor: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getContaPagar(tenantId: string, id: string) {
  return prisma.contaPagar.findFirst({ where: { id, tenantId } });
}

/** Garante que obra (e fornecedor, se houver) pertencem ao tenant. */
async function assertRefs(tenantId: string, input: ContaPagarInput) {
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

function toData(input: ContaPagarInput) {
  return {
    obraId: input.obraId,
    fornecedorId: input.fornecedorId,
    description: input.description,
    amount: input.amount,
    dueDate: input.dueDate,
    status: input.status,
    paymentMethod: input.paymentMethod,
    notes: input.notes,
  };
}

export async function createContaPagar(
  tenantId: string,
  input: ContaPagarInput
) {
  await assertRefs(tenantId, input);
  return prisma.contaPagar.create({ data: { tenantId, ...toData(input) } });
}

export async function updateContaPagar(
  tenantId: string,
  id: string,
  input: ContaPagarInput
) {
  await assertRefs(tenantId, input);
  const result = await prisma.contaPagar.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteContaPagar(tenantId: string, id: string) {
  const result = await prisma.contaPagar.deleteMany({ where: { id, tenantId } });
  return result.count > 0;
}

/** Marca a conta como paga integralmente. */
export async function markContaPagarPaid(tenantId: string, id: string) {
  const conta = await prisma.contaPagar.findFirst({ where: { id, tenantId } });
  if (!conta) return false;
  const result = await prisma.contaPagar.updateMany({
    where: { id, tenantId },
    data: {
      status: ContaStatus.PAGO,
      paidAt: new Date(),
      amountPaid: conta.amount,
    },
  });
  return result.count > 0;
}

/** Totais para os cards de resumo (em aberto e vencido). */
export async function getContasPagarSummary(tenantId: string) {
  const contas = await prisma.contaPagar.findMany({
    where: {
      tenantId,
      status: { notIn: [ContaStatus.PAGO, ContaStatus.CANCELADO] },
    },
    select: { amount: true, amountPaid: true, dueDate: true },
  });

  const now = Date.now();
  let emAberto = 0;
  let vencido = 0;
  for (const c of contas) {
    const restante = c.amount - c.amountPaid;
    emAberto += restante;
    if (c.dueDate.getTime() < now) vencido += restante;
  }
  return { emAberto, vencido, quantidade: contas.length };
}
