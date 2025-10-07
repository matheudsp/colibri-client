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
import { UserMenu } from "../common/UserMenu";
type HeaderType = "default" | "back" | "backMenu" | "search" | "logoOnly";

interface HeaderProps {
  type: HeaderType;
  isScrolled?: boolean;
  onBack?: () => void;
  dropdownMenu?: ReactNode;
  hasSidebar?: boolean;
  occultInPrivate?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

const navItems = [
  { label: "Ajuda", href: "/ajuda" },
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
  occultInPrivate = false,
  searchValue = "",
  onSearchChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useCurrentUser();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value);
  };

  const isScrolledOrSearch = isScrolled || type === "search";
  const showSearchBar = false;
  // const showSearchBar = type === "search" || (type === "default" && isScrolled);

  if (type === "default" || type === "search") {
    return (
      <header
        className={`${
          occultInPrivate ? "hidden" : "flex"
        } fixed z-50 top-0 w-full items-center justify-center ${
          isScrolledOrSearch
            ? "bg-background/90 backdrop-blur-xs border-b border-border"
            : "bg-secondary-hover"
        }`}
      >
        <div
          className={` ${
            occultInPrivate ? "hidden" : "flex"
          } w-full max-w-7xl px-4 2xl:px-0 h-16  items-center justify-between gap-6 transition-all duration-300 ease-in-out `}
        >
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/">
              <Image
                height={32}
                width={90}
                src={
                  isScrolledOrSearch
                    ? "/logo/paisagem/paisagem-svg/5.svg"
                    : "/logo/paisagem/paisagem-svg/7.svg"
                }
                alt="Logo Locaterra"
                priority
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
                      className="w-full h-12 pl-5 pr-14 rounded-full border-2 border-border "
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
          <nav className="hidden  lg:flex items-center gap-6 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-x-4">
                <Link
                  href="/painel"
                  className={`rounded-md px-4 py-1.5 text-sm font-semibold shadow-sm transition-all duration-300 ${
                    isScrolled
                      ? "bg-primary border-primary-hover border text-white hover:bg-primary/85"
                      : "bg-background/10 text-white hover:bg-background/20 backdrop-blur-sm border border-white/20"
                  }`}
                >
                  Painel
                </Link>

                <UserMenu orientation="horizontal" isScrolled={isScrolled} />
              </div>
            ) : (
              <div className="flex items-center justify-evenly gap-x-4">
                <Link
                  href="/entrar"
                  className={`font-light text-base  transition-all duration-300 ease-in-out  py-1.5 ${
                    isScrolled
                      ? "text-black hover:text-primary "
                      : "text-white hover:text-gray-50/75 "
                  }`}
                >
                  Já tenho acesso
                </Link>
                <em
                  className={`font-light  text-sm   transition-colors text-center duration-300 ${
                    isScrolled
                      ? "text-black hover:text-primary"
                      : "text-white hover:text-gray-200"
                  }`}
                >
                  ou
                </em>
                <Link
                  href="/registrar"
                  className={`transform rounded-lg px-4  py-1 text-center font-medium text-white shadow-md transition-all duration-300 ease-in-out hover:-translate-y-0.5 active:translate-y-0 ${
                    isScrolled
                      ? "bg-secondary/75 border-b-4 border border-secondary-hover border-b-secondary-hover "
                      : "bg-background/20 hover:bg-background/30 border border-white/30"
                  }`}
                >
                  Criar conta grátis
                </Link>
              </div>
            )}
            <div
              className={`h-6 w-px transition-colors duration-300 ${
                isScrolled ? "bg-gray-200" : "bg-background/30"
              }`}
              aria-hidden="true"
            />
            <nav className="flex gap-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-semibold transition-colors duration-300 ${
                    isScrolled
                      ? "text-gray-700 hover:text-primary"
                      : "text-white hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
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
              className="fixed  inset-0 top-[64px]  z-40 lg:hidden"
            >
              <div className="p-4 bg-background/95 h-svh">
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
                <nav className="flex flex-col space-y-4 items-end">
                  {isAuthenticated ? (
                    <div className="w-full flex flex-col space-y-4">
                      <UserMenu orientation="horizontal" fullWidth />

                      <Link
                        href="/painel"
                        onClick={() => setIsMenuOpen(false)}
                        className="rounded-md  p-2 bg-primary/85 border-b-4 border border-primary-hover border-b-primary-hover text-center text-lg font-semibold text-white hover:bg-primary-hover"
                      >
                        Painel
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col w-full items-center gap-3 rounded-lg p-4">
                        <div className="flex w-full items-center justify-center gap-3">
                          <Link
                            href="/entrar"
                            onClick={() => setIsMenuOpen(false)}
                            className="font-light text-base text-black hover:text-primary"
                          >
                            Já tenho acesso
                          </Link>
                        </div>
                        <em className="text-base font-light text-black">ou</em>
                        <Link
                          href="/registrar"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full transform rounded-lg bg-secondary/75 border-b-4 border border-secondary-hover border-b-secondary-hover p-3 text-center font-medium text-white shadow-md transition-transform duration-150 ease-in-out hover:-translate-y-0.5 active:translate-y-0"
                        >
                          Criar conta grátis
                        </Link>
                      </div>
                      <div className="my-2 border-t border-gray-200" />
                    </>
                  )}

                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="rounded-md p-3 text-lg font-semibold text-secondary hover:bg-gray-100"
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
      <header
        className={`${
          occultInPrivate && "hidden"
        } md:fixed z-40 top-0 w-full bg-background/90 backdrop-blur-xs px-4 py-2  flex items-center justify-center border-b border-border`}
      >
        <Image
          height={50}
          width={120}
          src="/logo/icon/icon.svg"
          alt="Logo Locaterra"
          className="w-auto h-12"
          priority
        />
      </header>
    );
  }
  return (
    <header
      className={` ${
        occultInPrivate && "hidden"
      } md:fixed z-50 top-0 w-full flex items-center justify-center bg-background/90 backdrop-blur-xs border-b border-border`}
    >
      <div
        className={` w-full max-w-7xl px-4 2xl:px-0 h-16 flex items-center justify-between gap-6 transition-all duration-300 ease-in-out `}
      >
        {onBack && (
          <button
            title="Botão de voltar"
            aria-label="Botão de voltar"
            onClick={onBack}
            className="hover:bg-slate-600/10 p-2 rounded-full transition-all"
          >
            <ArrowLeftIcon className="w-7 h-7" />
          </button>
        )}
        <div className="flex-1 flex justify-center">
          <Image
            height={50}
            width={120}
            src="/logo/icon/icon.svg"
            alt="Logo Locaterra"
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
