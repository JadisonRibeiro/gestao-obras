"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createObraAction,
  updateObraAction,
} from "@/app/(dashboard)/obras/actions";
import {
  obraSchema,
  type ObraInput,
  type ObraFormValues,
  OBRA_TYPES,
  OBRA_STATUSES,
  OBRA_TYPE_LABELS,
  OBRA_STATUS_LABELS,
} from "@/lib/validations/obra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

interface ObraFormProps {
  obraId?: string;
  defaultValues?: Partial<ObraFormValues>;
}

export function ObraForm({ obraId, defaultValues }: ObraFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ObraFormValues, unknown, ObraInput>({
    resolver: zodResolver(obraSchema),
    defaultValues: { type: "RESIDENCIAL", status: "ORCAMENTO", ...defaultValues },
  });

  const onSubmit = (values: ObraInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = obraId
        ? await updateObraAction(obraId, values)
        : await createObraAction(values);
      if (result?.error) setFormError(result.error);
      // Sucesso: a action redireciona.
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Nome da obra *</Label>
              <Input
                id="name"
                placeholder="Ex.: Residencial Aurora"
                {...register("name")}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="code">Código interno</Label>
              <Input id="code" placeholder="OB-2026-001" {...register("code")} />
              <FieldError message={errors.code?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Tipo *</Label>
              <select id="type" className={selectClass} {...register("type")}>
                {OBRA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {OBRA_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.type?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className={selectClass}
                {...register("status")}
              >
                {OBRA_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {OBRA_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.status?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                type="number"
                step="0.01"
                min="0"
                placeholder="0"
                {...register("area")}
              />
              <FieldError message={errors.area?.message} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Observações sobre a obra"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Endereço
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="street">Logradouro</Label>
                <Input id="street" {...register("street")} />
                <FieldError message={errors.street?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register("number")} />
                <FieldError message={errors.number?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">Cidade *</Label>
                <Input id="city" {...register("city")} />
                <FieldError message={errors.city?.message} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="state">UF *</Label>
                  <Input
                    id="state"
                    maxLength={2}
                    placeholder="SP"
                    className="uppercase"
                    {...register("state")}
                  />
                  <FieldError message={errors.state?.message} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip">CEP</Label>
                  <Input id="zip" placeholder="00000-000" {...register("zip")} />
                  <FieldError message={errors.zip?.message} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 sm:max-w-xs">
            <Label htmlFor="totalBudget">Orçamento total (R$)</Label>
            <Input
              id="totalBudget"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("totalBudget")}
            />
            <FieldError message={errors.totalBudget?.message} />
          </div>

          <div className={cn("flex items-center gap-3 pt-2")}>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Salvando..."
                : obraId
                  ? "Salvar alterações"
                  : "Criar obra"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/obras")}
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
