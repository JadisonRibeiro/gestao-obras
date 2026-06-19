import { z } from "zod";
import { optionalString } from "./helpers";

export const NOTA_TYPES = ["ENTRADA", "SAIDA", "SERVICO"] as const;
export const NOTA_STATUSES = ["PENDENTE", "VINCULADA", "CANCELADA"] as const;

export const NOTA_TYPE_LABELS: Record<(typeof NOTA_TYPES)[number], string> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
  SERVICO: "Serviço",
};

export const NOTA_STATUS_LABELS: Record<
  (typeof NOTA_STATUSES)[number],
  string
> = {
  PENDENTE: "Pendente",
  VINCULADA: "Vinculada",
  CANCELADA: "Cancelada",
};

export const notaFiscalSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  fornecedorId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  number: z.string().trim().min(1, "Informe o número").max(60),
  series: optionalString,
  type: z.enum(NOTA_TYPES),
  issueDate: z.coerce.date({ error: "Informe a data de emissão" }),
  totalAmount: z
    .number({ error: "Informe o valor" })
    .positive("Valor deve ser maior que zero"),
  taxAmount: z.number().nonnegative("Valor inválido").optional(),
  status: z.enum(NOTA_STATUSES).default("PENDENTE"),
  notes: optionalString,
});

export type NotaFiscalInput = z.output<typeof notaFiscalSchema>;
export type NotaFiscalFormValues = z.input<typeof notaFiscalSchema>;
