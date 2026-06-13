import {
  LayoutDashboard,
  Building2,
  Wallet,
  FileText,
  FileSignature,
  Package,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Subitens exibidos na sidebar (ex.: módulo financeiro) */
  children?: { title: string; href: string }[];
}

/** Navegação principal por módulos do sistema. */
export const NAV_ITEMS: NavItem[] = [
  {
    title: "Painel",
    href: "/painel",
    icon: LayoutDashboard,
  },
  {
    title: "Obras",
    href: "/obras",
    icon: Building2,
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    children: [
      { title: "Contas a Pagar", href: "/financeiro/contas-pagar" },
      { title: "Contas a Receber", href: "/financeiro/contas-receber" },
      { title: "Pagamentos", href: "/financeiro/pagamentos" },
    ],
  },
  {
    title: "Notas Fiscais",
    href: "/notas-fiscais",
    icon: FileText,
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileSignature,
  },
  {
    title: "Estoque",
    href: "/estoque",
    icon: Package,
  },
  {
    title: "RDO",
    href: "/rdo",
    icon: ClipboardList,
  },
  {
    title: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
  },
  {
    title: "Equipe",
    href: "/equipe",
    icon: Users,
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

/** Itens reduzidos para a bottom navigation no mobile (PWA). */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
  NAV_ITEMS[0], // Painel
  NAV_ITEMS[1], // Obras
  NAV_ITEMS[2], // Financeiro
  NAV_ITEMS[3], // Notas Fiscais
];
