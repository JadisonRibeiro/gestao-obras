import Link from "next/link";

import { Logo } from "@/components/shared/logo";
import { SidebarNav } from "@/components/layout/sidebar-nav";

interface SidebarProps {
  planName: string;
  trialLabel?: string | null;
}

/**
 * Sidebar fixa do desktop. Oculta no mobile, onde a navegação acontece pelo
 * Sheet (header) e pela bottom navigation.
 */
export function Sidebar({ planName, trialLabel }: SidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-gradient-to-b from-[#0f2350] to-[#0a1530] md:flex">
      <SidebarBrand />
      <div className="flex-1 overflow-y-auto py-2">
        <SidebarNav />
      </div>
      <div className="m-3 rounded-xl bg-white/[0.06] p-4 ring-1 ring-white/10">
        <p className="text-sm font-semibold text-white">Plano {planName}</p>
        {trialLabel && (
          <p className="mt-0.5 text-xs text-white/50">{trialLabel}</p>
        )}
      </div>
    </aside>
  );
}

export function SidebarBrand() {
  return (
    <Link
      href="/painel"
      className="flex h-16 items-center border-b border-white/10 px-5"
    >
      <Logo textClassName="text-white" />
    </Link>
  );
}
