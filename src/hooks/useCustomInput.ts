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
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  icon?: React.ReactElement;
  error?: string;
  mask?: CustomInputMask;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
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
  // const hasValue = !!value;

  const handleFocus = () => setIsFocused(true);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    controlledOnBlur?.(e);
    registration?.onBlur(e);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let valueToUpdate: string | number = rawValue;

    // Unmask para o state do formulário
    if (mask) {
      switch (mask) {
        case "currency":
          valueToUpdate = unmaskCurrency(rawValue);
          break;
        case "phone":
          valueToUpdate = unmaskPhone(rawValue);
          break;
        case "numeric":
          valueToUpdate = rawValue.replace(/\D/g, "");
          break;
        default:
          valueToUpdate = rawValue.replace(/\D/g, "");
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

  // Formata o valor para exibição no input
  const displayValue = useMemo(() => {
    let formatted = String(value);
    switch (mask) {
      case "currency":
        formatted = formatCurrency(formatted);
        break;
      case "numeric":
        formatted = formatNumeric(formatted);
        break;
      case "date":
        formatted = dateMask(formatted);
        break;
      case "phone":
        formatted = phoneMask(formatted);
        break;
      case "cep":
        formatted = formatCEP(formatted);
        break;
      case "cpfCnpj":
        formatted = cpfCnpjMask(formatted);
        break;
    }
    return formatted;
  }, [value, mask]);

  const baseClasses = useMemo(
    () => clsx("w-full", baseClassName),
    [baseClassName]
  );

  const containerClasses = useMemo(
    () =>
      clsx(
        "flex items-center w-full px-3 py-2 rounded-lg border-2 transition-all duration-300 bg-white",
        {
          "border-primary ring-2 ring-primary/20": isFocused && !error,
          "border-error ring-2 ring-error/20": !!error,
          "border-gray-300": !isFocused && !error,
          "hover:border-gray-400": !disabled && !error && !isFocused,
          "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed":
            disabled,
        }
      ),
    [isFocused, error, disabled]
  );

  const inputClasses = useMemo(
    () =>
      clsx(
        "w-full bg-transparent outline-none text-foreground placeholder:text-gray-400",
        { "cursor-not-allowed": disabled },
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
        },
        labelClassName
      ),
    [error, labelClassName]
  );

  const iconContainerClasses = useMemo(
    () =>
      clsx("mr-2 transition-colors duration-300", {
        "text-primary": isFocused && !error,
        "text-error": !!error,
        "text-gray-400": !isFocused && !error,
        "text-gray-300": disabled,
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
