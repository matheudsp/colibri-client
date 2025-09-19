"use client";

import { ReactNode } from "react";
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
  level?: number;
  activeTabId: string;
  onTabChange: (id: string) => void;
}

export function TabbedInterface({
  tabs,
  title,
  level = 0,
  activeTabId,
  onTabChange,
}: TabbedInterfaceProps) {
  if (!tabs || tabs.length === 0) return null;

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const tabButtonClasses = (isActive: boolean) =>
    clsx(
      "flex items-center gap-2 px-4 py-2.5 outline-hidden transition-colors duration-200 border-r border-gray-300",
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

      <div className="border border-gray-300  rounded-lg shadow-xs overflow-hidden">
        <nav className="flex flex-wrap bg-gray-200/50 ">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
                      onTabChange={() => {}}
                      activeTabId={activeTab.subTabs[0]?.id}
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
