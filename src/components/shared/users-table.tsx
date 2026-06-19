import type { UserRole } from "@prisma/client";

import { USER_ROLE_LABELS } from "@/lib/roles";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

const ROLE_VARIANT: Record<
  UserRole,
  "default" | "secondary" | "outline"
> = {
  ADMIN: "default",
  GESTOR: "secondary",
  MESTRE_OBRA: "outline",
  VIEWER: "outline",
};

export function UsersTable({ users }: { users: UserRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead className="hidden sm:table-cell">E-mail</TableHead>
          <TableHead>Papel</TableHead>
          <TableHead>Situação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {user.email}
            </TableCell>
            <TableCell>
              <Badge variant={ROLE_VARIANT[user.role]}>
                {USER_ROLE_LABELS[user.role]}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.isActive ? "success" : "outline"}>
                {user.isActive ? "Ativo" : "Inativo"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
