import { z } from "zod";
import { optionalString } from "./helpers";

export const PAGAMENTO_TYPES = ["ENTRADA", "SAIDA"] as const;

export const PAGAMENTO_TYPE_LABELS: Record<
  (typeof PAGAMENTO_TYPES)[number],
  string
> = {
  ENTRADA: "Entrada",
  SAIDA: "Saída",
};

export const pagamentoSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  type: z.enum(PAGAMENTO_TYPES),
  description: z
    .string()
    .trim()
    .min(2, "Informe a descrição")
    .max(200, "Descrição muito longa"),
  amount: z
    .number({ error: "Informe o valor" })
    .positive("Valor deve ser maior que zero"),
  paidAt: z.coerce.date({ error: "Informe a data" }),
  paymentMethod: optionalString,
  notes: optionalString,
});

export type PagamentoInput = z.output<typeof pagamentoSchema>;
export type PagamentoFormValues = z.input<typeof pagamentoSchema>;
