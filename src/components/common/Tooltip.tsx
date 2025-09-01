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
  // position = "top",
  className,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [style, setStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});

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

      let left =
        triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
      const top = triggerRect.top - tooltipRect.height - margin;

      if (left < margin) {
        left = margin;
      }

      if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }

      newStyle.top = top;
      newStyle.left = left;
      setStyle(newStyle);

      const arrowLeft = triggerRect.left + triggerRect.width / 2 - left;
      setArrowStyle({ left: `${arrowLeft}px` });
    }
  }, [isOpen]);

  const tooltipVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 5 },
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
            "z-50 w-max max-w-xs rounded-md bg-gray-800 px-3 py-2 text-sm font-normal text-white shadow-lg",
            className
          )}
        >
          {content}
          <div
            style={arrowStyle}
            className="absolute bottom-[-4px] -translate-x-1/2 h-0 w-0 border-[4px] border-l-transparent border-r-transparent border-t-gray-800"
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
