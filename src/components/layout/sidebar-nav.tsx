"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/config/nav";

interface SidebarNavProps {
  /** Chamado ao navegar — usado para fechar o menu mobile (Sheet). */
  onNavigate?: () => void;
}

/**
 * Navegação por módulos. Reutilizada na sidebar do desktop e no
 * menu lateral (Sheet) do mobile.
 */
export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className="flex flex-col gap-1 p-3" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          active={isActive(item.href)}
          isChildActive={isActive}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}

interface NavLinkProps {
  item: NavItem;
  active: boolean;
  isChildActive: (href: string) => boolean;
  onNavigate?: () => void;
}

function NavLink({ item, active, isChildActive, onNavigate }: NavLinkProps) {
  const Icon = item.icon;

  return (
    <div>
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "text-primary-foreground/80 hover:bg-white/10 hover:text-primary-foreground",
          active &&
            "bg-white/15 text-primary-foreground border-l-2 border-secondary"
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span className="truncate">{item.title}</span>
      </Link>

      {item.children && active && (
        <div className="ml-7 mt-1 flex flex-col gap-1 border-l border-white/15 pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              aria-current={isChildActive(child.href) ? "page" : undefined}
              className={cn(
                "rounded-md px-2 py-1.5 text-sm transition-colors",
                "text-primary-foreground/70 hover:bg-white/10 hover:text-primary-foreground",
                isChildActive(child.href) &&
                  "text-secondary font-medium"
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
