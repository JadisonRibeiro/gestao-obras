"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  placeholder?: string;
}

/** Busca instantânea (debounce) que sincroniza com o query param `q`. */
export function SearchInput({ placeholder = "Buscar..." }: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(
        Array.from(searchParams.entries())
      );
      if (value) params.set("q", value);
      else params.delete("q");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  );
}
