"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

type DropdownItem = {
  label: string;
  action?: () => void;
  icon?: ReactNode;
  type?: "normal" | "custom";
  customContent?: ReactNode;
  className?: string;
  disabled?: boolean;
};

type DropdownProps = {
  trigger: ReactNode;
  items: DropdownItem[];
  open?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  bg?: string;
  textColor?: string;
  hoverBg?: string;
  zIndex?: string;
  className?: string;
  onOpenChange?: (open: boolean) => void;
};

export function DropdownMenu({
  trigger,
  items,
  open,
  onOpenChange,
  side = "bottom",
  align = "start",
  bg = "bg-background",
  textColor = "text-gray-800",
  hoverBg = "hover:bg-gray-100",
  zIndex = "z-20",
  className = "",
}: DropdownProps) {
  return (
    <Dropdown.Root open={open} onOpenChange={onOpenChange}>
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content
          side={side}
          align={align}
          sideOffset={5}
          className={`
            min-w-[8rem] overflow-hidden rounded-md border border-border p-1 shadow-md
            ${zIndex}
            ${bg} ${textColor} ${className}
          `}
        >
          {items.map((item, index) => (
            <div key={index} className="mb-1 last:mb-0">
              {item.type === "custom" ? (
                <div className="p-1">{item.customContent}</div>
              ) : (
                <Dropdown.Item
                  onSelect={() => item.action?.()}
                  disabled={item.disabled}
                  className={`
                    flex items-center gap-2 px-2 py-1.5 rounded-md w-full cursor-pointer outline-none border border-transparent
                    ${
                      item.disabled
                        ? "opacity-50 cursor-not-allowed"
                        : `${hoverBg} hover:border-border`
                    }
                    ${item.className}
                  `}
                >
                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span className="flex-1 text-left">{item.label}</span>
                </Dropdown.Item>
              )}
            </div>
          ))}
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
}
