"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Empleados",
    href: "/employees",
  },
  {
    title: "Planillas",
    href: "/payrolls",
  },
  {
    title: "Deducciones",
    href: "/deductions",
  },
  {
    title: "Beneficios",
    href: "/benefits",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className="text-lg font-bold"
      >
        Planilla
      </Link>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
} 