# Gestão de Obras (SaaS)

Sistema SaaS B2B de gestão de obras para construtoras brasileiras — financeiro,
obras, notas fiscais, contratos e relatórios. Assinatura mensal recorrente com
planos por número de obras ativas.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS 3** + **shadcn/ui** (Radix)
- **Supabase** (PostgreSQL, Auth, Storage) + **Prisma 6**
- **Stripe** (assinaturas)
- **PWA** (next-pwa) — mobile-first

> Veja [CLAUDE.md](CLAUDE.md) para os padrões de arquitetura/código e
> [docs/roadmap.md](docs/roadmap.md) para o roadmap de desenvolvimento.

## Como rodar

```bash
npm install
# crie o arquivo .env.local e preencha as variáveis (Supabase, Stripe, Prisma)
npx prisma generate
npm run dev                         # http://localhost:3000
```

## Variáveis de ambiente

Configure o `.env.local` com as credenciais do Supabase (URL, anon key, service
role), as connection strings do Postgres (`DATABASE_URL`, `DIRECT_URL`) e as
chaves do Stripe. O arquivo não é versionado.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção (gera o service worker do PWA)
- `npm run start` — serve o build de produção
- `npm run lint` — ESLint
- `node scripts/generate-icons.mjs` — regenera os ícones do PWA

## Status

Fase 1 (Fundação) em andamento: setup, layout do dashboard e PWA prontos;
autenticação, multi-tenant e RLS em desenvolvimento.
