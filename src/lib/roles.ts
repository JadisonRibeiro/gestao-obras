import type { UserRole } from "@prisma/client";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Administrador",
  GESTOR: "Gestor",
  MESTRE_OBRA: "Mestre de obra",
  VIEWER: "Visualizador",
};

export const USER_ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  ADMIN: "Acesso total, incluindo plano e cobrança.",
  GESTOR: "Gerencia obras, cadastros e financeiro.",
  MESTRE_OBRA: "Acesso a RDO e estoque.",
  VIEWER: "Apenas visualização.",
};
