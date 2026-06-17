"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createPagamentoAction,
  updatePagamentoAction,
} from "@/app/(dashboard)/financeiro/pagamentos/actions";
import {
  pagamentoSchema,
  type PagamentoInput,
  type PagamentoFormValues,
  PAGAMENTO_TYPES,
  PAGAMENTO_TYPE_LABELS,
} from "@/lib/validations/pagamento";
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

interface PagamentoFormProps {
  obras: Option[];
  pagamentoId?: string;
  defaultValues?: Partial<PagamentoFormValues>;
}

export function PagamentoForm({
  obras,
  pagamentoId,
  defaultValues,
}: PagamentoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PagamentoFormValues, unknown, PagamentoInput>({
    resolver: zodResolver(pagamentoSchema),
    defaultValues: { type: "SAIDA", ...defaultValues },
  });

  const onSubmit = (values: PagamentoInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = pagamentoId
        ? await updatePagamentoAction(pagamentoId, values)
        : await createPagamentoAction(values);
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
                placeholder="Ex.: Pagamento de empreiteiro"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="type">Tipo *</Label>
              <select id="type" className={selectClass} {...register("type")}>
                {PAGAMENTO_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {PAGAMENTO_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
              <FieldError message={errors.type?.message} />
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
              <Label htmlFor="paidAt">Data *</Label>
              <Input id="paidAt" type="date" {...register("paidAt")} />
              <FieldError message={errors.paidAt?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod">Forma de pagamento</Label>
              <Input
                id="paymentMethod"
                placeholder="PIX, boleto, dinheiro..."
                {...register("paymentMethod")}
              />
              <FieldError message={errors.paymentMethod?.message} />
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
                : pagamentoId
                  ? "Salvar alterações"
                  : "Registrar pagamento"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/financeiro/pagamentos")}
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
