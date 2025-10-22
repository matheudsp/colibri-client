"use client";

import { useState, ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Tooltip({
  children,
  content,
  position = "top", // 1. Prop descomentada
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [style, setStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const [arrowClass, setArrowClass] = useState("bottom-[-4px]"); // 2. Estado para a seta

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const margin = 8;

      const newStyle: React.CSSProperties = { position: "fixed" };

      // 3. Lógica de posicionamento (top vs bottom)
      let top: number;
      if (position === "bottom") {
        top = triggerRect.bottom + margin;
        setArrowClass("top-[-4px]"); // Seta aponta para cima
      } else {
        // Default é "top"
        top = triggerRect.top - tooltipRect.height - margin;
        setArrowClass("bottom-[-4px]"); // Seta aponta para baixo
      }

      // Lógica de centralização horizontal (igual a antes)
      let left =
        triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;

      // Colisão horizontal (igual a antes)
      if (left < margin) {
        left = margin;
      }
      if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }

      newStyle.top = top;
      newStyle.left = left;
      setStyle(newStyle);

      // Lógica da posição da seta (igual a antes)
      const arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
      setArrowStyle({ left: `${arrowLeft}px` });
    }
  }, [isOpen, position]); // 4. Adicionar 'position' ao array de dependências

  const tooltipVariants = {
    // 5. Animação baseada na posição
    hidden: { opacity: 0, scale: 0.95, y: position === "top" ? 5 : -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  const tooltipContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          style={style}
          variants={tooltipVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className={clsx(
            "z-50 w-max max-w-xs rounded-md bg-card/90 backdrop-blur-md px-3 py-2 text-sm font-normal text-foreground border-border border",
            className
          )}
        >
          {content}
          {/* 6. Usar a classe dinâmica da seta */}
          <div
            style={arrowStyle}
            className={clsx(
              "absolute -translate-x-1/2 h-0 w-0 border border-border",
              arrowClass
            )}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </div>
      {isMounted ? createPortal(tooltipContent, document.body) : null}
    </>
  );
}
