"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_SECTIONS, type NavLink } from "@/config/nav";

interface SidebarNavProps {
  /** Chamado ao navegar — usado para fechar o menu mobile (Sheet). */
  onNavigate?: () => void;
}

/**
 * Navegação por módulos, agrupada em seções. Reutilizada na sidebar do
 * desktop e no menu lateral (Sheet) do mobile.
 */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="flex flex-col gap-5 p-3" aria-label="Navegação principal">
      {NAV_SECTIONS.map((section, i) => (
        <div key={section.label ?? `section-${i}`} className="flex flex-col gap-1">
          {section.label && (
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-white/35">
              {section.label}
            </p>
          )}
          {section.items.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              active={isActive(item.href)}
              isChildActive={isActive}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      ))}
    </nav>
  );
}

interface NavItemProps {
  item: NavLink;
  active: boolean;
  isChildActive: (href: string) => boolean;
  onNavigate?: () => void;
}

function NavItem({ item, active, isChildActive, onNavigate }: NavItemProps) {
  const Icon = item.icon;

  return (
    <div>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          "text-white/70 hover:bg-white/10 hover:text-white",
          active && "bg-white/[0.12] text-white"
        )}
      >
        <Icon
          className={cn("h-[18px] w-[18px] shrink-0", active && "text-secondary")}
        />
        <span className="truncate">{item.title}</span>
      </Link>

      {item.children && active && (
        <div className="ml-[26px] mt-1 flex flex-col gap-0.5 border-l border-white/15 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              aria-current={isChildActive(child.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm transition-colors",
                "text-white/60 hover:bg-white/10 hover:text-white",
                isChildActive(child.href) && "font-medium text-secondary"
              )}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
