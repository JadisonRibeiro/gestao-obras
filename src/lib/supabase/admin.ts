import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase com a SECRET KEY (service role). Acesso administrativo
 * total — USAR SOMENTE NO SERVIDOR. Nunca importar em código de cliente.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
