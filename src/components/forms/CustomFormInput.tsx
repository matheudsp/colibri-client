"use client";

import { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { formatCEP } from "@/utils/formatters/formatCEP";
import { formatCurrency, unmaskCurrency } from "@/utils/masks/maskCurrency";
import { dateMask } from "@/utils/masks/maskDate";
import { phoneMask, unmaskPhone } from "@/utils/masks/maskPhone";
import { decimalMask } from "@/utils/masks/maskDecimal";
import { parseDecimalValue } from "@/utils/formatters/formatDecimal";
import { formatNumeric, unmaskNumeric } from "@/utils/masks/maskNumeric";

interface BasicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | undefined;
  icon: React.ReactElement;
  registration?: UseFormRegisterReturn;
  colorBg?: string;
  textColor?: string;
  borderColor?: string;
  error?: string;
  id: string;
  defaultValue?: string | number;
  value?: string;
  className?: string;
  mask?: "cep" | "currency" | "date" | "phone" | "numeric";
  onDebouncedChange?: (value: string) => void;
}

export function CustomFormInput({
  type = "text",
  label,
  icon,
  defaultValue,
  value,
  registration,
  colorBg = "bg-white",
  textColor = "text-foreground",
  borderColor,
  error,
  id,
  disabled,
  required,
  maxLength,
  minLength,
  className,
  mask,
  onDebouncedChange,
  ...props
}: BasicInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(
    defaultValue || value || ""
  );

  useEffect(() => {
    if (value !== undefined) {
      let formattedValue = String(value);
      if (mask === "currency") {
        formattedValue = formatCurrency(formattedValue);
      } else if (mask === "date") {
        formattedValue = dateMask(formattedValue);
      } else if (mask === "cep") {
        formattedValue = formatCEP(formattedValue);
      } else if (mask === "phone") {
        formattedValue = phoneMask(formattedValue);
      }
      setInternalValue(formattedValue);
    }
  }, [value, mask]);

  const hasValue = Boolean(internalValue) || Boolean(defaultValue);

  const containerClasses = `
    flex items-center w-full px-4 py-2 rounded-lg transition-all duration-300
    ${colorBg} ${textColor}
    ${
      error
        ? "border-2 border-error"
        : borderColor
        ? `border-2 ${borderColor}`
        : "border-2 border-gray-300"
    }
    ${isFocused ? "border-primary" : "hover:border-primary-hover"}
    ${disabled ? "bg-gray-200 cursor-not-allowed" : ""}
  `;

  const inputClasses = `
    w-full bg-transparent outline-none placeholder-transparent
    ${disabled ? "cursor-not-allowed" : ""}
  `;

  const labelClasses = `
    absolute left-0 transition-all duration-200 pointer-events-none 
    ${
      isFocused || hasValue
        ? " -translate-y-5 text-xs text-primary font-semibold"
        : "translate-y-0 text-base text-gray-400"
    }
    ${disabled ? "text-gray-500" : ""}
  `;

  const inputProps = { ...props, ...registration };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let valueToRegister: string = value;

    if (mask === "currency") {
      valueToRegister = formatCurrency(value);
    } else if (mask === "numeric") {
      valueToRegister = formatNumeric(value);
    } else if (mask === "date") {
      valueToRegister = dateMask(value);
    } else if (mask === "cep") {
      valueToRegister = formatCEP(value);
    } else if (mask === "phone") {
      valueToRegister = phoneMask(value);
    }

    setInternalValue(valueToRegister);

    if (registration?.onChange) {
      const fakeEvent = {
        ...e,
        target: { ...e.target, value: valueToRegister },
      };
      registration.onChange(fakeEvent);
    }

    if (props.onChange) {
      const fakeEvent = {
        ...e,
        target: { ...e.target, value: valueToRegister },
      };
      props.onChange(fakeEvent);
    }
  };

  const inputType = mask === "date" ? "text" : type;

  return (
    <div className={`w-full ${className}`}>
      <div className={containerClasses}>
        <div className={`mr-3 ${textColor}`}>{icon}</div>
        <div className="w-full relative">
          <input
            {...inputProps}
            type={inputType}
            inputMode={
              mask === "currency" ||
              mask === "date" ||
              mask === "cep" ||
              mask === "phone" ||
              mask === "numeric"
                ? "numeric"
                : "text"
            }
            value={internalValue}
            id={id}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              registration?.onBlur?.(e);
              props.onBlur?.(e);
            }}
            onChange={handleChange}
            className={inputClasses}
            placeholder={label}
            disabled={disabled}
            required={required}
            maxLength={
              mask === "cep"
                ? 9
                : mask === "date"
                ? 10
                : mask === "phone"
                ? 15
                : maxLength
            }
            minLength={minLength}
          />
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        </div>
      </div>
      {error && (
        <span className="text-error text-sm mt-1 block transition-all duration-300">
          {error}
        </span>
      )}
    </div>
  );
}
