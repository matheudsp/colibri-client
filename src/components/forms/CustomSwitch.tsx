"use client";

import clsx from "clsx";
import { Loader2, HelpCircle } from "lucide-react";
import { Tooltip } from "@/components/common/Tooltip";

interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label: string;
  isLoading?: boolean;
  tip?: string;
}

export function CustomSwitch({
  checked,
  onChange,
  disabled = false,
  label,
  isLoading = false,
  tip,
}: CustomSwitchProps) {
  const handleToggle = () => {
    if (!disabled && !isLoading) {
      onChange(!checked);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-gray-700 text-sm">{label}</span>
        {tip && (
          <Tooltip content={tip} position="top">
            <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
          </Tooltip>
        )}
      </div>

      {isLoading ? (
        <Loader2 className="animate-spin text-primary h-5 w-5" />
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleToggle}
          disabled={disabled}
          className={clsx(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2",
            {
              "bg-primary": checked,
              "bg-gray-300": !checked,
              "cursor-not-allowed opacity-75": disabled,
            }
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
              {
                "translate-x-5": checked,
                "translate-x-0": !checked,
              }
            )}
          />
        </button>
      )}
    </div>
  );
}
