import {
  LayoutDashboard,
  Building2,
  Contact,
  Truck,
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

export interface NavLink {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Subitens exibidos quando a seção está ativa (ex.: financeiro). */
  children?: { title: string; href: string }[];
}

export interface NavSection {
  label?: string;
  items: NavLink[];
}

const painel: NavLink = { title: "Painel", href: "/painel", icon: LayoutDashboard };
const obras: NavLink = { title: "Obras", href: "/obras", icon: Building2 };
const clientes: NavLink = { title: "Clientes", href: "/clientes", icon: Contact };
const fornecedores: NavLink = {
  title: "Fornecedores",
  href: "/fornecedores",
  icon: Truck,
};
const financeiro: NavLink = {
  title: "Financeiro",
  href: "/financeiro",
  icon: Wallet,
  children: [
    { title: "Contas a Pagar", href: "/financeiro/contas-pagar" },
    { title: "Contas a Receber", href: "/financeiro/contas-receber" },
    { title: "Pagamentos", href: "/financeiro/pagamentos" },
  ],
};
const notas: NavLink = {
  title: "Notas Fiscais",
  href: "/notas-fiscais",
  icon: FileText,
};
const contratos: NavLink = {
  title: "Contratos",
  href: "/contratos",
  icon: FileSignature,
};
const estoque: NavLink = { title: "Estoque", href: "/estoque", icon: Package };
const rdo: NavLink = { title: "RDO", href: "/rdo", icon: ClipboardList };
const relatorios: NavLink = {
  title: "Relatórios",
  href: "/relatorios",
  icon: BarChart3,
};
const equipe: NavLink = { title: "Equipe", href: "/equipe", icon: Users };
const configuracoes: NavLink = {
  title: "Configurações",
  href: "/configuracoes",
  icon: Settings,
};

/** Navegação principal agrupada por seções. */
export const NAV_SECTIONS: NavSection[] = [
  { items: [painel, obras] },
  { label: "Cadastros", items: [clientes, fornecedores] },
  { label: "Financeiro", items: [financeiro, notas, contratos] },
  { label: "Operação", items: [rdo, estoque, equipe] },
  { label: "Gestão", items: [relatorios, configuracoes] },
];

/** Itens reduzidos para a bottom navigation no mobile (PWA). */
export const BOTTOM_NAV_ITEMS: NavLink[] = [painel, obras, financeiro, notas];
