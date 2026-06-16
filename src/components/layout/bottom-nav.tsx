"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { BOTTOM_NAV_ITEMS } from "@/config/nav";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarBrand } from "@/components/layout/sidebar";

/**
 * Bottom navigation visível apenas no mobile (PWA). Mostra os módulos
 * principais e um botão "Menu" que abre a navegação completa.
 */
export function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch border-t bg-card md:hidden"
      aria-label="Navegação rápida"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {BOTTOM_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <button
            className="flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-muted-foreground transition-colors"
            aria-label="Abrir menu completo"
          >
            <Menu className="h-5 w-5" />
            <span>Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-72 border-none bg-[#0c1c43] p-0 text-white"
        >
          <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
          <SidebarBrand />
          <div className="overflow-y-auto">
            <SidebarNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
