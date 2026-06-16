-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'GESTOR', 'MESTRE_OBRA', 'VIEWER');

-- CreateEnum
CREATE TYPE "ObraStatus" AS ENUM ('ORCAMENTO', 'APROVADA', 'EM_ANDAMENTO', 'PARALISADA', 'CONCLUIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "ObraType" AS ENUM ('RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INFRAESTRUTURA', 'REFORMA', 'OUTRO');

-- CreateEnum
CREATE TYPE "ContaStatus" AS ENUM ('PENDENTE', 'PARCIALMENTE_PAGO', 'PAGO', 'VENCIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "PagamentoType" AS ENUM ('SAIDA', 'ENTRADA');

-- CreateEnum
CREATE TYPE "NotaType" AS ENUM ('ENTRADA', 'SAIDA', 'SERVICO');

-- CreateEnum
CREATE TYPE "NotaStatus" AS ENUM ('PENDENTE', 'VINCULADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "ContratoType" AS ENUM ('FORNECEDOR', 'CLIENTE', 'SUBEMPREITEIRO');

-- CreateEnum
CREATE TYPE "ContratoStatus" AS ENUM ('ATIVO', 'SUSPENSO', 'ENCERRADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MedicaoStatus" AS ENUM ('PENDENTE', 'APROVADA', 'FATURADA', 'PAGA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "OrcamentoStatus" AS ENUM ('RASCUNHO', 'APROVADO', 'REVISAO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EtapaStatus" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'ATRASADA', 'PARALISADA');

-- CreateEnum
CREATE TYPE "MovimentacaoType" AS ENUM ('ENTRADA', 'SAIDA', 'TRANSFERENCIA', 'PERDA');

-- CreateEnum
CREATE TYPE "Weather" AS ENUM ('BOM', 'NUBLADO', 'CHUVOSO', 'MUITO_QUENTE', 'COM_VENTO');

-- CreateEnum
CREATE TYPE "CategoriaType" AS ENUM ('DESPESA', 'RECEITA');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "logoUrl" TEXT,
    "address" JSONB,
    "planId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "trialEndsAt" TIMESTAMP(3),
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "priceMonthly" DOUBLE PRECISION NOT NULL,
    "maxObras" INTEGER,
    "maxUsers" INTEGER,
    "maxStorageGb" INTEGER,
    "stripePriceId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "features" JSONB NOT NULL,

    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obras" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "gestorId" TEXT,
    "clienteId" TEXT,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "description" TEXT,
    "type" "ObraType" NOT NULL DEFAULT 'RESIDENCIAL',
    "status" "ObraStatus" NOT NULL DEFAULT 'ORCAMENTO',
    "address" JSONB NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "area" DOUBLE PRECISION,
    "totalBudget" DOUBLE PRECISION,
    "totalCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_pagar" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "fornecedorId" TEXT,
    "categoriaId" TEXT,
    "notaFiscalId" TEXT,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "ContaStatus" NOT NULL DEFAULT 'PENDENTE',
    "paymentMethod" TEXT,
    "notes" TEXT,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_pagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_receber" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "clienteId" TEXT,
    "categoriaId" TEXT,
    "medicaoId" TEXT,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "status" "ContaStatus" NOT NULL DEFAULT 'PENDENTE',
    "notes" TEXT,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contas_receber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "type" "PagamentoType" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,
    "receipt" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parcelas" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contaPagarId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "status" "ContaStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "parcelas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notas_fiscais" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "lancadoPorId" TEXT,
    "fornecedorId" TEXT,
    "number" TEXT NOT NULL,
    "series" TEXT,
    "type" "NotaType" NOT NULL DEFAULT 'ENTRADA',
    "issueDate" TIMESTAMP(3) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "taxAmount" DOUBLE PRECISION,
    "fileUrl" TEXT,
    "xmlData" JSONB,
    "status" "NotaStatus" NOT NULL DEFAULT 'PENDENTE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notas_fiscais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "fornecedorId" TEXT,
    "clienteId" TEXT,
    "type" "ContratoType" NOT NULL,
    "number" TEXT,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "ContratoStatus" NOT NULL DEFAULT 'ATIVO',
    "fileUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicoes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "contratoId" TEXT,
    "number" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "status" "MedicaoStatus" NOT NULL DEFAULT 'PENDENTE',
    "notes" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamentos" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL,
    "bdi" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "OrcamentoStatus" NOT NULL DEFAULT 'RASCUNHO',
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orcamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orcamento_itens" (
    "id" TEXT NOT NULL,
    "orcamentoId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "orcamento_itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cronograma_etapas" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "EtapaStatus" NOT NULL DEFAULT 'PENDENTE',
    "order" INTEGER NOT NULL,
    "parentId" TEXT,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cronograma_etapas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimentacoes_estoque" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "fornecedorId" TEXT,
    "material" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unitPrice" DOUBLE PRECISION,
    "total" DOUBLE PRECISION,
    "type" "MovimentacaoType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimentacoes_estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rdo" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "obraId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "weather" "Weather" NOT NULL DEFAULT 'BOM',
    "temperature" DOUBLE PRECISION,
    "workers" INTEGER NOT NULL DEFAULT 0,
    "activities" TEXT NOT NULL,
    "occurrences" TEXT,
    "photos" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rdo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpfCnpj" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" JSONB,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fornecedores" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnpj" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" JSONB,
    "category" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fornecedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoriaType" NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_cnpj_key" ON "tenants"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_email_key" ON "tenants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_stripeCustomerId_key" ON "tenants"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_stripeSubscriptionId_key" ON "tenants"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "plans_slug_key" ON "plans"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "plans_stripePriceId_key" ON "plans"("stripePriceId");

-- CreateIndex
CREATE UNIQUE INDEX "users_authId_key" ON "users"("authId");

-- CreateIndex
CREATE UNIQUE INDEX "users_tenantId_email_key" ON "users"("tenantId", "email");

-- CreateIndex
CREATE INDEX "obras_tenantId_idx" ON "obras"("tenantId");

-- CreateIndex
CREATE INDEX "obras_tenantId_status_idx" ON "obras"("tenantId", "status");

-- CreateIndex
CREATE INDEX "contas_pagar_tenantId_idx" ON "contas_pagar"("tenantId");

-- CreateIndex
CREATE INDEX "contas_pagar_tenantId_obraId_idx" ON "contas_pagar"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "contas_pagar_tenantId_status_idx" ON "contas_pagar"("tenantId", "status");

-- CreateIndex
CREATE INDEX "contas_pagar_tenantId_dueDate_idx" ON "contas_pagar"("tenantId", "dueDate");

-- CreateIndex
CREATE INDEX "contas_receber_tenantId_idx" ON "contas_receber"("tenantId");

-- CreateIndex
CREATE INDEX "contas_receber_tenantId_obraId_idx" ON "contas_receber"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "contas_receber_tenantId_status_idx" ON "contas_receber"("tenantId", "status");

-- CreateIndex
CREATE INDEX "contas_receber_tenantId_dueDate_idx" ON "contas_receber"("tenantId", "dueDate");

-- CreateIndex
CREATE INDEX "pagamentos_tenantId_idx" ON "pagamentos"("tenantId");

-- CreateIndex
CREATE INDEX "pagamentos_tenantId_obraId_idx" ON "pagamentos"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "parcelas_tenantId_idx" ON "parcelas"("tenantId");

-- CreateIndex
CREATE INDEX "notas_fiscais_tenantId_idx" ON "notas_fiscais"("tenantId");

-- CreateIndex
CREATE INDEX "notas_fiscais_tenantId_obraId_idx" ON "notas_fiscais"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "contratos_tenantId_idx" ON "contratos"("tenantId");

-- CreateIndex
CREATE INDEX "contratos_tenantId_obraId_idx" ON "contratos"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "medicoes_tenantId_idx" ON "medicoes"("tenantId");

-- CreateIndex
CREATE INDEX "medicoes_tenantId_obraId_idx" ON "medicoes"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "orcamentos_tenantId_idx" ON "orcamentos"("tenantId");

-- CreateIndex
CREATE INDEX "cronograma_etapas_tenantId_idx" ON "cronograma_etapas"("tenantId");

-- CreateIndex
CREATE INDEX "cronograma_etapas_tenantId_obraId_idx" ON "cronograma_etapas"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "movimentacoes_estoque_tenantId_idx" ON "movimentacoes_estoque"("tenantId");

-- CreateIndex
CREATE INDEX "movimentacoes_estoque_tenantId_obraId_idx" ON "movimentacoes_estoque"("tenantId", "obraId");

-- CreateIndex
CREATE INDEX "rdo_tenantId_idx" ON "rdo"("tenantId");

-- CreateIndex
CREATE INDEX "rdo_tenantId_obraId_idx" ON "rdo"("tenantId", "obraId");

-- CreateIndex
CREATE UNIQUE INDEX "rdo_obraId_date_key" ON "rdo"("obraId", "date");

-- CreateIndex
CREATE INDEX "clientes_tenantId_idx" ON "clientes"("tenantId");

-- CreateIndex
CREATE INDEX "fornecedores_tenantId_idx" ON "fornecedores"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_tenantId_name_type_key" ON "categorias"("tenantId", "name", "type");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_planId_fkey" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_gestorId_fkey" FOREIGN KEY ("gestorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obras" ADD CONSTRAINT "obras_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_pagar" ADD CONSTRAINT "contas_pagar_notaFiscalId_fkey" FOREIGN KEY ("notaFiscalId") REFERENCES "notas_fiscais"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_medicaoId_fkey" FOREIGN KEY ("medicaoId") REFERENCES "medicoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parcelas" ADD CONSTRAINT "parcelas_contaPagarId_fkey" FOREIGN KEY ("contaPagarId") REFERENCES "contas_pagar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_lancadoPorId_fkey" FOREIGN KEY ("lancadoPorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notas_fiscais" ADD CONSTRAINT "notas_fiscais_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicoes" ADD CONSTRAINT "medicoes_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "contratos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamentos" ADD CONSTRAINT "orcamentos_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orcamento_itens" ADD CONSTRAINT "orcamento_itens_orcamentoId_fkey" FOREIGN KEY ("orcamentoId") REFERENCES "orcamentos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cronograma_etapas" ADD CONSTRAINT "cronograma_etapas_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimentacoes_estoque" ADD CONSTRAINT "movimentacoes_estoque_fornecedorId_fkey" FOREIGN KEY ("fornecedorId") REFERENCES "fornecedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rdo" ADD CONSTRAINT "rdo_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rdo" ADD CONSTRAINT "rdo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fornecedores" ADD CONSTRAINT "fornecedores_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
