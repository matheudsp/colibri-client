"use client";

import {
  Building2,
  CalendarArrowDown,
  FileText,
  HomeIcon,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { destroyCookie } from "nookies";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "sonner";

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
  const router = useRouter();
  const { name, loading } = useUserRole();

  const handleLogout = () => {
    destroyCookie(null, "authToken", { path: "/" });
    toast.success("Logout realizado com sucesso!");
    router.push("/login");
  };

  const userInitial = name ? name[0].toUpperCase() : "?";
  const myAccountIsActive = pathname.startsWith("/account");
  return (
    <div className="fixed z-20 hidden md:flex w-32 min-h-screen flex-col justify-between bg-secondary py-6 px-2 shadow-xl">
      <div>
        <div className="mb-12 flex justify-center">
          <Link href="/properties">
            <Image
              width={50}
              height={50}
              src="/icons/logo-white-green.svg"
              alt="Logo Colibri"
              className="w-20 h-auto"
              priority
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

      <div className="flex flex-col items-center gap-4 w-full ">
        <Link
          href={"/account"}
          className={clsx(
            "flex flex-col items-center justify-center gap-1 p-2 w-full rounded-lg transition-all duration-300 ease-in-out transform",
            myAccountIsActive
              ? "bg-primary text-secondary/90 scale-105 shadow-md"
              : "text-white/90 hover:bg-secondary-hover hover:text-white hover:scale-105"
          )}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white  ${
              myAccountIsActive && "bg-secondary "
            }`}
          >
            <span
              className={`text-xs font-bold tracking-wide ${
                loading && "animate-pulse"
              } ${myAccountIsActive && "text-primary"}
              `}
            >
              {loading ? "..." : userInitial}
            </span>
          </div>
          <span
            className={`text-xs font-bold tracking-wide ${
              loading && "animate-pulse"
            }`}
          >
            Minha Conta
          </span>
        </Link>

        <button
          onClick={handleLogout}
          title="Sair do sistema"
          className="flex flex-col items-center justify-center gap-1 p-2 w-full rounded-lg text-white/90 hover:bg-red-500/80 hover:text-white hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <LogOut className="w-7 h-7" />
          <span className="text-xs font-bold tracking-wide">Sair</span>
        </button>
      </div>
    </div>
  );
}
