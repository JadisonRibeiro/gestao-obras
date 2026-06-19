import "server-only";
import { prisma } from "@/lib/prisma";

/** Lista os planos ativos (ordenados por preço) para a página de plano. */
export async function listPlans() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { priceMonthly: "asc" },
  });
}
