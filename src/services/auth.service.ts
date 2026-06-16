import "server-only";
import { prisma } from "@/lib/prisma";

/** Dias de trial gratuito ao cadastrar uma nova construtora. */
export const TRIAL_DAYS = 14;

interface CreateTenantWithAdminInput {
  /** UID do usuário no Supabase Auth. */
  authId: string;
  /** Nome da construtora (tenant). */
  companyName: string;
  /** Nome do usuário administrador. */
  name: string;
  email: string;
}

/**
 * Cria a construtora (tenant) no plano Starter com trial de 14 dias e o
 * primeiro usuário como ADMIN, de forma transacional.
 */
export async function createTenantWithAdmin({
  authId,
  companyName,
  name,
  email,
}: CreateTenantWithAdminInput) {
  const starterPlan = await prisma.plan.findUnique({
    where: { slug: "starter" },
  });

  if (!starterPlan) {
    throw new Error(
      "Plano inicial não encontrado. Rode o seed (npm run db:seed)."
    );
  }

  const trialEndsAt = new Date(
    Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000
  );

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name: companyName,
        email,
        planId: starterPlan.id,
        subscriptionStatus: "TRIAL",
        trialEndsAt,
      },
    });

    const user = await tx.user.create({
      data: {
        authId,
        tenantId: tenant.id,
        name,
        email,
        role: "ADMIN",
      },
    });

    return { tenant, user };
  });
}

/**
 * Retorna o usuário da aplicação (com tenant e plano) a partir do UID do
 * Supabase Auth. `null` se ainda não houver registro vinculado.
 */
export async function getUserByAuthId(authId: string) {
  return prisma.user.findUnique({
    where: { authId },
    include: { tenant: { include: { plan: true } } },
  });
}
