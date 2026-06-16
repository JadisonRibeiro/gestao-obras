"use client";

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";

import { updateObraStatusAction } from "@/app/(dashboard)/obras/actions";
import { OBRA_STATUSES, OBRA_STATUS_LABELS } from "@/lib/validations/obra";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/shared/status-badge";

interface ObraStatusControlProps {
  obraId: string;
  status: string;
}

export function ObraStatusControl({ obraId, status }: ObraStatusControlProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const change = (next: string) => {
    if (next === status) return;
    setError(null);
    startTransition(async () => {
      const res = await updateObraStatusAction(obraId, next);
      if (res?.error) setError(res.error);
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            <StatusBadge status={status} />
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {OBRA_STATUSES.map((s) => (
            <DropdownMenuItem key={s} onSelect={() => change(s)}>
              {OBRA_STATUS_LABELS[s]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
