import React from "react";

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
}: CustomButtonProps) {
  const baseClasses = `
    px-4 py-2 
    ${rounded}
    ${fontSize}
    transition-all 
    duration-200
    font-medium
    gap-2
    items-center 
    flex justify-center
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  // Define a cor de texto padrão para o modo ghost, caso não seja especificada.
  // Isso evita que o texto fique branco em um fundo branco.
  const finalTextColor =
    ghost && textColor === "text-white" ? "text-gray-700" : textColor;

  const variantClasses = ghost
    ? `bg-transparent ${finalTextColor} border-2 border-transparent hover:bg-gray-100 hover:border-gray-200`
    : `${color} ${textColor} hover:brightness-95`;

  const disabledClasses = disabled ? "opacity-60 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
      title={title}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
