import { z } from "zod";

/** Texto opcional: string vazia vira undefined. */
export const optionalString = z
  .string()
  .trim()
  .max(255)
  .optional()
  .or(z.literal(""))
  .transform((v) => (v ? v : undefined));

/** E-mail opcional (valida formato apenas se preenchido). */
export const optionalEmail = z
  .string()
  .trim()
  .email("E-mail inválido")
  .or(z.literal(""))
  .optional()
  .transform((v) => (v ? v : undefined));

/** UF opcional (2 letras, maiúsculas). */
export const optionalUf = z
  .string()
  .trim()
  .toUpperCase()
  .length(2, "UF deve ter 2 letras")
  .or(z.literal(""))
  .optional()
  .transform((v) => (v ? v : undefined));
