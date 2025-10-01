"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";

import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarArrowDown,
  FileText,
  HomeIcon,
  User2,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { AuthService } from "@/services/domains/authService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants";
import Image from "next/image";
import { GrGroup } from "react-icons/gr";

const allNavItems = [
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
    label: "Interesses",
    href: "/interesses",
    icon: GrGroup,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
  {
    label: "Minha Conta",
    href: "/conta",
    icon: User2,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
];

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useCurrentUser();

  const accessibleNavItems = useMemo(
    () => allNavItems.filter((item) => item.roles.includes(role || "")),
    [role]
  );

  const currentSection =
    accessibleNavItems.find((i) => pathname?.startsWith(i.href)) || null;

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
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Header (mobile only) */}
      <header className="fixed top-0 left-0 w-full bg-background backdrop-blur-sm h-16 border-b border-border px-3 py-2 flex items-center justify-between z-50 md:hidden">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <Link href="/">
              <Image
                height={32}
                width={90}
                src={"/logo/icon/icon.svg"}
                alt="Logo Locaterra"
                priority
                className="h-10 w-auto"
              />
            </Link>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              {currentSection ? currentSection.label : "Aplicativo"}
            </p>
            <p className="text-xs text-gray-500">{pathname}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
            className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <Menu className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* spacer so page content doesn't hide under the fixed header */}
      <div className="h-14 md:hidden" />

      {/* Drawer from top */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />

            <motion.div
              initial={{ y: "-110%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-110%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.28 }}
              className="fixed top-0 left-0 w-full bg-background p-4 z-50 md:hidden border-b border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <p className="font-bold text-lg text-gray-800">Menu</p>
                  <span className="text-sm text-gray-500">
                    {currentSection?.label || "Navegação"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Fechar menu"
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <nav>
                <ul className="grid grid-cols-1 gap-3">
                  {accessibleNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={clsx(
                            "flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition",
                            isActive
                              ? "bg-primary-light text-black"
                              : "text-gray-700"
                          )}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4">
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 rounded-lg border border-red-300 text-red-600 font-semibold hover:bg-red-50"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Sair
                    </div>
                  </button>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
