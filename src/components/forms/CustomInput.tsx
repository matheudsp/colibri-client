// src/components/forms/CustomInput.tsx

"use client";

import { forwardRef, useState } from "react";
import { useCustomInput, UseCustomInputProps } from "@/hooks/useCustomInput";
import { Loader2, Eye, EyeOff } from "lucide-react";
import clsx from "clsx";

export type CustomInputProps = UseCustomInputProps & {
  isLoading?: boolean;
};

export const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ isLoading, ...props }, ref) => {
    const {
      id,
      label,
      icon,
      error,
      disabled,
      displayValue,
      isFocused,
      baseClasses,
      containerClasses,
      inputClasses: originalInputClasses,
      labelClasses,
      iconContainerClasses,
      handleFocus,
      handleBlur,
      handleChange,
      ...restProps
    } = useCustomInput(props);

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";
    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : props.type;

    const inputClasses = clsx(originalInputClasses);
    return (
      <div className={baseClasses}>
        {label && (
          <label htmlFor={id} className={labelClasses}>
            {label}
          </label>
        )}
        <div className={containerClasses}>
          {icon && <div className={iconContainerClasses}>{icon}</div>}
          <input
            {...restProps}
            id={id}
            ref={ref}
            value={displayValue}
            onFocus={handleFocus}
            type={inputType}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={disabled || isLoading}
            className={inputClasses}
            placeholder={props.placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center justify-center pl-2 pr-3 text-gray-500 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-r-md"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          {isLoading && <Loader2 className="animate-spin text-primary ml-2" />}
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1 ml-1 text-sm text-error"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";
