import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Planos de assinatura (limites conforme CLAUDE.md).
 * `stripePriceId` usa placeholders até a integração com o Stripe (Fase 3).
 * `priceMonthly` em BRL — valores iniciais, ajustar conforme a precificação.
 */
const PLANS = [
  {
    slug: "starter",
    name: "Starter",
    priceMonthly: 99.0,
    maxObras: 3,
    maxUsers: 3,
    maxStorageGb: 5,
    stripePriceId: "price_starter_placeholder",
    features: [
      "Até 3 obras ativas",
      "Até 3 usuários",
      "5 GB de armazenamento",
      "Módulos financeiros e de obras",
    ],
  },
  {
    slug: "pro",
    name: "Pro",
    priceMonthly: 249.0,
    maxObras: 10,
    maxUsers: 10,
    maxStorageGb: 20,
    stripePriceId: "price_pro_placeholder",
    features: [
      "Até 10 obras ativas",
      "Até 10 usuários",
      "20 GB de armazenamento",
      "Relatórios gerenciais",
      "Orçamento e cronograma",
    ],
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    priceMonthly: 599.0,
    maxObras: null, // ilimitado
    maxUsers: null, // ilimitado
    maxStorageGb: 100,
    stripePriceId: "price_enterprise_placeholder",
    features: [
      "Obras ilimitadas",
      "Usuários ilimitados",
      "100 GB de armazenamento",
      "Todos os módulos",
      "Suporte prioritário",
    ],
  },
] as const;

async function main() {
  for (const plan of PLANS) {
    const { slug, features, ...rest } = plan;
    await prisma.plan.upsert({
      where: { slug },
      update: { ...rest, features: [...features] },
      create: { slug, ...rest, features: [...features] },
    });
    console.log(`✔ plano "${plan.name}" criado/atualizado`);
  }
}

main()
  .then(() => console.log("Seed concluído."))
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
