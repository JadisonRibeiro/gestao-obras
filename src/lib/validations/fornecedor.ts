import { z } from "zod";
import { optionalString, optionalEmail, optionalUf } from "./helpers";

export const fornecedorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome")
    .max(160, "Nome muito longo"),
  cnpj: optionalString,
  category: optionalString,
  email: optionalEmail,
  phone: optionalString,
  city: optionalString,
  state: optionalUf,
  notes: optionalString,
});

export type FornecedorInput = z.output<typeof fornecedorSchema>;
export type FornecedorFormValues = z.input<typeof fornecedorSchema>;
