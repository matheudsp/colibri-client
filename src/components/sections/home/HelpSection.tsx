"use client";
import { Tag, Wallet, Megaphone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const helpItems = [
  {
    icon: <Tag className="w-6 h-6 text-primary" />,
    title: "Aluguel Rápido e 100% Digital",
    description:
      "Encontre o imóvel ideal e alugue sem burocracia. Propostas, documentos e contratos, tudo online, com validade jurídica.",
    linkText: "Quero alugar",
    href: "/imoveis",
  },
  {
    icon: <Wallet className="w-6 h-6 text-primary" />,
    title: "Pagamentos Automatizados",
    description:
      "Gerencie e receba seus aluguéis com praticidade. Garantimos segurança, previsibilidade e menos preocupações.",
    linkText: "Saiba mais",
    href: "/saiba-mais",
  },
  {
    icon: <Megaphone className="w-6 h-6 text-primary" />,
    title: "Visibilidade para seu Imóvel",
    description:
      "Anuncie grátis e alcance milhares de potenciais inquilinos. Mais agilidade, mais chances de locação, sem custo inicial.",
    linkText: "Criar conta agora",
    href: "/registrar",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: "Segurança e Controle para Locadores",
    description:
      "Tenha contratos digitais, gestão centralizada e recebimentos garantidos. Aproveite a taxa promocional de 8% — por tempo limitado.",
    linkText: "Entenda",
    href: "/saiba-mais",
  },
];

const AUTOPLAY_INTERVAL = 3500;

export function HelpSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % helpItems.length);
    }, AUTOPLAY_INTERVAL) as unknown as number;
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // touch handlers
  const touchStartX = useRef<number | null>(null);
  const touchDelta = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    touchDelta.current = e.touches[0].clientX - touchStartX.current;
  };
  const onTouchEnd = () => {
    if (touchDelta.current > 50)
      setActiveIndex((s) => (s - 1 + helpItems.length) % helpItems.length);
    else if (touchDelta.current < -50)
      setActiveIndex((s) => (s + 1) % helpItems.length);
    touchStartX.current = null;
    touchDelta.current = 0;
    setTimeout(() => {
      if (intervalRef.current == null && typeof window !== "undefined") {
        intervalRef.current = window.setInterval(() => {
          setActiveIndex((prev) => (prev + 1) % helpItems.length);
        }, AUTOPLAY_INTERVAL) as unknown as number;
      }
    }, 900);
  };

  const prevIndex = (activeIndex - 1 + helpItems.length) % helpItems.length;
  const nextIndex = (activeIndex + 1) % helpItems.length;

  // Layout strategy: use percentage-based left positions for prev/active/next to avoid transform math issues
  // prev: left 25%, active: left 50%, next: left 75% — keeps everything inside viewport on small screens

  return (
    <section className="w-full bg-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto ">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-start text-black mb-4 sm:mb-6">
          Como a Locaterra pode te ajudar?
        </h2>
        <p className="text-gray-500 mb-6 sm:mb-8 max-w-2xl ">
          Soluções pensadas para acelerar o aluguel do seu imóvel, cuidar dos
          pagamentos e dar mais segurança e visibilidade — tudo de forma simples
          e digital.
        </p>

        {/* MOBILE / SMALL: simplified and robust stacking */}
        <div className="block lg:hidden">
          <div
            className="relative w-full overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="relative mx-auto"
              style={{ height: "min(52vh,420px)", maxWidth: "100vw" }}
            >
              {/* PREV */}
              <motion.div
                key={`prev-${prevIndex}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.78, scale: 0.94 }}
                transition={{ duration: 0.45 }}
                className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-[64%] max-w-[86vw] sm:w-[52%] border border-border bg-white p-4 sm:p-5 rounded-2xl shadow-sm z-10 pointer-events-none filter blur-[2px] opacity-80"
                aria-hidden
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full mb-3">
                  {helpItems[prevIndex].icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {helpItems[prevIndex].title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm truncate">
                  {helpItems[prevIndex].description}
                </p>
              </motion.div>

              {/* ACTIVE */}
              <motion.div
                key={`active-${activeIndex}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[78%] max-w-[96vw] sm:w-[64%] bg-white border border-border p-5 sm:p-6 rounded-2xl shadow-2xl z-20 mx-auto"
                aria-labelledby={`help-active-${activeIndex}-title`}
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-3">
                  {helpItems[activeIndex].icon}
                </div>
                <h3
                  id={`help-active-${activeIndex}-title`}
                  className="text-lg sm:text-xl font-semibold text-gray-900"
                >
                  {helpItems[activeIndex].title}
                </h3>
                <p className="text-gray-600 mt-2 text-sm sm:text-base mb-4">
                  {helpItems[activeIndex].description}
                </p>
                <Link
                  href={helpItems[activeIndex].href}
                  className="inline-flex items-center gap-2 text-secondary font-semibold"
                >
                  <span>{helpItems[activeIndex].linkText}</span>
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </motion.div>

              {/* NEXT */}
              <motion.div
                key={`next-${nextIndex}`}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 0.78, scale: 0.94 }}
                transition={{ duration: 0.45 }}
                className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-[64%] max-w-[86vw] sm:w-[52%] border border-border bg-white p-4 sm:p-5 rounded-2xl shadow-sm z-10 pointer-events-none filter blur-[2px] opacity-80"
                aria-hidden
              >
                <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full mb-3">
                  {helpItems[nextIndex].icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {helpItems[nextIndex].title}
                </h3>
                <p className="text-gray-600 mt-1 text-sm truncate">
                  {helpItems[nextIndex].description}
                </p>
              </motion.div>
            </div>

            {/* indicators centered inside container */}
            <div className="absolute left-1/2 transform -translate-x-1/2 bottom-3 sm:bottom-4 z-30">
              <div className="flex gap-2">
                {helpItems.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      activeIndex === index ? "bg-secondary" : "bg-gray-300"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP / TABLET: standard grid */}
        <div className="hidden px-6 mx-auto lg:grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {helpItems.map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-white p-6 border border-border rounded-2xl shadow-md flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600 mt-2 grow">{item.description}</p>
              <Link
                href={item.href}
                className="text-secondary font-bold mt-4 inline-block group"
              >
                {item.linkText}
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                  &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
