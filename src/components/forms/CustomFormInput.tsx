"use client";

import { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { formatCEP } from "@/utils/formatters/formatCEP";

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
  mask?: "cep";
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
  const [internalValue, setInternalValue] = useState("");

  useEffect(() => {
    let initialValue = "";
    if (value !== undefined) {
      initialValue = value;
    } else if (defaultValue !== undefined) {
      initialValue = String(defaultValue);
    }

    if (mask === "cep") {
      setInternalValue(formatCEP(initialValue));
    } else {
      setInternalValue(initialValue);
    }
  }, [value, defaultValue, mask]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onDebouncedChange) {
        onDebouncedChange(internalValue.toString());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [internalValue, onDebouncedChange]);

  const inputProps = registration
    ? { ...registration, ...props }
    : { ...props };

  const containerClasses = `
        flex items-center border-2 ${
          borderColor || "border-gray-200"
        } px-4 py-2 md:py-3 rounded-lg transition-all duration-200 
        ${colorBg}
        ${error ? "border-error" : ""}
        ${disabled ? "bg-gray-200/90 border-gray-100 cursor-not-allowed" : ""}
    `;

  const inputClasses = `
        w-full bg-transparent outline-none placeholder-transparent 
        ${textColor}
        ${disabled ? "cursor-not-allowed" : ""}
    `;

  const labelClasses = `
        absolute left-0 transition-all duration-200 pointer-events-none 
        ${textColor} 
        ${
          isFocused || internalValue
            ? "-top-1/4 opacity-0"
            : "top-1/2 -translate-y-1/2 text-base text-gray-400"
        }
    `;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    let valueToRegister = newValue;

    if (mask === "cep") {
      newValue = formatCEP(newValue);
      valueToRegister = newValue.replace(/\D/g, "");
    }

    setInternalValue(newValue);

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

  return (
    <div className={`w-full ${className}`}>
      <div className={containerClasses}>
        <div className={`mr-3 ${textColor}`}>{icon}</div>
        <div className="w-full relative">
          <input
            {...inputProps}
            type={type}
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
            maxLength={mask === "cep" ? 9 : maxLength}
            minLength={minLength}
          />
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        </div>
      </div>
      {error && (
        <span className="text-error text-sm mt-1 block transition-all duration-200">
          {error}
        </span>
      )}
    </div>
  );
}
