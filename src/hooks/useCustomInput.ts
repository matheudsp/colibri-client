"use client";

import { useState, useMemo, ChangeEvent, FocusEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx";

import { formatCurrency, unmaskCurrency } from "@/utils/masks/maskCurrency";
import { dateMask } from "@/utils/masks/maskDate";
import { phoneMask, unmaskPhone } from "@/utils/masks/maskPhone";
import { formatCEP } from "@/utils/formatters/formatCEP";
import { formatNumeric } from "@/utils/masks/maskNumeric";
import { cpfCnpjMask } from "@/utils/masks/cpfCnpjMask";

export type CustomInputMask =
  | "currency"
  | "date"
  | "phone"
  | "cep"
  | "numeric"
  | "cpfCnpj";

export interface UseCustomInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onFocus" | "onBlur"
  > {
  label?: string;
  icon?: React.ReactElement;
  error?: string;
  mask?: CustomInputMask;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  registration?: UseFormRegisterReturn;
  baseClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
}

export function useCustomInput(props: UseCustomInputProps) {
  const {
    label,
    icon,
    error,
    mask,
    disabled,
    value: controlledValue,
    defaultValue,
    onChange: controlledOnChange,
    onBlur: controlledOnBlur,
    onFocus: controlledOnFocus,
    registration,
    baseClassName,
    inputClassName,
    labelClassName,
    ...restProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const value =
    controlledValue !== undefined
      ? String(controlledValue)
      : String(internalValue);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    controlledOnFocus?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    controlledOnBlur?.(e);
    registration?.onBlur(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let valueToUpdate: string | number = rawValue;

    if (mask) {
      if (!String(value).includes("*")) {
        switch (mask) {
          case "currency":
            valueToUpdate = unmaskCurrency(rawValue);
            break;
          case "phone":
            valueToUpdate = unmaskPhone(rawValue);
            break;
          case "numeric":
          case "cep":
          case "cpfCnpj":
            valueToUpdate = rawValue.replace(/\D/g, "");
            break;
          default:
            valueToUpdate = rawValue;
        }
      }
    }

    if (controlledOnChange) {
      controlledOnChange(String(valueToUpdate));
    } else if (registration?.onChange) {
      const fakeEvent = {
        ...e,
        target: { ...e.target, value: String(valueToUpdate) },
      };
      registration.onChange(fakeEvent);
    } else {
      setInternalValue(rawValue);
    }
  };

  const displayValue = useMemo(() => {
    const stringValue = String(value);
    if (stringValue.includes("*")) return stringValue;
    if (!mask) return stringValue;

    switch (mask) {
      case "currency":
        return formatCurrency(stringValue);
      case "numeric":
        return formatNumeric(stringValue);
      case "date":
        return dateMask(stringValue);
      case "phone":
        return phoneMask(stringValue);
      case "cep":
        return formatCEP(stringValue);
      case "cpfCnpj":
        return cpfCnpjMask(stringValue);
      default:
        return stringValue;
    }
  }, [value, mask]);

  const baseClasses = useMemo(
    () => clsx("w-full", baseClassName),
    [baseClassName]
  );

  const containerClasses = useMemo(
    () =>
      clsx(
        "flex items-center w-full px-3 py-2 rounded-lg border-2 transition-all duration-300",
        {
          "border-primary ring-2 ring-primary/20": isFocused && !error,
          "border-error ring-2 ring-error/20": !!error,
          "border-gray-300 bg-white": !isFocused && !error && !disabled,
          "hover:border-gray-400": !disabled && !error && !isFocused,
          "bg-gray-100 border-gray-50 cursor-not-allowed ": disabled,
        }
      ),
    [isFocused, error, disabled]
  );

  const inputClasses = useMemo(
    () =>
      clsx(
        "w-full bg-transparent outline-hidden text-foreground placeholder:text-gray-400",
        {
          "cursor-not-allowed text-gray-700": disabled,
        },
        inputClassName
      ),
    [disabled, inputClassName]
  );

  const labelClasses = useMemo(
    () =>
      clsx(
        "block text-sm font-medium mb-1",
        {
          "text-error": !!error,
          "text-secondary": !error,
          "text-gray-600": disabled,
        },
        labelClassName
      ),
    [error, disabled, labelClassName]
  );

  const iconContainerClasses = useMemo(
    () =>
      clsx("mr-2 transition-colors duration-300", {
        "text-primary": isFocused && !error,
        "text-error": !!error,
        "text-gray-400": !isFocused && !error,
        "text-gray-500": disabled,
      }),
    [isFocused, error, disabled]
  );

  return {
    ...restProps,
    label,
    icon,
    error,
    disabled,
    displayValue,
    isFocused,
    baseClasses,
    containerClasses,
    inputClasses,
    labelClasses,
    iconContainerClasses,
    handleFocus,
    handleBlur,
    handleChange,
  };
}
