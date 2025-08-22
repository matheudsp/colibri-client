"use client";

import {
  Building2,
  CalendarArrowDown,
  FileText,
  HomeIcon,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  {
    label: "Imóveis",
    href: "/properties",
    icon: HomeIcon,
  },
  {
    label: "Condomínios",
    href: "/condominiums",
    icon: Building2,
  },
  {
    label: "Contratos",
    href: "/contracts",
    icon: FileText,
  },
  {
    label: "Pagamentos",
    href: "/payments",
    icon: CalendarArrowDown,
  },
  {
    label: "Financeiro",
    href: "/financial",
    icon: Wallet,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-secondary p-2 flex justify-around items-center rounded-t-2xl shadow-lg md:hidden z-50">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors duration-300 ease-in-out",

              isActive ? "bg-primary text-secondary/90" : "text-white/90"
            )}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-bold tracking-wide">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
