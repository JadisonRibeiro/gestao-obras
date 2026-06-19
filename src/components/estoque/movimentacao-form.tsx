"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createMovimentacaoAction,
  updateMovimentacaoAction,
} from "@/app/(dashboard)/estoque/actions";
import {
  movimentacaoSchema,
  type MovimentacaoInput,
  type MovimentacaoFormValues,
  MOVIMENTACAO_TYPES,
  MOVIMENTACAO_TYPE_LABELS,
} from "@/lib/validations/estoque";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";

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

interface MovimentacaoFormProps {
  obras: Option[];
  fornecedores: Option[];
  movimentacaoId?: string;
  defaultValues?: Partial<MovimentacaoFormValues>;
}

export function MovimentacaoForm({
  obras,
  fornecedores,
  movimentacaoId,
  defaultValues,
}: MovimentacaoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MovimentacaoFormValues, unknown, MovimentacaoInput>({
    resolver: zodResolver(movimentacaoSchema),
    defaultValues: { type: "ENTRADA", unit: "un", ...defaultValues },
  });

  const onSubmit = (values: MovimentacaoInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = movimentacaoId
        ? await updateMovimentacaoAction(movimentacaoId, values)
        : await createMovimentacaoAction(values);
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
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="material">Material *</Label>
              <Input
                id="material"
                placeholder="Ex.: Cimento CP-II 50kg"
                {...register("material")}
              />
              <FieldError message={errors.material?.message} />
            </div>

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
              <Label htmlFor="type">Tipo *</Label>
              <select id="type" className={selectClass} {...register("type")}>
                {MOVIMENTACAO_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {MOVIMENTACAO_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.type?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register("quantity")}
                />
                <FieldError message={errors.quantity?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="unit">Unidade *</Label>
                <Input id="unit" placeholder="un, kg, m²..." {...register("unit")} />
                <FieldError message={errors.unit?.message} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="unitPrice">Preço unitário</Label>
              <Controller
                control={control}
                name="unitPrice"
                render={({ field }) => (
                  <CurrencyInput
                    id="unitPrice"
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={errors.unitPrice?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="date">Data *</Label>
              <Input id="date" type="date" {...register("date")} />
              <FieldError message={errors.date?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fornecedorId">Fornecedor</Label>
              <select
                id="fornecedorId"
                className={selectClass}
                {...register("fornecedorId")}
              >
                <option value="">— Nenhum —</option>
                {fornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.fornecedorId?.message} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Input id="notes" {...register("notes")} />
              <FieldError message={errors.notes?.message} />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Salvando..."
                : movimentacaoId
                  ? "Salvar alterações"
                  : "Registrar movimentação"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/estoque")}
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
