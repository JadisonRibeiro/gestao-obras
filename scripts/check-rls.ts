// Verifica quais tabelas do schema public estão com RLS habilitado.
// Execução: npm run db:check-rls
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.$queryRaw<
    { tablename: string; rowsecurity: boolean }[]
  >`SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;

  const enabled = rows.filter((r) => r.rowsecurity);
  const disabled = rows.filter(
    (r) => !r.rowsecurity && r.tablename !== "_prisma_migrations"
  );

  console.log(`RLS habilitado em ${enabled.length} tabela(s):`);
  enabled.forEach((r) => console.log(`  ✔ ${r.tablename}`));

  if (disabled.length > 0) {
    console.log(`\n⚠ Sem RLS (${disabled.length}):`);
    disabled.forEach((r) => console.log(`  ✗ ${r.tablename}`));
  } else {
    console.log("\nTodas as tabelas da aplicação estão protegidas por RLS.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
