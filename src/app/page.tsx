import { redirect } from "next/navigation";

// Landing temporária: redireciona para o painel enquanto a página
// pública de marketing não é construída (Fase 3+).
export default function Home() {
  redirect("/painel");
}
