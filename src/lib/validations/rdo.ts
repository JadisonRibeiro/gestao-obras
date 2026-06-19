import { z } from "zod";
import { optionalString } from "./helpers";

export const WEATHER_TYPES = [
  "BOM",
  "NUBLADO",
  "CHUVOSO",
  "MUITO_QUENTE",
  "COM_VENTO",
] as const;

export const WEATHER_LABELS: Record<(typeof WEATHER_TYPES)[number], string> = {
  BOM: "Bom",
  NUBLADO: "Nublado",
  CHUVOSO: "Chuvoso",
  MUITO_QUENTE: "Muito quente",
  COM_VENTO: "Com vento",
};

export const rdoSchema = z.object({
  obraId: z.string().min(1, "Selecione a obra"),
  date: z.coerce.date({ error: "Informe a data" }),
  weather: z.enum(WEATHER_TYPES).default("BOM"),
  temperature: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.coerce.number().optional()
  ),
  workers: z.coerce.number().int().min(0, "Valor inválido").default(0),
  activities: z
    .string()
    .trim()
    .min(2, "Descreva as atividades do dia")
    .max(2000),
  occurrences: optionalString,
});

export type RdoInput = z.output<typeof rdoSchema>;
export type RdoFormValues = z.input<typeof rdoSchema>;
