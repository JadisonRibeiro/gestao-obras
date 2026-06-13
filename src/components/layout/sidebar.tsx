import Link from "next/link";
import { HardHat } from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar-nav";

/**
 * Sidebar fixa do desktop. Fica oculta no mobile, onde a navegação
 * acontece pelo Sheet (header) e pela bottom navigation.
 */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-primary text-primary-foreground md:flex">
      <SidebarBrand />
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
      <div className="border-t border-white/10 p-4 text-xs text-primary-foreground/60">
        <p className="font-medium text-primary-foreground/80">Plano Starter</p>
        <p>Trial — 14 dias restantes</p>
      </div>
    </aside>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/painel"
      className="flex h-16 items-center gap-2 border-b border-white/10 px-5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
        <HardHat className="h-5 w-5" />
      </span>
      <span className="font-heading text-base font-bold leading-tight">
        Gestão de Obras
      </span>
    </Link>
  );
}
