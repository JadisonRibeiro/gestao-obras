"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createTenantWithAdmin } from "@/services/auth.service";
import { loginSchema, cadastroSchema } from "@/lib/validations/auth";

export interface AuthActionState {
  success?: boolean;
  error?: string;
  /** true quando o cadastro exige confirmação de e-mail antes do login. */
  needsConfirmation?: boolean;
}

/** Traduz mensagens comuns do Supabase Auth para português. */
function translateAuthError(message: string): string {
  const map: Record<string, string> = {
    "Invalid login credentials": "E-mail ou senha inválidos.",
    "Email not confirmed":
      "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.",
    "User already registered": "Este e-mail já está cadastrado.",
    "Password should be at least 6 characters":
      "A senha é muito curta.",
  };
  return map[message] ?? "Não foi possível concluir. Tente novamente.";
}

export async function login(
  values: unknown
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/painel");
}

export async function signup(
  values: unknown
): Promise<AuthActionState> {
  const parsed = cadastroSchema.safeParse(values);
  if (!parsed.success) {
    return { error: "Dados inválidos." };
  }

  const { companyName, name, email, password } = parsed.data;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, company_name: companyName },
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  // E-mail já cadastrado (resposta obfuscada do Supabase quando confirmação
  // de e-mail está ativa): identities vem vazio.
  if (!data.user || data.user.identities?.length === 0) {
    return { error: "Este e-mail já está cadastrado." };
  }

  // Cria a construtora (tenant) + usuário admin. Em caso de falha, remove o
  // auth user recém-criado para não deixar registro órfão.
  try {
    await createTenantWithAdmin({
      authId: data.user.id,
      companyName,
      name,
      email,
    });
  } catch {
    try {
      const admin = createAdminClient();
      await admin.auth.admin.deleteUser(data.user.id);
    } catch {
      // Falha ao reverter — não expor detalhes ao usuário.
    }
    return {
      error:
        "Não foi possível criar sua conta. Tente novamente em instantes.",
    };
  }

  // Sem sessão = confirmação de e-mail ativada no projeto Supabase.
  if (!data.session) {
    return { success: true, needsConfirmation: true };
  }

  revalidatePath("/", "layout");
  redirect("/painel");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
