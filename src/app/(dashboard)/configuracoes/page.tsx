import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard, Users, Building2, ChevronRight } from "lucide-react";

import { requireUser } from "@/lib/auth";
import { USER_ROLE_LABELS } from "@/lib/roles";
import { formatDate } from "@/lib/format";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = {
  title: "Configurações",
};

const LINKS = [
  {
    href: "/configuracoes/plano",
    title: "Plano e assinatura",
    description: "Veja seu plano, limites e faça upgrade.",
    icon: CreditCard,
  },
  {
    href: "/configuracoes/usuarios",
    title: "Usuários",
    description: "Gerencie a equipe com acesso ao sistema.",
    icon: Users,
  },
];

export default async function ConfiguracoesPage() {
  const user = await requireUser();
  const { tenant } = user;

  return (
    <>
      <PageHeader
        title="Configurações"
        description="Dados da construtora, plano e usuários."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-primary" />
            {tenant.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="text-sm font-medium">{tenant.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Plano</p>
            <p className="text-sm font-medium">
              {tenant.plan.name}{" "}
              <Badge variant="secondary" className="ml-1 align-middle">
                {tenant.subscriptionStatus === "TRIAL" ? "Trial" : "Ativo"}
              </Badge>
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seu papel</p>
            <p className="text-sm font-medium">{USER_ROLE_LABELS[user.role]}</p>
          </div>
          {tenant.trialEndsAt && tenant.subscriptionStatus === "TRIAL" && (
            <div>
              <p className="text-xs text-muted-foreground">Trial até</p>
              <p className="text-sm font-medium">
                {formatDate(tenant.trialEndsAt)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <Card className="transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{link.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
