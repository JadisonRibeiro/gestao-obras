"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function formatDisplay(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {
  value?: number;
  onChange?: (value: number | undefined) => void;
}

/**
 * Input de moeda em BRL. O usuário digita apenas números e o valor é
 * interpretado em centavos (ex.: "12345" → R$ 1.234,56). Use com o
 * `Controller` do react-hook-form.
 */
export const CurrencyInput = React.forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(({ value, onChange, className, ...props }, ref) => {
  const [display, setDisplay] = React.useState(
    value != null ? formatDisplay(value) : ""
  );

  React.useEffect(() => {
    setDisplay(value != null ? formatDisplay(value) : "");
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setDisplay("");
      onChange?.(undefined);
      return;
    }
    const num = parseInt(digits, 10) / 100;
    setDisplay(formatDisplay(num));
    onChange?.(num);
  };

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        R$
      </span>
      <input
        ref={ref}
        inputMode="numeric"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background py-2 pl-9 pr-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        value={display}
        onChange={handleChange}
        placeholder="0,00"
        {...props}
      />
    </div>
  );
});
CurrencyInput.displayName = "CurrencyInput";
