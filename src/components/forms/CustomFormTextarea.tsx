"use client";
import clsx from "clsx";
import { forwardRef, useState } from "react";

interface CustomTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  icon: React.ReactElement;
  error?: string;
  id: string;
  className?: string;
  maxLength?: number;
}

export const CustomFormTextarea = forwardRef<
  HTMLTextAreaElement,
  CustomTextareaProps
>(
  (
    { label, icon, error, id, disabled, className, value, maxLength, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const charCount = String(value || "").length;

    const containerClasses = clsx(
      "flex items-start w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 bg-white",
      {
        "border-primary ring-2 ring-primary/20": isFocused && !error,
        "border-error ring-2 ring-error/20": !!error,
        "border-gray-300": !isFocused && !error,
        "hover:border-gray-400": !disabled && !error && !isFocused,
        "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed":
          disabled,
      }
    );

    const iconContainerClasses = clsx(
      "mr-2 mt-1 transition-colors duration-300",
      {
        "text-primary": isFocused && !error,
        "text-error": !!error,
        "text-gray-500": !isFocused && !error,
      }
    );

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
          <textarea
            {...props}
            ref={ref}
            id={id}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            className="w-full bg-transparent outline-none text-foreground placeholder:text-gray-400 resize-y"
            rows={5}
            maxLength={maxLength}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          {error && <span className="text-error text-sm">{error}</span>}
          {maxLength && (
            <span className="text-xs text-gray-400 ml-auto">
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

CustomFormTextarea.displayName = "CustomFormTextarea";
