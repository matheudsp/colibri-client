import { ChevronDownIcon } from "lucide-react";
import { useState, useRef, useEffect, ReactElement } from "react";
import { createPortal } from "react-dom";
import { FaCheck } from "react-icons/fa";

export interface DropdownOption {
  id: string;
  value: string;
  label: string;
}

interface CustomDropdownInputProps {
  id?: string;
  label?: string;
  options: DropdownOption[];
  selectedOptionValue?: string | null;
  onOptionSelected?: (optionId: string | null) => void;
  placeholder?: string;
  className?: string;
  icon?: ReactElement;
  error?: string;
  disabled?: boolean;
}

function useOnClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function CustomDropdownInput({
  id,
  label,
  options = [],
  selectedOptionValue = null,
  onOptionSelected,
  placeholder = "Selecione uma opção",
  className = "",
  icon,
  error,
  disabled = false,
}: CustomDropdownInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // A CORREÇÃO ESTÁ AQUI: Passando a ref como HTMLElement
  useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, (e) => {
    if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  });

  const toggleDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: DropdownOption) => {
    const newSelectedValue =
      option.value === selectedOptionValue ? null : option.value;
    onOptionSelected?.(newSelectedValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (opt) => opt.value === selectedOptionValue
  );

  const DropdownMenu = () => (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: `${position.top + 8}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
      className="z-50 bg-background shadow-lg rounded-md py-1 border border-border border-opacity-10 focus:outline-hidden max-h-60 overflow-y-auto"
    >
      {options.map((option) => (
        <div
          key={option.id}
          className="p-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
          onClick={() => handleOptionSelect(option)}
        >
          <span>{option.label}</span>
          {selectedOptionValue === option.value && (
            <FaCheck className="h-4 w-4 text-primary" />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className={`w-full mx-auto ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-light text-gray-700 mb-1"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={buttonRef}
          id={id}
          type="button"
          onClick={toggleDropdown}
          className={`w-full px-3 py-2 text-left border-2 rounded-lg shadow-xs bg-white focus:outline-hidden flex justify-between items-center transition-colors duration-200 hover:border-primary ${
            isOpen ? "border-primary" : "border-gray-300"
          }`}
          disabled={disabled}
        >
          <span
            className={` flex items-center gap-2 ${
              selectedOption ? "text-gray-700" : "text-gray-400"
            }`}
          >
            {icon && <span className="text-gray-500">{icon}</span>}
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          <ChevronDownIcon
            className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(<DropdownMenu />, document.body)}
      </div>
      {error && (
        <span className="text-error text-sm mt-1 block transition-all duration-200">
          {error}
        </span>
      )}
    </div>
  );
}
