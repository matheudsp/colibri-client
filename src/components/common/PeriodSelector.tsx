"use client";

import { cn } from "@/utils/helpers/cn";
import { motion } from "framer-motion";

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
    <div className="relative flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-1 rounded-lg bg-muted p-1 w-full sm:w-auto">
      {periodOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onPeriodChange(option.value)}
          className={cn(
            "relative w-full sm:w-auto rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap text-center focus:outline-none cursor-pointer", //
            selectedPeriod === option.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="relative z-10">{option.label}</span>
          {selectedPeriod === option.value && (
            <motion.div
              layoutId="selected-background"
              className="absolute inset-0 bg-card rounded-md "
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
