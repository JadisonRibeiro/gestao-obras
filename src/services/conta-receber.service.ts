import "server-only";
import { prisma } from "@/lib/prisma";
import { ContaStatus } from "@prisma/client";
import type { ContaReceberInput } from "@/lib/validations/conta-receber";

interface ListParams {
  search?: string;
  status?: ContaStatus;
  obraId?: string;
}

export async function listContasReceber(
  tenantId: string,
  params: ListParams = {}
) {
  return prisma.contaReceber.findMany({
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
      cliente: { select: { name: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function getContaReceber(tenantId: string, id: string) {
  return prisma.contaReceber.findFirst({ where: { id, tenantId } });
}

async function assertRefs(tenantId: string, input: ContaReceberInput) {
  const obra = await prisma.obra.findFirst({
    where: { id: input.obraId, tenantId },
    select: { id: true },
  });
  if (!obra) throw new Error("Obra inválida.");

  if (input.clienteId) {
    const cliente = await prisma.cliente.findFirst({
      where: { id: input.clienteId, tenantId },
      select: { id: true },
    });
    if (!cliente) throw new Error("Cliente inválido.");
  }
}

function toData(input: ContaReceberInput) {
  return {
    obraId: input.obraId,
    clienteId: input.clienteId,
    description: input.description,
    amount: input.amount,
    dueDate: input.dueDate,
    status: input.status,
    notes: input.notes,
  };
}

export async function createContaReceber(
  tenantId: string,
  input: ContaReceberInput
) {
  await assertRefs(tenantId, input);
  return prisma.contaReceber.create({ data: { tenantId, ...toData(input) } });
}

export async function updateContaReceber(
  tenantId: string,
  id: string,
  input: ContaReceberInput
) {
  await assertRefs(tenantId, input);
  const result = await prisma.contaReceber.updateMany({
    where: { id, tenantId },
    data: toData(input),
  });
  return result.count > 0;
}

export async function deleteContaReceber(tenantId: string, id: string) {
  const result = await prisma.contaReceber.deleteMany({
    where: { id, tenantId },
  });
  return result.count > 0;
}

/** Marca a conta como recebida integralmente. */
export async function markContaReceberReceived(tenantId: string, id: string) {
  const conta = await prisma.contaReceber.findFirst({
    where: { id, tenantId },
  });
  if (!conta) return false;
  const result = await prisma.contaReceber.updateMany({
    where: { id, tenantId },
    data: {
      status: ContaStatus.PAGO,
      receivedAt: new Date(),
      amountPaid: conta.amount,
    },
  });
  return result.count > 0;
}

/** Totais para os cards de resumo (a receber e vencido). */
export async function getContasReceberSummary(tenantId: string) {
  const contas = await prisma.contaReceber.findMany({
    where: {
      tenantId,
      status: { notIn: [ContaStatus.PAGO, ContaStatus.CANCELADO] },
    },
    select: { amount: true, amountPaid: true, dueDate: true },
  });

  const now = Date.now();
  let aReceber = 0;
  let vencido = 0;
  for (const c of contas) {
    const restante = c.amount - c.amountPaid;
    aReceber += restante;
    if (c.dueDate.getTime() < now) vencido += restante;
  }
  return { aReceber, vencido, quantidade: contas.length };
}
