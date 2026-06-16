"use client";

import { useTransition } from "react";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarkPaidButtonProps {
  action: () => Promise<{ error?: string } | void>;
  label?: string;
}

/** Botão de marcação rápida (pago/recebido) em uma linha da tabela. */
export function MarkPaidButton({
  action,
  label = "Marcar como pago",
}: MarkPaidButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-success hover:text-success"
          disabled={isPending}
          aria-label={label}
          onClick={() =>
            startTransition(() => {
              void action();
            })
          }
        >
          <CircleCheck className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
