import "server-only";
import { prisma } from "@/lib/prisma";

/** Lista os usuários (equipe) do tenant. */
export async function listUsers(tenantId: string) {
  return prisma.user.findMany({
    where: { tenantId },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
}

export async function countUsers(tenantId: string) {
  return prisma.user.count({ where: { tenantId } });
}
