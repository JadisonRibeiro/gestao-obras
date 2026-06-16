import { type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas, exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico, manifest e arquivos de imagem
     * - sw.js / workbox (service worker do PWA)
     */
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-.*|icons/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
