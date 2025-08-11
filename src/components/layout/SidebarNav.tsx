"use client";

import { Building2, CalendarArrowDown, HomeIcon } from "lucide-react";
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
    label: "Pagamentos",
    href: "/payments",
    icon: CalendarArrowDown,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="fixed z-20 hidden md:flex w-32 min-h-svh flex-col items-center bg-primary py-6 px-2 text-background ">
      <div className="mb-10">
        <Image
          width={50}
          height={50}
          src="/images/logo-vertical.png"
          alt="Logo Colibri"
          className="w-20 h-auto"
        />
      </div>

      <nav className="flex flex-col gap-6 w-full items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex flex-col items-center gap-1 px-2 py-1 w-full rounded-lg hover:bg-primary-hover transition-all duration-150",
                isActive && "bg-black/20"
              )}
            >
              <Icon className="w-8 h-8" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
