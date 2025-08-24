"use client";
import clsx from "clsx";
import { forwardRef, ChangeEvent, useState } from "react";

import { formatCEP } from "@/utils/formatters/formatCEP";
import { dateMask } from "@/utils/masks/maskDate";
import { phoneMask } from "@/utils/masks/maskPhone";
import { formatNumeric } from "@/utils/masks/maskNumeric";
import { cpfCnpjMask } from "@/utils/masks/cpfCnpjMask";

interface BasicInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  icon: React.ReactElement;
  error?: string;
  id: string;
  mask?: "cep" | "currency" | "date" | "phone" | "numeric" | "cpfCnpj";
  className?: string;
  value?: string | number;
  onChange?: (value: string) => void;
}

export const CustomFormInput = forwardRef<HTMLInputElement, BasicInputProps>(
  (
    {
      type = "text",
      label,
      icon,
      error,
      id,
      disabled,
      mask,
      className,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let valueToRegister = rawValue;

      if (
        mask === "numeric" ||
        mask === "currency" ||
        mask === "phone" ||
        mask === "cep" ||
        mask === "cpfCnpj"
      ) {
        valueToRegister = rawValue.replace(/\D/g, "");
      } else if (mask === "date") {
        valueToRegister = dateMask(rawValue);
      }

      onChange?.(valueToRegister);
    };

    let displayValue = String(value || "");
    if (mask) {
      switch (mask) {
        case "currency":
        case "numeric":
          displayValue = formatNumeric(displayValue);
          break;
        case "date":
          displayValue = dateMask(displayValue);
          break;
        case "cep":
          displayValue = formatCEP(displayValue);
          break;
        case "phone":
          displayValue = phoneMask(displayValue);
          break;
        case "cpfCnpj":
          displayValue = cpfCnpjMask(displayValue);
          break;
      }
    }

    const inputType = mask === "date" ? "text" : type;

    const containerClasses = clsx(
      "flex items-center w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 bg-white",
      {
        "border-primary ring-2 ring-primary/20": isFocused && !error,
        "border-error ring-2 ring-error/20": !!error,
        "border-gray-300": !isFocused && !error,
        "hover:border-gray-400": !disabled && !error && !isFocused,
        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed":
          disabled,
      }
    );

    const iconContainerClasses = clsx("mr-2 transition-colors duration-300", {
      "text-primary": isFocused && !error,
      "text-error": !!error,
      "text-gray-500": !isFocused && !error,
    });

    return (
      <div className={clsx("w-full", className)}>
        {label && (
          <label
            htmlFor={id}
            className={clsx("block text-sm font-medium mb-1", {
              "text-error": !!error,
              "text-secondary": !error,
            })}
          >
            {label}
          </label>
        )}
        <div className={containerClasses}>
          {icon && <div className={iconContainerClasses}>{icon}</div>}
          <input
            {...props}
            ref={ref}
            id={id}
            type={inputType}
            value={displayValue}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            disabled={disabled}
            className="w-full bg-transparent outline-none text-foreground placeholder:text-gray-400"
            placeholder={props.placeholder}
            inputMode={
              mask === "currency" ||
              mask === "numeric" ||
              mask === "cep" ||
              mask === "phone" ||
              mask === "cpfCnpj"
                ? "numeric"
                : "text"
            }
          />
        </div>
        {error && (
          <span className="text-error text-sm mt-1 block">{error}</span>
        )}
      </div>
    );
  }
);

CustomFormInput.displayName = "CustomFormInput";
