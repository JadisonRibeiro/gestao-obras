"use client";

import { useState, useTransition } from "react";
import { Menu, Bell, LogOut, User as UserIcon, Settings } from "lucide-react";

import { logout } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SidebarBrand } from "@/components/layout/sidebar";

export interface HeaderUser {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface HeaderProps {
  tenantName: string;
  user: HeaderUser;
}

export function Header({ tenantName, user }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, startLogout] = useTransition();

  const initials = getInitials(user.name);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card px-4 md:px-6">
      {/* Menu mobile (Sheet) */}
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
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

      {/* Nome da construtora (tenant) */}
      <div className="flex min-w-0 flex-1 items-center">
        <span className="truncate font-heading text-base font-semibold text-foreground">
          {tenantName}
        </span>
      </div>

      {/* Ações à direita */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notificações"
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-9 w-9">
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="truncate text-sm font-medium">
                  {user.name}
                </span>
                <span className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="h-4 w-4" />
              Meu perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={isLoggingOut}
              onSelect={(event) => {
                event.preventDefault();
                startLogout(() => {
                  void logout();
                });
              }}
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
