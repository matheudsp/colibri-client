"use client";

import {
  ArrowLeftIcon,
  SearchIcon,
  Menu as MenuIcon,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, ReactNode, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrentUser } from "@/hooks/useCurrentUser";
type HeaderType = "default" | "back" | "backMenu" | "search" | "logoOnly";

interface HeaderProps {
  type: HeaderType;
  isScrolled?: boolean;
  onBack?: () => void;
  dropdownMenu?: ReactNode;
  hasSidebar?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const navItems = [
  { label: "Ajuda", href: "#" },
  // { label: "Mais", href: "#" },
];

const menuVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export function Header({
  type,
  isScrolled = false,
  onBack,
  dropdownMenu,
  // hasSidebar = false,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, loading } = useCurrentUser();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const isScrolledOrSearch = isScrolled || type === "search";
  const showSearchBar = false;
  // const showSearchBar = type === "search" || (type === "default" && isScrolled);

  if (type === "default" || type === "search") {
    return (
      <header
        className={` fixed z-50 top-0 w-full flex items-center justify-center ${
          isScrolledOrSearch
            ? "bg-white/90 backdrop-blur-sm border-b"
            : "bg-secondary"
        }`}
      >
        <div
          className={` w-full max-w-7xl px-4 2xl:px-0 h-20 flex items-center justify-between gap-6 transition-all duration-300 ease-in-out `}
        >
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                height={32}
                width={90}
                src={
                  isScrolledOrSearch
                    ? "/icons/logo-purple-black.svg"
                    : "/icons/logo-white-green.svg"
                }
                alt="Logo Colibri"
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Barra de Busca */}
          <div className="flex-1 max-w-xl hidden lg:flex justify-center">
            <AnimatePresence>
              {showSearchBar && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Digite sua busca"
                      value={searchValue}
                      onChange={handleChange}
                      className="w-full h-12 pl-5 pr-14 rounded-full border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      aria-label="Buscar"
                      className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white"
                    >
                      <SearchIcon size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navegação (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
            <Link
              key={"menu"}
              href={isAuthenticated ? "/imoveis" : "/entrar"}
              className={`text-sm font-semibold transition-colors whitespace-nowrap border-2 py-2 px-8  rounded-lg ${
                isScrolledOrSearch
                  ? "text-secondary  border-secondary  hover:bg-secondary hover:text-white"
                  : "text-white hover:text-secondary hover:bg-white border-white border-b"
              }`}
            >
              {/* Se estiver logado, exibir acessar painel, se nao estiver mostre botao de login e cadastro */}
              {isAuthenticated ? "Acessar Sistema" : "Login | Cadastre-se"}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-colors whitespace-nowrap ${
                  isScrolledOrSearch
                    ? "text-secondary hover:text-accent"
                    : "text-white hover:text-gray-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Menu (Mobile) */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-md z-50 ${
                isScrolledOrSearch ? "text-gray-700" : "text-white"
              }`}
            >
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 top-[72px] bg-background z-40 lg:hidden"
            >
              <div className="p-4">
                {/* {showSearchBar && (
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Digite sua busca"
                      value={searchValue}
                      onChange={handleChange}
                      className="w-full h-12 pl-5 pr-14 rounded-full border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      aria-label="Buscar"
                      className="absolute top-1/2 right-2 -translate-y-1/2 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white"
                    >
                      <SearchIcon size={20} />
                    </button>
                  </div>
                )} */}
                <nav className="flex flex-col space-y-2">
                  <Link
                    key={"access"}
                    href={isAuthenticated ? "/imoveis" : "/entrar"}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg p-3 rounded-md font-semibold text-secondary hover:bg-gray-200 border-secondary border-2 hover:text-white hover:bg-secondary"
                  >
                    {/* Se estiver logado, exibir acessar painel, se nao estiver mostre botao de login e cadastro */}
                    {isAuthenticated
                      ? "Acessar Sistema"
                      : "Login | Cadastre-se"}
                  </Link>
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-lg p-3 rounded-md font-semibold text-secondary hover:bg-gray-200"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    );
  }

  if (type === "logoOnly") {
    return (
      <header className="fixed z-40 top-0 w-full bg-white/90 backdrop-blur-sm px-4 py-2  flex items-center justify-center border-b">
        <Image
          height={50}
          width={120}
          src="/icons/logo-black-green.svg"
          alt="Logo Colibri"
          className="w-auto h-12"
          priority
        />
      </header>
    );
  }
  return (
    <header
      className={` fixed z-50 top-0 w-full flex items-center justify-center bg-white/90 backdrop-blur-sm border-b`}
    >
      <div
        className={` w-full max-w-7xl px-4 2xl:px-0 h-20 flex items-center justify-between gap-6 transition-all duration-300 ease-in-out `}
      >
        {onBack && (
          <button
            title="Botão de voltar"
            aria-label="Botão de voltar"
            onClick={onBack}
            className="hover:bg-gray-500/10 p-2 rounded-full transition-all"
          >
            <ArrowLeftIcon className="w-7 h-7" />
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <Image
            height={50}
            width={120}
            src="/icons/logo-black-green.svg"
            alt="Logo Colibri"
            className="w-auto h-12"
            priority
          />
        </div>
        {type === "back" && <span className="w-11 h-11"></span>}
        {type === "backMenu" && dropdownMenu}
      </div>
    </header>
  );
}
