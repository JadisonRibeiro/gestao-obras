import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

import { createClient } from "@/lib/supabase/server";
import { getUserByAuthId } from "@/services/auth.service";

/** Papéis que podem gerenciar dados (criar/editar/excluir). */
export function isManagerRole(role: UserRole): boolean {
  return role === "ADMIN" || role === "GESTOR";
}

/**
 * Retorna o usuário autenticado (com tenant e plano) ou `null`.
 * Combina a sessão do Supabase Auth com o registro do Prisma.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  return getUserByAuthId(authUser.id);
}

/**
 * Garante que há um usuário autenticado e vinculado a um tenant.
 * Redireciona para /login caso contrário. Use em layouts/páginas protegidas.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
