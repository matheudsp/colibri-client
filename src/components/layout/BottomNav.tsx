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

  const handleLinkClick = () => setIsMenuOpen(false);

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
      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-secondary/95 backdrop-blur-sm px-2 py-1 flex justify-around items-center shadow-lg md:hidden z-50 border-t border-white/10">
        {mainNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={clsx(
                "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95",
                isActive
                  ? "bg-primary text-secondary shadow-md"
                  : "text-white/90 hover:text-white hover:bg-secondary-hover"
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[11px] font-semibold">{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setIsMenuOpen(true)}
          aria-label="Abrir menu de mais opções"
          className={clsx(
            "flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95",
            isMenuActive
              ? "bg-primary text-secondary shadow-md"
              : "text-white/90 hover:text-white hover:bg-secondary-hover"
          )}
        >
          <Menu className="w-6 h-6" />
          <span className="text-[11px] font-semibold">Mais</span>
        </button>
      </nav>

      {/* Drawer "Mais opções" */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl p-5 z-50 md:hidden shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-gray-800">Mais Opções</h3>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
                  aria-label="Fechar menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {menuNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleLinkClick}
                      className="flex flex-col justify-center items-center gap-2 py-5 rounded-xl w-full border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      <Icon className="w-7 h-7 text-primary" />
                      <span className="text-sm font-medium text-gray-700 text-center">
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Logout destacado */}
              <button
                onClick={handleLogout}
                className="mt-6 flex justify-center items-center gap-2 w-full py-4 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
