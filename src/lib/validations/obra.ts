import { z } from "zod";

export const OBRA_TYPES = [
  "RESIDENCIAL",
  "COMERCIAL",
  "INDUSTRIAL",
  "INFRAESTRUTURA",
  "REFORMA",
  "OUTRO",
] as const;

export const OBRA_STATUSES = [
  "ORCAMENTO",
  "APROVADA",
  "EM_ANDAMENTO",
  "PARALISADA",
  "CONCLUIDA",
  "CANCELADA",
] as const;

export const OBRA_TYPE_LABELS: Record<(typeof OBRA_TYPES)[number], string> = {
  RESIDENCIAL: "Residencial",
  COMERCIAL: "Comercial",
  INDUSTRIAL: "Industrial",
  INFRAESTRUTURA: "Infraestrutura",
  REFORMA: "Reforma",
  OUTRO: "Outro",
};

export const OBRA_STATUS_LABELS: Record<
  (typeof OBRA_STATUSES)[number],
  string
> = {
  ORCAMENTO: "Orçamento",
  APROVADA: "Aprovada",
  EM_ANDAMENTO: "Em andamento",
  PARALISADA: "Paralisada",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
};

const optionalString = z
  .string()
  .trim()
  .max(255)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

export const obraSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome da obra")
    .max(160, "Nome muito longo"),
  code: optionalString,
  type: z.enum(OBRA_TYPES),
  status: z.enum(OBRA_STATUSES).default("ORCAMENTO"),
  description: optionalString,
  // Endereço
  street: optionalString,
  number: optionalString,
  city: z.string().trim().min(2, "Informe a cidade").max(120),
  state: z
    .string()
    .trim()
    .length(2, "UF deve ter 2 letras")
    .transform((v) => v.toUpperCase()),
  zip: optionalString,
  // Valores (campos vazios viram undefined antes da coerção)
  area: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().positive("Área inválida").optional()
  ),
  totalBudget: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().nonnegative("Orçamento inválido").optional()
  ),
});

/** Tipo de saída (após validação/transformação) — usado no servidor. */
export type ObraInput = z.output<typeof obraSchema>;
/** Tipo de entrada (valores do formulário, antes da transformação). */
export type ObraFormValues = z.input<typeof obraSchema>;
