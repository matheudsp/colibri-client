"use client";

import { UseFormReturn } from "react-hook-form";
import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";

interface SortBySelectorProps {
  form: UseFormReturn<PropertySearchFormValues>;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  loading: boolean;
}

export function SortBySelector({
  form,
  onSortChange,
  loading,
}: SortBySelectorProps) {
  const { watch } = form;
  const sortBy = watch("sortBy");
  const sortOrder = watch("sortOrder");

  const handleValueChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split(":");
    onSortChange(newSortBy, newSortOrder);
  };

  const options = [
    { value: "createdAt:desc", label: "Mais Recentes" },
    { value: "price:asc", label: "Menor Preço" },
    { value: "price:desc", label: "Maior Preço" },
    { value: "size:asc", label: "Menor Área" },
    { value: "size:desc", label: "Maior Área" },
  ];

  const currentOption = options.find(
    (option) => option.value === `${sortBy}:${sortOrder}`
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="inline-flex justify-center items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-600 shadow-sm hover:bg-gray-100 disabled:opacity-50"
          disabled={loading}
        >
          {currentOption?.label || "Ordenar por"}
          <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {options.map((option) => (
              <Menu.Item key={option.value}>
                {({ active }) => (
                  <button
                    onClick={() => handleValueChange(option.value)}
                    className={clsx(
                      "group flex w-full items-center px-4 py-2 text-sm",
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    )}
                  >
                    <span>{option.label}</span>
                    {option.value.endsWith("asc") ? (
                      <ArrowUpWideNarrow
                        size={14}
                        className="ml-2 text-gray-500"
                      />
                    ) : (
                      <ArrowDownWideNarrow
                        size={14}
                        className="ml-2 text-gray-500"
                      />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
