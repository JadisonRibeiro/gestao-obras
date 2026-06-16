import { z } from "zod";
import { optionalString } from "./helpers";
import { CONTA_STATUSES } from "@/lib/finance";

export const contaPagarSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  fornecedorId: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  description: z
    .string()
    .trim()
    .min(2, "Informe a descrição")
    .max(200, "Descrição muito longa"),
  amount: z
    .number({ error: "Informe o valor" })
    .positive("Valor deve ser maior que zero"),
  dueDate: z.coerce.date({ error: "Informe o vencimento" }),
  status: z.enum(CONTA_STATUSES).default("PENDENTE"),
  paymentMethod: optionalString,
  notes: optionalString,
});

export type ContaPagarInput = z.output<typeof contaPagarSchema>;
export type ContaPagarFormValues = z.input<typeof contaPagarSchema>;
