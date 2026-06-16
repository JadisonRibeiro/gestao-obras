"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createFornecedorAction,
  updateFornecedorAction,
} from "@/app/(dashboard)/fornecedores/actions";
import {
  fornecedorSchema,
  type FornecedorInput,
  type FornecedorFormValues,
} from "@/lib/validations/fornecedor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

interface FornecedorFormProps {
  fornecedorId?: string;
  defaultValues?: Partial<FornecedorFormValues>;
}

export function FornecedorForm({
  fornecedorId,
  defaultValues,
}: FornecedorFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FornecedorFormValues, unknown, FornecedorInput>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: { name: "", ...defaultValues },
  });

  const onSubmit = (values: FornecedorInput) => {
    setFormError(null);
    startTransition(async () => {
      const result = fornecedorId
        ? await updateFornecedorAction(fornecedorId, values)
        : await createFornecedorAction(values);
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
              <Label htmlFor="name">Nome / Razão social *</Label>
              <Input id="name" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" {...register("cnpj")} />
              <FieldError message={errors.cnpj?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                placeholder="Ex.: Material elétrico"
                {...register("category")}
              />
              <FieldError message={errors.category?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} />
              <FieldError message={errors.phone?.message} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} />
                <FieldError message={errors.city?.message} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="state">UF</Label>
                <Input
                  id="state"
                  maxLength={2}
                  className="uppercase"
                  {...register("state")}
                />
                <FieldError message={errors.state?.message} />
              </div>
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
                : fornecedorId
                  ? "Salvar alterações"
                  : "Criar fornecedor"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/fornecedores")}
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
