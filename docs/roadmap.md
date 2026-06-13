# Roadmap de Desenvolvimento — Gestão de Obras SaaS

## Visão Geral

Sistema SaaS B2B de gestão de obras para construtoras.
Modelo: assinatura mensal recorrente (Starter / Pro / Enterprise).
Stack: Next.js 14 + Supabase + Stripe + PWA.

---

## FASE 1 — Fundação (Semanas 1-2)
> Objetivo: Ambiente configurado, autenticação funcionando, layout base pronto.

### Setup Técnico
- [ ] Criar projeto Next.js 14 com TypeScript e App Router
- [ ] Configurar Tailwind CSS + shadcn/ui
- [ ] Configurar Supabase (projeto, variáveis de ambiente)
- [ ] Configurar Prisma + rodar migrations iniciais
- [ ] Ativar Row Level Security (RLS) no Supabase
- [ ] Configurar Vercel (deploy automático da main)
- [ ] Configurar PWA (manifest.json + next-pwa)

### Autenticação e Tenant
- [ ] Página de cadastro de nova construtora (onboarding)
- [ ] Página de login
- [ ] Middleware de autenticação (proteger rotas do dashboard)
- [ ] Criação automática de tenant ao cadastrar
- [ ] Lógica de trial de 14 dias

### Layout Base
- [ ] Layout do dashboard (sidebar responsiva)
- [ ] Header com tenant info e avatar do usuário
- [ ] Navegação mobile (bottom nav para PWA)
- [ ] Página de 404 e tratamento de erros globais
- [ ] Componentes base: DataTable, PageHeader, StatusBadge, CurrencyInput

---

## FASE 2 — Core do Produto (Semanas 3-6)
> Objetivo: Módulos principais funcionando. Produto minimamente utilizável.

### Cadastros Base
- [ ] CRUD de Clientes
- [ ] CRUD de Fornecedores
- [ ] CRUD de Categorias (despesa/receita)

### Obras
- [ ] Listagem de obras com filtros (status, tipo, busca)
- [ ] Formulário de criação/edição de obra
- [ ] Página de detalhe da obra (painel com resumo financeiro)
- [ ] Mudança de status da obra
- [ ] Verificação de limite de obras por plano

### Financeiro
- [ ] Contas a Pagar: CRUD + filtros + upload de comprovante
- [ ] Contas a Receber: CRUD + filtros
- [ ] Registro de Pagamentos: entrada e saída
- [ ] Dashboard financeiro por obra (resumo de saldos)

### Notas Fiscais
- [ ] Upload de PDF/XML de nota fiscal (Supabase Storage)
- [ ] Leitura automática de XML NF-e (parser)
- [ ] Listagem e vinculação de NF a conta a pagar
- [ ] Visualização de NF no sistema

---

## FASE 3 — SaaS e Monetização (Semanas 7-9)
> Objetivo: Sistema cobrando e gerenciando assinaturas.

### Stripe Integration
- [ ] Criar produtos e preços no Stripe Dashboard
- [ ] Página de planos (pricing page)
- [ ] Checkout de assinatura (Stripe Checkout)
- [ ] Webhook Stripe (ativar/cancelar assinatura)
- [ ] Billing Portal (gerenciar plano pelo Stripe)
- [ ] Tela de conta bloqueada (plano expirado)

### Multi-Usuário
- [ ] Convite de usuários por email
- [ ] Gestão de roles (admin, gestor, mestre de obra, viewer)
- [ ] Guards de permissão por role
- [ ] Verificação de limite de usuários por plano

### Onboarding
- [ ] Wizard de onboarding pós-cadastro (4 passos)
- [ ] Email de boas-vindas (Resend/Postmark)
- [ ] Checklist de primeiros passos no dashboard

---

## FASE 4 — Diferenciais (Semanas 10-14)
> Objetivo: Aumentar retenção com funcionalidades avançadas.

### Orçamento
- [ ] Criação de orçamento por obra com itens hierárquicos
- [ ] Cálculo de BDI
- [ ] Comparativo orçado vs realizado
- [ ] Exportação de orçamento em PDF

### Cronograma
- [ ] Cadastro de etapas com datas e % progresso
- [ ] Visualização em Gantt simplificado
- [ ] Atualização de progresso e status por etapa
- [ ] Vinculação de etapa a contrato/medição

### RDO
- [ ] Formulário de RDO diário (mobile-first)
- [ ] Upload de fotos da obra (câmera no mobile via PWA)
- [ ] Histórico de RDOs por obra
- [ ] Impressão/exportação de RDO em PDF

### Estoque
- [ ] Cadastro de movimentações (entrada/saída/perda)
- [ ] Saldo atual por material e obra
- [ ] Relatório de consumo de materiais

### Relatórios
- [ ] DRE simplificada por obra
- [ ] Fluxo de caixa projetado
- [ ] Relatório de obras ativas (visão gerencial)
- [ ] Exportação em Excel/PDF

---

## FASE 5 — Crescimento (Semanas 15+)
> Objetivo: Escalar o produto e aumentar o ticket médio.

- [ ] Portal do cliente (acesso externo para acompanhar obra)
- [ ] Notificações de vencimento por email e/ou WhatsApp
- [ ] App mobile PWA aprimorado (offline, câmera, push)
- [ ] Integração com bancos (OFX/CNAB para conciliação)
- [ ] Integração com SEFAZ (consulta NF-e)
- [ ] API pública para integrações com ERP
- [ ] Painel super-admin (visão de todos os tenants)
- [ ] Programa de afiliados

---

## Métricas de Sucesso (KPIs do SaaS)

| Métrica | Meta Mês 3 | Meta Mês 6 | Meta Mês 12 |
|---|---|---|---|
| MRR (Receita Mensal Recorrente) | R$ 2.000 | R$ 8.000 | R$ 25.000 |
| Tenants ativos | 10 | 30 | 80 |
| Churn mensal | < 5% | < 3% | < 2% |
| Trial to Paid | > 20% | > 30% | > 35% |
| NPS | > 40 | > 50 | > 60 |

---

## Premissas Técnicas

1. **Multi-tenant primeiro**: toda feature nasce com `tenant_id`
2. **Mobile-first**: todo componente testado em 375px de largura
3. **Performance**: Core Web Vitals verde desde o início
4. **Segurança**: RLS ativo, validação no servidor, sem dados expostos
5. **Observabilidade**: logs estruturados, métricas de uso por tenant
