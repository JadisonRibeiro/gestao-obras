import { z } from "zod";
import { optionalString } from "./helpers";

export const CONTRATO_TYPES = [
  "FORNECEDOR",
  "CLIENTE",
  "SUBEMPREITEIRO",
] as const;
export const CONTRATO_STATUSES = [
  "ATIVO",
  "SUSPENSO",
  "ENCERRADO",
  "CANCELADO",
] as const;

export const CONTRATO_TYPE_LABELS: Record<
  (typeof CONTRATO_TYPES)[number],
  string
> = {
  FORNECEDOR: "Fornecedor",
  CLIENTE: "Cliente",
  SUBEMPREITEIRO: "Subempreiteiro",
};

export const CONTRATO_STATUS_LABELS: Record<
  (typeof CONTRATO_STATUSES)[number],
  string
> = {
  ATIVO: "Ativo",
  SUSPENSO: "Suspenso",
  ENCERRADO: "Encerrado",
  CANCELADO: "Cancelado",
};

export const contratoSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  type: z.enum(CONTRATO_TYPES),
  fornecedorId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  clienteId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  number: optionalString,
  description: z
    .string()
    .trim()
    .min(2, "Informe a descrição")
    .max(200, "Descrição muito longa"),
  amount: z
    .number({ error: "Informe o valor" })
    .positive("Valor deve ser maior que zero"),
  startDate: z.coerce.date({ error: "Informe a data de início" }),
  endDate: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.date().optional()
  ),
  status: z.enum(CONTRATO_STATUSES).default("ATIVO"),
  notes: optionalString,
});

export type ContratoInput = z.output<typeof contratoSchema>;
export type ContratoFormValues = z.input<typeof contratoSchema>;
