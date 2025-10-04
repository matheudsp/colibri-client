import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface CustomButtonProps {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  fontSize?: string;
  color?: string;
  textColor?: string;
  rounded?: string;
  disabled?: boolean;
  ghost?: boolean;
  icon?: React.ReactElement;
  className?: string;
  title?: string;
  isLoading?: boolean;
}

export function CustomButton({
  children,
  onClick,
  type = "button",
  fontSize = "text-base",
  color = "bg-secondary",
  textColor = "text-white",
  rounded = "rounded-md",
  disabled = false,
  ghost = false,
  icon,
  className = "",
  title,
  isLoading = false,
}: CustomButtonProps) {
  const baseClasses = `
    px-4 py-2 
    ${fontSize}
    transition-all 
    duration-200
    font-medium
    gap-2
    items-center 
    flex justify-center
    focus:outline-hidden focus:ring-2 focus:ring-offset-2
    relative overflow-hidden
    cursor-pointer
  `;

  const finalTextColor =
    ghost && textColor === "text-white" ? "text-gray-700" : textColor;
  const variantClasses = ghost
    ? `bg-transparent ${finalTextColor} border border-border hover:bg-gray-200 hover:border-gray-400`
    : `${color} ${textColor} hover:brightness-95`;

  const disabledClasses =
    disabled || isLoading ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={clsx(
        className,
        baseClasses,
        variantClasses,
        disabledClasses,
        rounded
      )}
      title={title}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={isLoading ? "loading" : "content"}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center gap-2"
        >
          {/* 3. Lógica de loading corrigida */}
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              {icon && <span>{icon}</span>}
              {children}
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
