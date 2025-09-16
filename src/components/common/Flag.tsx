"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FlagProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

export function Flag({ title, isVisible, onClose }: FlagProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
          className="fixed top-0 left-0 w-full md:pl-32 z-10 flex items-center justify-between p-3 bg-secondary-hover text-white text-sm font-semibold shadow-lg"
          role="alert"
        >
          <span className="text-center w-full">{title}</span>
          <button
            onClick={onClose}
            aria-label="Fechar aviso"
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
