import Link from "next/link";
import { Wallet, BarChart3, Smartphone, ShieldCheck } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { SITE } from "@/config/site";

const FEATURES = [
  {
    icon: Wallet,
    title: "Financeiro sob controle",
    desc: "Contas a pagar, a receber e fluxo de caixa por obra.",
  },
  {
    icon: BarChart3,
    title: "Visão gerencial",
    desc: "DRE por obra, margens e indicadores em tempo real.",
  },
  {
    icon: Smartphone,
    title: "Feito para o canteiro",
    desc: "App PWA mobile-first para usar em campo, mesmo offline.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro e multiempresa",
    desc: "Dados isolados por construtora, com trilha e backup.",
  },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel de marca (desktop) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#0f2350] via-[#0c1c43] to-[#070f24] p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "34px 34px",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <Link href="/">
            <Logo textClassName="text-white" />
          </Link>
        </div>

        <div className="relative space-y-10">
          <div className="space-y-3">
            <h1 className="font-heading text-3xl font-bold leading-tight text-white">
              A gestão da sua construtora,
              <br />
              do orçamento à entrega.
            </h1>
            <p className="max-w-sm text-white/55">{SITE.tagline}.</p>
          </div>

          <ul className="space-y-5">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <li key={f.title} className="flex items-start gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-secondary ring-1 ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-white">{f.title}</p>
                    <p className="text-sm text-white/50">{f.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="relative text-sm text-white/35">
          © {new Date().getFullYear()} {SITE.name}. Todos os direitos
          reservados.
        </div>
      </div>

      {/* Formulário */}
      <div className="flex flex-col items-center justify-center bg-background px-4 py-10">
        <Link href="/" className="mb-8 lg:hidden">
          <Logo />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
