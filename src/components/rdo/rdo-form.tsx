"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createRdoAction,
  updateRdoAction,
} from "@/app/(dashboard)/rdo/actions";
import {
  rdoSchema,
  type RdoInput,
  type RdoFormValues,
  WEATHER_TYPES,
  WEATHER_LABELS,
} from "@/lib/validations/rdo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

interface Option {
  id: string;
  name: string;
}

interface RdoFormProps {
  obras: Option[];
  rdoId?: string;
  defaultValues?: Partial<RdoFormValues>;
}

export function RdoForm({ obras, rdoId, defaultValues }: RdoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RdoFormValues, unknown, RdoInput>({
    resolver: zodResolver(rdoSchema),
    defaultValues: { weather: "BOM", workers: 0, ...defaultValues },
  });

  const onSubmit = (values: RdoInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = rdoId
        ? await updateRdoAction(rdoId, values)
        : await createRdoAction(values);
      if (result?.error) setFormError(result.error);
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {formError && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {formError}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="obraId">Obra *</Label>
              <select id="obraId" className={selectClass} {...register("obraId")}>
                <option value="">Selecione...</option>
                {obras.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.obraId?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Data *</Label>
              <Input id="date" type="date" {...register("date")} />
              <FieldError message={errors.date?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="weather">Clima</Label>
              <select id="weather" className={selectClass} {...register("weather")}>
                {WEATHER_TYPES.map((w) => (
                  <option key={w} value={w}>
                    {WEATHER_LABELS[w]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.weather?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="temperature">Temp. (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="1"
                  {...register("temperature")}
                />
                <FieldError message={errors.temperature?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="workers">Trabalhadores</Label>
                <Input
                  id="workers"
                  type="number"
                  min="0"
                  step="1"
                  {...register("workers")}
                />
                <FieldError message={errors.workers?.message} />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="activities">Atividades do dia *</Label>
              <Textarea
                id="activities"
                rows={4}
                placeholder="Descreva os serviços executados no dia..."
                {...register("activities")}
              />
              <FieldError message={errors.activities?.message} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="occurrences">Ocorrências</Label>
              <Textarea
                id="occurrences"
                rows={3}
                placeholder="Atrasos, problemas, visitas, etc. (opcional)"
                {...register("occurrences")}
              />
              <FieldError message={errors.occurrences?.message} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Salvando..."
                : rdoId
                  ? "Salvar alterações"
                  : "Registrar RDO"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/rdo")}
              disabled={isPending}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
