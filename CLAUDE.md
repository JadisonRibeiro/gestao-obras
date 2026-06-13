# CLAUDE.md — Sistema de Gestão de Obras (SaaS)

## 🎯 Visão do Produto
SaaS B2B de gestão de obras voltado para construtoras brasileiras.
Modelo de negócio: assinatura mensal recorrente com planos escalonáveis por número de obras ativas.
O sistema deve ser robusto, confiável e com UX impecável — o cliente paga todo mês e precisa sentir valor.

---

## 🏗️ Stack Tecnológica

| Camada | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 14+ |
| Linguagem | TypeScript | 5+ |
| UI Components | shadcn/ui | latest |
| Estilização | Tailwind CSS | 3+ |
| Banco de Dados | Supabase (PostgreSQL) | latest |
| ORM | Prisma | 5+ |
| Autenticação | Supabase Auth | latest |
| Storage | Supabase Storage | latest |
| Pagamentos | Stripe | latest |
| Deploy | Vercel | latest |
| Mobile | PWA (next-pwa) | latest |

---

## 🏛️ Arquitetura Multi-Tenant

### Modelo de Isolamento
- Isolamento por `tenant_id` em todas as tabelas
- Row Level Security (RLS) no Supabase em todas as tabelas sensíveis
- Cada construtora (tenant) enxerga APENAS seus próprios dados
- NUNCA retornar dados sem filtrar por `tenant_id`

### Hierarquia de dados
```
tenant (construtora)
├── users[]              ← usuários com roles (admin, gestor, visualizador)
├── obras[]
│   ├── contratos[]
│   ├── medicoes[]
│   ├── notas_fiscais[]
│   ├── contas_pagar[]
│   ├── contas_receber[]
│   ├── pagamentos[]
│   ├── orcamentos[]
│   ├── cronograma[]
│   ├── estoque[]
│   ├── rdo[]
│   └── equipe[]
├── fornecedores[]
├── clientes[]
└── plano_assinatura     ← integrado com Stripe
```

---

## 📦 Módulos do Sistema

### Módulos Core (MVP)
1. **Cadastro de Obras** — dados gerais, endereço, cliente, status, prazo, tipo
2. **Controle de Pagamentos** — cronograma financeiro vinculado à obra
3. **Contas a Pagar** — fornecedores, categoria, vencimento, status, arquivo
4. **Contas a Receber** — clientes, medições, faturas, status de recebimento
5. **Notas Fiscais** — upload XML/PDF, leitura automática de dados, vinculação à obra

### Módulos Diferenciais (pós-MVP)
6. **Orçamento de Obra** — composições, BDI, comparativo orçado vs realizado
7. **Cronograma Físico** — Gantt simplificado por etapa da obra
8. **Controle de Medições** — avanço físico % por etapa e contrato
9. **Gestão de Contratos** — contratos com fornecedores e clientes, vigência
10. **Controle de Estoque** — entrada/saída de materiais por obra
11. **RDO** — Registro Diário de Obra: clima, mão de obra, ocorrências, fotos
12. **Relatórios Gerenciais** — DRE por obra, margem, fluxo de caixa, desvios
13. **Gestão de Equipe** — cadastro de funcionários e terceirizados por obra
14. **Painel do Cliente** — portal para o cliente da construtora acompanhar a obra

### SaaS / Plataforma
15. **Onboarding** — fluxo guiado para nova construtora cadastrada
16. **Planos e Assinaturas** — integração Stripe, controle de limites por plano
17. **Multi-usuário com Roles** — admin, gestor, mestre de obra, visualizador
18. **Notificações** — vencimentos, pagamentos, alertas críticos

---

## 💳 Planos de Assinatura

| Plano | Obras Ativas | Usuários | Armazenamento |
|---|---|---|---|
| Starter | até 3 | até 3 | 5 GB |
| Pro | até 10 | até 10 | 20 GB |
| Enterprise | ilimitado | ilimitado | 100 GB |

- Limites verificados via middleware antes de qualquer criação de recurso
- Upgrade/downgrade gerenciado pelo Stripe Billing Portal
- Trial gratuito de 14 dias sem cartão

---

## 📁 Estrutura de Pastas

```
/
├── CLAUDE.md
├── README.md
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/
│   ├── icons/           ← PWA icons
│   └── manifest.json    ← PWA manifest
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── cadastro/
│   │   │   └── onboarding/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── obras/
│   │   │   ├── financeiro/
│   │   │   │   ├── contas-pagar/
│   │   │   │   ├── contas-receber/
│   │   │   │   └── pagamentos/
│   │   │   ├── notas-fiscais/
│   │   │   ├── contratos/
│   │   │   ├── estoque/
│   │   │   ├── rdo/
│   │   │   ├── relatorios/
│   │   │   ├── equipe/
│   │   │   └── configuracoes/
│   │   │       ├── plano/
│   │   │       └── usuarios/
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── stripe/
│   │   │   └── [...]/
│   │   ├── layout.tsx
│   │   └── page.tsx     ← landing page
│   ├── components/
│   │   ├── ui/          ← shadcn/ui (não editar manualmente)
│   │   ├── obras/
│   │   ├── financeiro/
│   │   ├── notas/
│   │   ├── relatorios/
│   │   └── shared/
│   │       ├── DataTable/
│   │       ├── PageHeader/
│   │       ├── StatusBadge/
│   │       ├── CurrencyInput/
│   │       └── FileUpload/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── stripe/
│   │   │   └── client.ts
│   │   ├── prisma.ts
│   │   └── utils.ts
│   ├── hooks/
│   ├── services/        ← lógica de negócio isolada
│   │   ├── obras.service.ts
│   │   ├── financeiro.service.ts
│   │   └── plano.service.ts
│   ├── types/
│   │   ├── database.ts  ← tipos gerados pelo Supabase
│   │   └── index.ts
│   └── middleware.ts    ← auth guard + verificação de plano
└── docs/
    ├── architecture.md
    ├── modules.md
    └── api.md
```

---

## 🧱 Padrões de Código

### Geral
- Linguagem dos identificadores: **inglês**
- Comentários, commits e docs: **português**
- TypeScript strict mode: **sempre ativado**
- Proibido uso de `any` — use `unknown` e faça type guard
- Proibido `console.log` em produção — use um logger centralizado

### Nomenclatura
| Tipo | Padrão | Exemplo |
|---|---|---|
| Variáveis e funções | camelCase | `fetchObras`, `totalPago` |
| Componentes e tipos | PascalCase | `ObraCard`, `ContaPagar` |
| Arquivos de componente | kebab-case | `obra-card.tsx` |
| Constantes globais | UPPER_SNAKE_CASE | `MAX_OBRAS_STARTER` |
| Tabelas do banco | snake_case | `contas_pagar`, `notas_fiscais` |

### Componentes React
- Sempre funcionais com hooks
- Props tipadas com interface, nunca `type` inline anônimo
- Separar lógica de UI: hooks customizados para lógica, componente só para render
- Componentes de página em `page.tsx`, lógica em `hooks/useNomeDaFeature.ts`

### Segurança (CRÍTICO)
- TODA query ao banco deve incluir `tenant_id` do usuário autenticado
- Verificar permissão de role antes de qualquer ação destrutiva
- Verificar limite do plano antes de criar obra/usuário
- Nunca expor `tenant_id` ou dados de outros tenants no cliente
- Validar e sanitizar todos os inputs (usar Zod)

### Validação de Dados
- Usar **Zod** para todos os schemas de validação
- Validação no servidor (Server Actions) sempre — nunca confiar só no frontend
- Formulários com **react-hook-form + zodResolver**

### Tratamento de Erros
- Nunca silenciar erros com catch vazio
- Erros de negócio retornam `{ success: false, error: string }`
- Erros inesperados vão para logger e retornam mensagem genérica ao usuário
- Toast de feedback para toda ação do usuário (sucesso, erro, loading)

---

## 🎨 Design System

### Identidade Visual
- Tema: profissional, sóbrio, confiável — voltado para gestores e engenheiros
- Tom: direto, técnico mas acessível
- Modo escuro: suportado nativamente via shadcn/ui

### Paleta de Cores (Tailwind + CSS Variables)
```css
--primary: #1E40AF       /* Azul construção — confiança, solidez */
--primary-foreground: #FFFFFF
--secondary: #F97316     /* Laranja construção — destaque, ação */
--success: #16A34A       /* Verde — aprovado, pago, concluído */
--warning: #D97706       /* Amarelo — atenção, pendente */
--danger: #DC2626        /* Vermelho — vencido, cancelado, erro */
--muted: #64748B         /* Cinza slate — textos secundários */
--background: #F8FAFC    /* Fundo geral */
--card: #FFFFFF
```

### Status Badges Padrão
| Status | Cor |
|---|---|
| Ativa / Pago / Concluído | success (verde) |
| Pendente / Em andamento | warning (amarelo) |
| Vencido / Cancelado | danger (vermelho) |
| Rascunho / Inativo | muted (cinza) |

### Tipografia
- Display/Headings: **Inter** (weight 600-700)
- Body: **Inter** (weight 400-500)
- Dados numéricos/tabelas: **JetBrains Mono** (monospace)

### Componentes Padrão
- Tabelas: sempre com paginação, busca e filtros
- Formulários: labels acima do campo, helper text abaixo, erro inline
- Valores monetários: sempre em BRL formatado (R$ 1.234,56)
- Datas: formato brasileiro (DD/MM/AAAA)
- Loading states: skeleton loaders, nunca spinner de página inteira

---

## 📱 PWA

- `manifest.json` com ícones em todos os tamanhos
- Service Worker para cache de assets estáticos
- Funcionar offline para leitura de dados já carregados
- Meta tags para instalação no iOS e Android
- Viewport configurado para não dar zoom em inputs (iOS)

---

## 🧪 Testes

- **Unitários**: funções de serviço, utils, cálculos financeiros (Vitest)
- **Integração**: fluxos críticos como criação de obra, lançamento de nota (Playwright)
- Prioridade de testes: cálculos financeiros > auth/permissões > CRUD básico

---

## 🔁 Git e Versionamento

### Branches
```
main          ← produção (protegida)
staging       ← homologação
develop       ← integração
feature/xyz   ← novas features
fix/xyz       ← correções
```

### Padrão de Commits (Conventional Commits)
```
feat: adiciona módulo de controle de estoque
fix: corrige cálculo de saldo em contas a pagar
refactor: extrai lógica de plano para serviço dedicado
docs: atualiza README com instruções de deploy
test: adiciona testes para service de medições
```

---

## ⚠️ Regras Absolutas (NUNCA violar)

1. **NUNCA** fazer query sem filtro de `tenant_id`
2. **NUNCA** usar `any` no TypeScript
3. **NUNCA** commitar secrets ou API keys
4. **NUNCA** criar obra/usuário sem verificar limite do plano
5. **NUNCA** expor stack trace ou erro interno ao usuário final
6. **NUNCA** modificar arquivos em `components/ui/` manualmente
7. **NUNCA** fazer lógica de negócio dentro de componentes de UI

---

## 🚀 Ordem de Desenvolvimento (Roadmap MVP)

### Fase 1 — Fundação
- [ ] Setup Next.js + TypeScript + Tailwind + shadcn/ui
- [ ] Configurar Supabase (auth, RLS, storage)
- [ ] Configurar Prisma + schema base
- [ ] Middleware de autenticação e tenant
- [ ] Layout do dashboard (sidebar, header, navegação)
- [ ] PWA manifest e service worker

### Fase 2 — Core do Produto
- [ ] Cadastro e listagem de obras
- [ ] Contas a pagar
- [ ] Contas a receber
- [ ] Controle de pagamentos
- [ ] Cadastro de notas fiscais + upload

### Fase 3 — SaaS
- [ ] Integração Stripe (planos, checkout, webhook)
- [ ] Página de planos e upgrade
- [ ] Multi-usuário com roles
- [ ] Onboarding de novo tenant
- [ ] Trial de 14 dias

### Fase 4 — Diferenciais
- [ ] Orçamento de obra
- [ ] Cronograma físico
- [ ] RDO (Registro Diário de Obra)
- [ ] Relatórios gerenciais
- [ ] Controle de estoque

### Fase 5 — Crescimento
- [ ] Portal do cliente (acesso externo)
- [ ] Notificações por email/WhatsApp
- [ ] App mobile PWA aprimorado
- [ ] Integrações (ERP, NFe, bancos)
