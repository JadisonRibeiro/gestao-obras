import { HardHat } from "lucide-react";

import { cn } from "@/lib/utils";
import { SITE } from "@/config/site";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
}

/** Marca do ObraFlow: monograma + wordmark. */
export function Logo({
  className,
  iconClassName,
  textClassName,
  showText = true,
}: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-sm ring-1 ring-black/5",
          iconClassName
        )}
      >
        <HardHat className="h-5 w-5" />
      </span>
      {showText && (
        <span
          className={cn(
            "font-heading text-lg font-bold tracking-tight",
            textClassName
          )}
        >
          {SITE.name}
        </span>
      )}
    </span>
  );
}
