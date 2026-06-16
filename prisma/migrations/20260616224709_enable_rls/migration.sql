-- Habilita Row Level Security (deny-by-default) em todas as tabelas do schema public.
--
-- O papel "postgres" (usado pelo Prisma via DIRECT_URL) é OWNER das tabelas e
-- IGNORA o RLS — por isso a aplicação continua funcionando normalmente.
-- Acessos via chave anon/publishable (PostgREST/supabase-js no browser) ficam
-- BLOQUEADOS enquanto não houver policies, evitando exposição acidental de dados.
--
-- As policies por tenant_id serão adicionadas na fase de autenticação, quando
-- existir o vínculo usuário (auth.uid()) -> tenant_id.

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename <> '_prisma_migrations'
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', r.tablename);
  END LOOP;
END $$;
