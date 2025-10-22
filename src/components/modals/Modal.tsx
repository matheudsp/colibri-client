"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  scrollable?: boolean; // Prop para ativar o layout de rolagem
  maxWidth?: "max-w-md" | "max-w-lg" | "max-w-xl" | "max-w-2xl" | "max-w-7xl";
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 260,
      damping: 20,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    transition: {
      duration: 0.2,
    },
  },
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  scrollable = false,
  maxWidth = "max-w-md",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.3 }}
        >
          {!scrollable && (
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`bg-card rounded-xl shadow-2xl w-full ${maxWidth} m-4 p-6 relative`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </motion.div>
          )}

          {scrollable && (
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className={`bg-background rounded-xl shadow-2xl w-full ${maxWidth} flex flex-col max-h-[90vh]`}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X size={20} />
                </button>
              </div>
              {children}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
