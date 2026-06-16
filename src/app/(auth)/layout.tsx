import Link from "next/link";
import { HardHat } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <HardHat className="h-6 w-6" />
        </span>
        <span className="font-heading text-xl font-bold text-foreground">
          Gestão de Obras
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
