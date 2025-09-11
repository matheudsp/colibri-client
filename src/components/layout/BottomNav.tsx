"use client";

import { useMemo, useState } from "react";
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
    label: "Pagamentos",
    href: "/pagamentos",
    icon: CalendarArrowDown,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
  {
    label: "Minha Conta",
    href: "/conta",
    icon: User2,
    roles: [Roles.ADMIN, Roles.LOCADOR, Roles.LOCATARIO],
  },
];

const mainNavItems = allNavItems.slice(0, 2);
const menuNavItems = allNavItems.slice(2);

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role } = useCurrentUser();
  const accessibleNavItems = useMemo(
    () => allNavItems.filter((item) => item.roles.includes(role || "")),
    [role]
  );
  const mainNavItems = accessibleNavItems.slice(0, 2);
  const menuNavItems = accessibleNavItems.slice(2);

  const isMenuActive = menuNavItems.some((item) =>
    pathname.startsWith(item.href)
  );
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
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
      <nav className="fixed bottom-0 left-0 w-full bg-secondary p-2 flex justify-around items-center rounded-t-xl shadow-lg md:hidden z-50">
        {mainNavItems.map((item) => {
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

        <button
          onClick={() => setIsMenuOpen(true)}
          className={clsx(
            "flex-1 flex flex-col items-center gap-1 py-1 rounded-lg transition-colors duration-300 ease-in-out",
            isMenuActive ? "bg-primary text-secondary/90" : "text-white/90"
          )}
          aria-label="Abrir menu de mais opções"
        >
          <Menu className="w-6 h-6" />
          <span className="text-xs font-bold tracking-wide">Mais</span>
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 md:hidden"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl p-4 z-50 md:hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-gray-800">Mais Opções</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-full"
                  aria-label="Fechar menu"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {menuNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex flex-col justify-center items-center gap-2 py-4 rounded-lg w-full border hover:bg-gray-100 transition-colors"
                    >
                      <Icon className="w-8 h-8 text-primary" />
                      <span className="text-sm font-semibold text-gray-700 text-center">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
              <button
                onClick={handleLogout}
                className="flex flex-col justify-center items-center mt-2 gap-2 py-4 rounded-lg w-full border hover:bg-red-50 transition-colors col-span-2"
              >
                <LogOut className="w-8 h-8 text-red-600" />
                <span className="text-sm font-semibold text-red-600">Sair</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
