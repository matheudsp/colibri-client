"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarArrowDown,
  FileText,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { toast } from "sonner";
import { useUserStore } from "@/stores/userStore";
import { AuthService } from "@/services/domains/authService";
import { Roles } from "@/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { GrGroup } from "react-icons/gr";
const navItems = [
  {
    label: "Painel",
    href: "/painel",
    icon: LayoutDashboard,
    roles: [Roles.ADMIN, Roles.LOCADOR],
  },
  {
    label: "Imóveis",
    href: "/imoveis",
    icon: HomeIcon,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
  {
    label: "Contratos",
    href: "/contratos",
    icon: FileText,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
  {
    label: "Faturas",
    href: "/faturas",
    icon: CalendarArrowDown,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
  {
    label: "Interessados",
    href: "/interesses",
    icon: GrGroup,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
];

const LOCALSTORAGE_KEY = "locaterra.sidebar.collapsed";

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUserStore();
  const { role } = useCurrentUser();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCALSTORAGE_KEY);
      setCollapsed(raw === "true");
    } catch {
      // ignore (e.g. SSR or privacy mode)
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCALSTORAGE_KEY, String(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Você saiu com sucesso!");
      router.push("/entrar");
    } catch (error) {
      toast.error("Não foi possível fazer logout. Tente novamente.", {
        description: `${error}`,
      });
    }
  };

  const accessibleNavItems = navItems.filter((item) =>
    item.roles.includes(role || "")
  );
  const userInitial = user?.name ? user?.name[0].toUpperCase() : "?";
  const myAccountIsActive =
    pathname.startsWith("/account") || pathname.startsWith("/conta");

  return (
    <aside
      aria-label="Barra lateral"
      className={clsx(
        "hidden md:flex sticky top-0 left-0 z-20 h-screen  flex-col justify-between bg-background border-r border-border py-6 px-2 transition-all duration-300",
        collapsed ? "w-24" : "w-60"
      )}
    >
      {/* Top: logo + toggle */}
      <div>
        <div
          className={`flex items-center justify-between px-2 mb-6 gap-4 ${
            collapsed ? "flex-col " : "flex-row"
          }`}
        >
          <Link href="/" className="flex items-center gap-3">
            <Image
              width={collapsed ? 40 : 160}
              height={collapsed ? 40 : 48}
              src={
                collapsed
                  ? "/logo/icon/icon.svg"
                  : "/logo/paisagem/paisagem-svg/4.svg"
              }
              alt="Logo Locaterra"
              className={clsx(
                collapsed ? "w-8 h-8" : "w-auto h-8",
                collapsed && "opacity-90"
              )}
              priority
            />
          </Link>

          <button
            aria-expanded={!collapsed}
            aria-label={
              collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
            }
            onClick={() => setCollapsed((s) => !s)}
            className="p-4 border border-gray-50/20 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-black/80" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-black/80" />
            )}
          </button>
        </div>

        <nav
          className="flex flex-col gap-2 p-2"
          role="navigation"
          aria-label="Navegação principal"
        >
          {accessibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={clsx(
                  "flex items-center transition-all duration-200 ease-in-out rounded-xl w-full",

                  collapsed
                    ? "justify-center px-0 py-2 "
                    : "justify-start px-4 py-2 ",
                  isActive
                    ? "bg-primary-light text-black "
                    : "text-slate-800/90 hover:bg-gray-400/40 hover:scale-105",
                  collapsed &&
                    isActive &&
                    "outline-2 outline-offset-2 outline-border"
                )}
              >
                <div
                  className={clsx(
                    "flex items-center justify-center",
                    collapsed ? "w-8 h-8" : "w-4 h-4"
                  )}
                >
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                </div>

                {!collapsed && (
                  <span
                    className={`ml-2 text-sm  tracking-wide truncate font-normal ${
                      isActive && ""
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: account + logout */}
      <div
        className={clsx(
          "flex flex-col gap-4 px-1",
          collapsed ? "items-center" : "items-stretch"
        )}
      >
        <Link
          href={"/conta"}
          className={clsx(
            "flex items-center transition-all duration-200 ease-in-out rounded-lg w-full p-2",
            collapsed ? "justify-center " : "justify-start",
            myAccountIsActive
              ? "bg-primary-light scale-105 text-black"
              : "text-slate-800/90 hover:bg-gray-400/40  hover:scale-105"
          )}
        >
          <div
            className={clsx(
              "flex items-center justify-center rounded-full",
              "w-6 h-6 text-white",
              myAccountIsActive ? "bg-secondary " : "bg-primary "
            )}
          >
            <span
              className={clsx(
                "text-xs font-bold tracking-wide",
                loading && "animate-pulse"
              )}
            >
              {loading ? "..." : userInitial}
            </span>
          </div>

          {!collapsed && (
            <span className="ml-2 text-sm font-normal  tracking-wide truncate">
              Minha Conta
            </span>
          )}
        </Link>

        <button
          onClick={handleLogout}
          title="Sair do sistema"
          className={clsx(
            "flex items-center transition-all duration-200 ease-in-out rounded-lg w-full text-black/90 hover:bg-red-500/80 hover:text-white hover:scale-105",
            collapsed ? "justify-center px-0 py-2" : "justify-start px-3 py-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && (
            <span className="ml-2 text-sm font-semibold tracking-wide truncate">
              Sair
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
