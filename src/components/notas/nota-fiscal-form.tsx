"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createNotaFiscalAction,
  updateNotaFiscalAction,
} from "@/app/(dashboard)/notas-fiscais/actions";
import {
  notaFiscalSchema,
  type NotaFiscalInput,
  type NotaFiscalFormValues,
  NOTA_TYPES,
  NOTA_TYPE_LABELS,
  NOTA_STATUSES,
  NOTA_STATUS_LABELS,
} from "@/lib/validations/nota-fiscal";
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

interface NotaFiscalFormProps {
  obras: Option[];
  fornecedores: Option[];
  notaId?: string;
  defaultValues?: Partial<NotaFiscalFormValues>;
}

export function NotaFiscalForm({
  obras,
  fornecedores,
  notaId,
  defaultValues,
}: NotaFiscalFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<NotaFiscalFormValues, unknown, NotaFiscalInput>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: { type: "ENTRADA", status: "PENDENTE", ...defaultValues },
  });

  const onSubmit = (values: NotaFiscalInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = notaId
        ? await updateNotaFiscalAction(notaId, values)
        : await createNotaFiscalAction(values);
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
              <Label htmlFor="number">Número da NF *</Label>
              <Input id="number" {...register("number")} />
              <FieldError message={errors.number?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="series">Série</Label>
              <Input id="series" {...register("series")} />
              <FieldError message={errors.series?.message} />
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

            <div className="space-y-1.5">
              <Label htmlFor="type">Tipo *</Label>
              <select id="type" className={selectClass} {...register("type")}>
                {NOTA_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {NOTA_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.type?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="issueDate">Emissão *</Label>
              <Input id="issueDate" type="date" {...register("issueDate")} />
              <FieldError message={errors.issueDate?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="totalAmount">Valor total *</Label>
              <Controller
                control={control}
                name="totalAmount"
                render={({ field }) => (
                  <CurrencyInput
                    id="totalAmount"
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={errors.totalAmount?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="taxAmount">Impostos</Label>
              <Controller
                control={control}
                name="taxAmount"
                render={({ field }) => (
                  <CurrencyInput
                    id="taxAmount"
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={errors.taxAmount?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" className={selectClass} {...register("status")}>
                {NOTA_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {NOTA_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.status?.message} />
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
                : notaId
                  ? "Salvar alterações"
                  : "Lançar nota"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/notas-fiscais")}
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
