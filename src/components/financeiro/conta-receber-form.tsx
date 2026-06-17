"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createContaReceberAction,
  updateContaReceberAction,
} from "@/app/(dashboard)/financeiro/contas-receber/actions";
import {
  contaReceberSchema,
  type ContaReceberInput,
  type ContaReceberFormValues,
} from "@/lib/validations/conta-receber";
import { CONTA_STATUSES, CONTA_STATUS_LABELS } from "@/lib/finance";
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

interface ContaReceberFormProps {
  obras: Option[];
  clientes: Option[];
  contaId?: string;
  defaultValues?: Partial<ContaReceberFormValues>;
}

export function ContaReceberForm({
  obras,
  clientes,
  contaId,
  defaultValues,
}: ContaReceberFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContaReceberFormValues, unknown, ContaReceberInput>({
    resolver: zodResolver(contaReceberSchema),
    defaultValues: { status: "PENDENTE", ...defaultValues },
  });

  const onSubmit = (values: ContaReceberInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = contaId
        ? await updateContaReceberAction(contaId, values)
        : await createContaReceberAction(values);
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
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                placeholder="Ex.: Medição 01 — fundação"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
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
              <Label htmlFor="clienteId">Cliente</Label>
              <select
                id="clienteId"
                className={selectClass}
                {...register("clienteId")}
              >
                <option value="">— Nenhum —</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.clienteId?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor *</Label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <CurrencyInput
                    id="amount"
                    value={field.value as number | undefined}
                    onChange={field.onChange}
                  />
                )}
              />
              <FieldError message={errors.amount?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Vencimento *</Label>
              <Input id="dueDate" type="date" {...register("dueDate")} />
              <FieldError message={errors.dueDate?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" className={selectClass} {...register("status")}>
                {CONTA_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CONTA_STATUS_LABELS[s]}
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
                : contaId
                  ? "Salvar alterações"
                  : "Criar conta"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/financeiro/contas-receber")}
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
