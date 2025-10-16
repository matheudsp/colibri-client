"use client";

import { Check } from "lucide-react";
import { ReactNode } from "react";

interface CustomCheckboxProps {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export function CustomCheckbox({
  id,
  label,
  checked,
  onChange,
  error,
  disabled,
}: CustomCheckboxProps) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start space-x-3 cursor-pointer">
        <div className="relative flex items-center">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="absolute opacity-0 w-5 h-5 cursor-pointer"
          />
          <div
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              checked ? "bg-primary border-primary" : "bg-white border-gray-300"
            } ${disabled ? "opacity-50" : ""}`}
          >
            {checked && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
        <span className="text-sm text-gray-600 select-none">{label}</span>
      </label>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}

// Mantenha seu CustomCheckboxGroup se ele for usado em outros lugares
// Se não, você pode substituir o conteúdo do arquivo.
// Adicionei a exportação dele aqui para garantir que não quebre nada.

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  onChange?: (selectedOptions: string[]) => void;
  selectedValues?: string[];
  className?: string;
  gridCols?: number | "full";
  color?: string;
  name: string;
  error?: string;
}

export function CustomCheckboxGroup({
  options = [],
  onChange,
  selectedValues = [],
  className = "",
  gridCols = 1,
  color = "primary",
  error,
  name,
}: CheckboxGroupProps) {
  // ... seu código do CustomCheckboxGroup existente
  const getGridClasses = () => {
    if (gridCols === "full") {
      return "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4";
    }
    return `grid grid-cols-${gridCols} gap-4`;
  };

  const handleCheckboxChange = (value: string) => {
    const newSelected = selectedValues?.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    onChange?.(newSelected);
  };

  return (
    <div className={className}>
      <div className={getGridClasses()}>
        {options.map((option) => (
          <div key={option.value}>
            <label className="flex items-center space-x-3 cursor-pointer">
              <div
                className={`relative w-5 h-5 rounded border-2 border-${color} flex items-center justify-center transition-colors ${
                  selectedValues.includes(option.value)
                    ? `bg-${color}`
                    : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  name={name}
                  checked={selectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="absolute opacity-0 cursor-pointer w-full h-full"
                />
                {selectedValues.includes(option.value) && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-gray-700 select-none">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
