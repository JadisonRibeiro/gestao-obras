import { Badge } from "@/components/ui/badge";

type BadgeVariant = "default" | "secondary" | "success" | "warning" | "destructive" | "outline";

/**
 * Mapeia status de negócio para a cor do badge, seguindo a convenção
 * do design system (verde = ok, amarelo = atenção, vermelho = erro).
 */
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  // success (verde)
  ativa: "success",
  ativo: "success",
  pago: "success",
  concluido: "success",
  concluida: "success",
  aprovado: "success",
  aprovada: "success",
  recebido: "success",
  vinculada: "success",
  // warning (amarelo)
  pendente: "warning",
  parcialmente_pago: "warning",
  em_andamento: "warning",
  "em andamento": "warning",
  paralisada: "warning",
  // destructive (vermelho)
  vencido: "destructive",
  cancelado: "destructive",
  cancelada: "destructive",
  atrasado: "destructive",
  // muted / neutro
  rascunho: "outline",
  orcamento: "outline",
  inativo: "outline",
  inativa: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  ativa: "Ativa",
  ativo: "Ativo",
  pago: "Pago",
  concluido: "Concluído",
  concluida: "Concluída",
  aprovado: "Aprovado",
  aprovada: "Aprovada",
  recebido: "Recebido",
  pendente: "Pendente",
  parcialmente_pago: "Parcial",
  em_andamento: "Em andamento",
  "em andamento": "Em andamento",
  paralisada: "Paralisada",
  vencido: "Vencido",
  cancelado: "Cancelado",
  cancelada: "Cancelada",
  atrasado: "Atrasado",
  rascunho: "Rascunho",
  orcamento: "Orçamento",
  inativo: "Inativo",
  inativa: "Inativa",
};

interface StatusBadgeProps {
  status: string;
  /** Sobrescreve o rótulo exibido. */
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const variant = STATUS_VARIANT[key] ?? "outline";
  const text = label ?? STATUS_LABEL[key] ?? status;

  return <Badge variant={variant}>{text}</Badge>;
}
