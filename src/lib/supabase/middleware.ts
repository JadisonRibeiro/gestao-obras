import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Renova a sessão do Supabase a cada requisição e mantém os cookies de
 * autenticação sincronizados entre o servidor e o browser.
 *
 * IMPORTANTE: não inserir lógica entre `createServerClient` e
 * `supabase.auth.getUser()` — pode causar logout aleatório do usuário.
 */
export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Renova o token (refresh) e disponibiliza o usuário autenticado.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // TODO(fase-1): quando a página de login existir, redirecionar usuários
  // não autenticados das rotas protegidas do dashboard para /login.
  void user;

  return supabaseResponse;
};
