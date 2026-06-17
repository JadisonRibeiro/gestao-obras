import { z } from "zod";
import { optionalString } from "./helpers";
import { CONTA_STATUSES } from "@/lib/finance";

export const contaReceberSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  clienteId: z
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
  notes: optionalString,
});

export type ContaReceberInput = z.output<typeof contaReceberSchema>;
export type ContaReceberFormValues = z.input<typeof contaReceberSchema>;
