"use client";

import { Building2, CalendarArrowDown, FileText, HomeIcon } from "lucide-react";
import Image from "next/image";
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
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="fixed z-20 hidden md:flex w-32 min-h-screen flex-col items-center bg-secondary py-6 px-2 shadow-xl">
      <div className="mb-12">
        <Link href="/properties">
          <Image
            width={50}
            height={50}
            src="/icons/logo-white-green.svg"
            alt="Logo Colibri"
            className="w-20 h-auto"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-4 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 p-2 w-full rounded-lg transition-all duration-300 ease-in-out transform",

                isActive
                  ? "bg-primary text-secondary/90 scale-105 shadow-md"
                  : "text-white/90 hover:bg-secondary-hover hover:text-white hover:scale-105"
              )}
            >
              <Icon className="w-7 h-7" />
              <span className="text-xs font-bold tracking-wide">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
