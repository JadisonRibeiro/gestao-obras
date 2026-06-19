import { z } from "zod";
import { optionalString } from "./helpers";

export const MOVIMENTACAO_TYPES = [
  "ENTRADA",
  "SAIDA",
  "TRANSFERENCIA",
  "PERDA",
] as const;

export const MOVIMENTACAO_TYPE_LABELS: Record<
  (typeof MOVIMENTACAO_TYPES)[number],
  string
> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  TRANSFERENCIA: "Transferência",
  PERDA: "Perda",
};

export const movimentacaoSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  fornecedorId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  material: z.string().trim().min(2, "Informe o material").max(160),
  unit: z.string().trim().min(1, "Informe a unidade").max(20),
  quantity: z.coerce.number().positive("Quantidade inválida"),
  unitPrice: z.number().nonnegative("Valor inválido").optional(),
  type: z.enum(MOVIMENTACAO_TYPES),
  date: z.coerce.date({ error: "Informe a data" }),
  notes: optionalString,
});

export type MovimentacaoInput = z.output<typeof movimentacaoSchema>;
export type MovimentacaoFormValues = z.input<typeof movimentacaoSchema>;
