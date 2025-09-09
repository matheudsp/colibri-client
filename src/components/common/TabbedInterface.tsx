// src/components/common/TabbedInterface.tsx

"use client";

import { useState, ReactNode } from "react";
import clsx from "clsx";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export interface TabItem {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  subTabs?: TabItem[];
}

interface TabbedInterfaceProps {
  tabs: TabItem[];
  title?: string;
  initialTabId?: string;
  level?: number;
}

export function TabbedInterface({
  tabs,
  title,
  initialTabId,
  level = 0,
}: TabbedInterfaceProps) {
  if (!tabs || tabs.length === 0) return null;

  const [activeTabId, setActiveTabId] = useState(initialTabId || tabs[0].id);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const tabButtonClasses = (isActive: boolean) =>
    clsx(
      // Estilo base para todos os botões de aba
      "flex items-center gap-2 px-4 py-2.5 outline-none transition-colors duration-200 border-r border-gray-300",
      {
        // Aba Ativa: Fundo branco para se conectar ao conteúdo, sem borda inferior
        "bg-white text-secondary font-semibold": isActive,

        // Aba Inativa: Fundo sutil, texto cinza e uma borda inferior para se separar do conteúdo
        "bg-gray-100/50 text-gray-500 hover:bg-gray-200/60 hover:text-secondary border-b border-gray-300":
          !isActive,
      }
    );

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <div className={clsx("w-full", level > 0 && "mt-4")}>
      {title && level === 0 && (
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          {title}
        </h1>
      )}

      {/* Container principal que define o "card" com bordas arredondadas */}
      <div className="border border-gray-300  rounded-lg shadow-sm overflow-hidden">
        {/* A nav agora é o cabeçalho das abas, com os separadores */}
        <nav className="flex flex-wrap bg-gray-200/50 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={tabButtonClasses(activeTabId === tab.id)}
              aria-selected={activeTabId === tab.id}
              role="tab"
            >
              {tab.icon}
              <span className="hidden sm:inline whitespace-nowrap">
                {tab.title}
              </span>
            </button>
          ))}
        </nav>

        {/* O painel de conteúdo com fundo branco */}
        <main className="p-6 bg-white">
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTab.id}
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {activeTab.content}

                {activeTab.subTabs && activeTab.subTabs.length > 0 && (
                  <div className="mt-4">
                    <TabbedInterface
                      tabs={activeTab.subTabs}
                      level={level + 1}
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
