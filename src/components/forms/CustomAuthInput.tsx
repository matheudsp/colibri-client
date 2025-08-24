"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";
import { formatCurrency, unmaskCurrency } from "@/utils/masks/maskCurrency";
import { dateMask } from "@/utils/masks/maskDate";
import { phoneMask, unmaskPhone } from "@/utils/masks/maskPhone";
import { formatCEP } from "@/utils/formatters/formatCEP";
import { formatNumeric } from "@/utils/masks/maskNumeric";
import { cpfCnpjMask } from "@/utils/masks/cpfCnpjMask";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  icon: React.ReactElement;
  registration?: UseFormRegisterReturn;
  error?: string;
  id: string;
  colorBg?: string;
  textColor?: string;
  mask?: "currency" | "date" | "phone" | "cep" | "numeric" | "cpfCnpj";
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export function CustomAuthInput({
  type = "text",
  label,
  icon,
  registration,
  error,
  id,
  colorBg = "bg-primary",
  textColor = "text-white",
  mask,
  onBlur,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getInitialDisplayValue = () => {
    const initialValue = (props.value || props.defaultValue || "").toString();

    switch (mask) {
      case "currency":
        return formatCurrency(initialValue);
      case "date":
        return dateMask(initialValue);
      case "phone":
        return phoneMask(initialValue);
      case "cep":
        return formatCEP(initialValue);
      case "numeric":
        return formatNumeric(initialValue);
      case "cpfCnpj":
        return cpfCnpjMask(initialValue);
      default:
        return initialValue;
    }
  };
  const [displayValue, setDisplayValue] = useState(getInitialDisplayValue);

  useEffect(() => {
    const externalValue = (props.value || "").toString();
    if (mask === "date") {
      setDisplayValue(dateMask(externalValue));
    } else {
      setDisplayValue(externalValue);
    }
  }, [props.value, mask]);

  const isPassword = type === "password";

  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : mask === "date"
    ? "text"
    : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let valueToRegister = value;
    let formattedDisplayValue = value;

    switch (mask) {
      case "currency": {
        const numericString = unmaskCurrency(value);
        valueToRegister = numericString || "";
        formattedDisplayValue = formatCurrency(value);
        break;
      }
      case "numeric": {
        const unmasked = value.replace(/[^\d,]/g, "").replace(",", ".");
        valueToRegister = unmasked;
        formattedDisplayValue = formatNumeric(value);
        break;
      }
      case "date": {
        formattedDisplayValue = dateMask(value);
        valueToRegister = formattedDisplayValue;
        break;
      }
      case "phone": {
        formattedDisplayValue = phoneMask(value);
        valueToRegister = unmaskPhone(formattedDisplayValue);
        break;
      }
      case "cep": {
        valueToRegister = value.replace(/\D/g, "");
        formattedDisplayValue = formatCEP(value);
        break;
      }
      case "cpfCnpj": {
        formattedDisplayValue = cpfCnpjMask(value);
        valueToRegister = formattedDisplayValue.replace(/\D/g, "");
        break;
      }
      default:
        setDisplayValue(value);
        if (registration?.onChange) {
          registration.onChange(e);
        }
        return;
    }

    setDisplayValue(formattedDisplayValue);

    if (registration?.onChange) {
      const fakeEvent = {
        ...e,
        target: { ...e.target, value: valueToRegister },
      };
      registration.onChange(fakeEvent);
    }
  };

  return (
    <div className="relative w-full pt-2">
      <div
        className={`flex items-center border-b-2 px-2 py-2 rounded transition-all duration-200 ${colorBg} ${
          error ? "border-error" : "border-background"
        }`}
      >
        <div className="w-full flex">
          <div className={`mr-2 ${textColor}`}>{icon}</div>
          <input
            {...props}
            {...registration}
            onChange={handleChange}
            value={displayValue}
            type={inputType}
            id={id}
            maxLength={mask === "date" ? 10 : undefined}
            inputMode={
              mask === "currency" ||
              mask === "date" ||
              mask === "phone" ||
              mask === "cep" ||
              mask === "cpfCnpj"
                ? "numeric"
                : "text"
            }
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              registration?.onBlur?.(e);
              onBlur?.(e);
            }}
            className={`w-full bg-transparent outline-none placeholder-transparent ${textColor}`}
            placeholder={label}
          />
          <label
            htmlFor={id}
            className={`
              absolute left-0 transition-all duration-200 pointer-events-none ${textColor}
              ${
                isFocused || displayValue
                  ? "ms-8 -translate-y-5 text-sm text-white"
                  : "ms-12 translate-y-0 text-base text-gray-300"
              }
            `}
          >
            {label}
          </label>
        </div>
        {isPassword && (
          <button
            title={showPassword ? "Esconder senha" : "Mostrar senha"}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`ml-2 focus:outline-none ${textColor}`}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <span className="text-error text-sm mt-1 block transition-all duration-200">
          {error}
        </span>
      )}
    </div>
  );
}
