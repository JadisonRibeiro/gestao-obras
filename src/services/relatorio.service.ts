import "server-only";
import { prisma } from "@/lib/prisma";
import { ContaStatus, PagamentoType } from "@prisma/client";

/** Relatório financeiro consolidado do tenant + visão por obra. */
export async function getRelatorioFinanceiro(tenantId: string) {
  const openPagar = {
    tenantId,
    status: { notIn: [ContaStatus.PAGO, ContaStatus.CANCELADO] },
  };
  const openReceber = {
    tenantId,
    status: { notIn: [ContaStatus.PAGO, ContaStatus.CANCELADO] },
  };

  const [
    pagarAgg,
    receberAgg,
    pagamentos,
    obras,
    pagarByObra,
    receberByObra,
  ] = await Promise.all([
    prisma.contaPagar.aggregate({
      where: openPagar,
      _sum: { amount: true, amountPaid: true },
    }),
    prisma.contaReceber.aggregate({
      where: openReceber,
      _sum: { amount: true, amountPaid: true },
    }),
    prisma.pagamento.groupBy({
      by: ["type"],
      where: { tenantId },
      _sum: { amount: true },
    }),
    prisma.obra.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        status: true,
        totalBudget: true,
        totalCost: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.contaPagar.groupBy({
      by: ["obraId"],
      where: openPagar,
      _sum: { amount: true, amountPaid: true },
    }),
    prisma.contaReceber.groupBy({
      by: ["obraId"],
      where: openReceber,
      _sum: { amount: true, amountPaid: true },
    }),
  ]);

  const aPagar =
    (pagarAgg._sum.amount ?? 0) - (pagarAgg._sum.amountPaid ?? 0);
  const aReceber =
    (receberAgg._sum.amount ?? 0) - (receberAgg._sum.amountPaid ?? 0);

  let entradas = 0;
  let saidas = 0;
  for (const g of pagamentos) {
    if (g.type === PagamentoType.ENTRADA) entradas = g._sum.amount ?? 0;
    else saidas = g._sum.amount ?? 0;
  }

  const pagarMap = new Map(
    pagarByObra.map((g) => [
      g.obraId,
      (g._sum.amount ?? 0) - (g._sum.amountPaid ?? 0),
    ])
  );
  const receberMap = new Map(
    receberByObra.map((g) => [
      g.obraId,
      (g._sum.amount ?? 0) - (g._sum.amountPaid ?? 0),
    ])
  );

  const obrasReport = obras.map((o) => ({
    id: o.id,
    name: o.name,
    status: o.status,
    orcado: o.totalBudget ?? 0,
    custo: o.totalCost,
    aPagar: pagarMap.get(o.id) ?? 0,
    aReceber: receberMap.get(o.id) ?? 0,
  }));

  return {
    aPagar,
    aReceber,
    entradas,
    saidas,
    saldoRealizado: entradas - saidas,
    resultadoProjetado: aReceber - aPagar,
    obras: obrasReport,
  };
}
