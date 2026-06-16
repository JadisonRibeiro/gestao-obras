import { z } from "zod";
import { optionalString, optionalEmail, optionalUf } from "./helpers";

export const clienteSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome")
    .max(160, "Nome muito longo"),
  cpfCnpj: optionalString,
  email: optionalEmail,
  phone: optionalString,
  city: optionalString,
  state: optionalUf,
  notes: optionalString,
});

export type ClienteInput = z.output<typeof clienteSchema>;
export type ClienteFormValues = z.input<typeof clienteSchema>;
