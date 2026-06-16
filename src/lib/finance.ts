import type { ContaStatus } from "@prisma/client";

export const CONTA_STATUSES = [
  "PENDENTE",
  "PARCIALMENTE_PAGO",
  "PAGO",
  "VENCIDO",
  "CANCELADO",
] as const;

export const CONTA_STATUS_LABELS: Record<ContaStatus, string> = {
  PENDENTE: "Pendente",
  PARCIALMENTE_PAGO: "Parcial",
  PAGO: "Pago",
  VENCIDO: "Vencido",
  CANCELADO: "Cancelado",
};

/**
 * Status efetivo para exibição: marca como VENCIDO contas pendentes cujo
 * vencimento já passou (o status armazenado não é atualizado em tempo real).
 */
export function effectiveStatus(conta: {
  status: ContaStatus;
  dueDate: Date;
}): ContaStatus {
  if (
    (conta.status === "PENDENTE" || conta.status === "PARCIALMENTE_PAGO") &&
    conta.dueDate.getTime() < Date.now()
  ) {
    return "VENCIDO";
  }
  return conta.status;
}
