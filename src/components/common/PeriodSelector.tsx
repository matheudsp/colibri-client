"use client";

import { cn } from "@/utils/helpers/cn";

export const periodOptions = [
  { value: "last_6_months", label: "Últimos 6 meses" },
  { value: "this_year", label: "Este Ano" },
  { value: "last_year", label: "Ano Passado" },
] as const;

export type PeriodValue = (typeof periodOptions)[number]["value"];

interface PeriodSelectorProps {
  selectedPeriod: PeriodValue;
  onPeriodChange: (period: PeriodValue) => void;
}

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
}: PeriodSelectorProps) {
  return (
    <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
      {periodOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
            selectedPeriod === option.value
              ? "bg-white text-gray-900 shadow-sm"
              : "bg-transparent text-gray-500 hover:bg-gray-200"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
