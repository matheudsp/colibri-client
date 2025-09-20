"use client";

import React, { forwardRef, useState } from "react";
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

    /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable  @typescript-eslint/no-explicit-any */

    const { isFocused: _isFocused, ...inputProps } = restProps as Record<
      string,
      any
    >;

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = props.type === "password";
    const inputType =
      isPassword && !showPassword ? "password" : props.type ?? "text";

    const inputClasses = clsx(
      originalInputClasses,

      "transition duration-150 ease-in-out",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      disabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-text"
    );

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
            {...(inputProps as React.InputHTMLAttributes<HTMLInputElement>)}
            id={id}
            ref={ref}
            value={displayValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            disabled={disabled || isLoading}
            aria-disabled={disabled || isLoading ? true : undefined}
            type={inputType}
            className={inputClasses}
            placeholder={props.placeholder}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${id}-error` : undefined}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className={clsx(
                "flex items-center justify-center px-2 py-1 ml-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                disabled || isLoading
                  ? "opacity-50 pointer-events-none"
                  : "hover:text-primary"
              )}
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden />
              ) : (
                <Eye size={18} aria-hidden />
              )}
            </button>
          )}

          {isLoading && (
            <Loader2
              className="animate-spin ml-2"
              size={18}
              aria-hidden="true"
            />
          )}
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
