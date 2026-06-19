"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createContratoAction,
  updateContratoAction,
} from "@/app/(dashboard)/contratos/actions";
import {
  contratoSchema,
  type ContratoInput,
  type ContratoFormValues,
  CONTRATO_TYPES,
  CONTRATO_TYPE_LABELS,
  CONTRATO_STATUSES,
  CONTRATO_STATUS_LABELS,
} from "@/lib/validations/contrato";
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

interface ContratoFormProps {
  obras: Option[];
  fornecedores: Option[];
  clientes: Option[];
  contratoId?: string;
  defaultValues?: Partial<ContratoFormValues>;
}

export function ContratoForm({
  obras,
  fornecedores,
  clientes,
  contratoId,
  defaultValues,
}: ContratoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ContratoFormValues, unknown, ContratoInput>({
    resolver: zodResolver(contratoSchema),
    defaultValues: { type: "FORNECEDOR", status: "ATIVO", ...defaultValues },
  });

  const onSubmit = (values: ContratoInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = contratoId
        ? await updateContratoAction(contratoId, values)
        : await createContratoAction(values);
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
                placeholder="Ex.: Fornecimento de concreto usinado"
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
              <Label htmlFor="type">Tipo *</Label>
              <select id="type" className={selectClass} {...register("type")}>
                {CONTRATO_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {CONTRATO_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.type?.message} />
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
              <Label htmlFor="number">Número do contrato</Label>
              <Input id="number" {...register("number")} />
              <FieldError message={errors.number?.message} />
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
              <Label htmlFor="startDate">Início *</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              <FieldError message={errors.startDate?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="endDate">Término</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              <FieldError message={errors.endDate?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" className={selectClass} {...register("status")}>
                {CONTRATO_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {CONTRATO_STATUS_LABELS[s]}
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
                : contratoId
                  ? "Salvar alterações"
                  : "Criar contrato"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/contratos")}
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
