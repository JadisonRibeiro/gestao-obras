import "server-only";
import { prisma } from "@/lib/prisma";
import { ObraStatus } from "@prisma/client";

/** Status que NÃO contam como obra ativa para o limite do plano. */
const INACTIVE_OBRA_STATUSES: ObraStatus[] = [
  ObraStatus.CONCLUIDA,
  ObraStatus.CANCELADA,
];

/** Erro de negócio: limite do plano atingido. */
export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanLimitError";
  }
}

/** Uso atual de obras vs. limite do plano do tenant. */
export async function getObraUsage(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    include: { plan: true },
  });
  if (!tenant) throw new Error("Construtora não encontrada.");

  const current = await prisma.obra.count({
    where: { tenantId, status: { notIn: INACTIVE_OBRA_STATUSES } },
  });

  const max = tenant.plan.maxObras; // null = ilimitado
  const canCreate = max == null || current < max;

  return { current, max, canCreate, planName: tenant.plan.name };
}

/** Lança PlanLimitError se o tenant não puder criar mais obras. */
export async function assertCanCreateObra(tenantId: string) {
  const usage = await getObraUsage(tenantId);
  if (!usage.canCreate) {
    throw new PlanLimitError(
      `Limite de obras do plano ${usage.planName} atingido (${usage.max}). ` +
        `Faça upgrade para cadastrar mais obras.`
    );
  }
}
