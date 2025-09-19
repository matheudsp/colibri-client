"use client";

import { useState, Fragment } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  Filter,
  ChevronDown,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";

import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import { AdvancedFiltersModal } from "../modals/propertyModals/AdvancedFiltersModal";

interface FilterBarProps {
  form: UseFormReturn<PropertySearchFormValues>;
  onSearch: (data: PropertySearchFormValues) => void;
  loading: boolean;
}

export function FilterBar({ form, onSearch, loading }: FilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { watch, setValue, handleSubmit } = form;
  const transactionType = watch("transactionType");
  const sort = watch("sort");
  const handleTransactionChange = (type: "VENDA" | "LOCACAO") => {
    setValue("transactionType", type, { shouldDirty: true });
    handleSubmit(onSearch)();
  };

  const handleSortChange = (value: string) => {
    setValue("sort", value, { shouldDirty: true });
    handleSubmit(onSearch)();
  };

  const applyFiltersAndCloseModal = () => {
    setIsModalOpen(false);
    handleSubmit(onSearch)();
  };

  const options = [
    { value: "createdAt:desc", label: "Mais Recentes" },
    { value: "price:asc", label: "Menor Preço" },
    { value: "price:desc", label: "Maior Preço" },
    { value: "size:asc", label: "Menor Área" },
    { value: "size:desc", label: "Maior Área" },
  ];

  const currentOption = options.find((option) => option.value === sort);

  return (
    <>
      <div className="w-full bg-white p-3 rounded-xl shadow-md border flex flex-wrap items-center gap-2">
        {/* Toggle Venda / Locação */}
        <div className="flex bg-gray-100 rounded-full p-1">
          <button
            type="button"
            onClick={() => handleTransactionChange("VENDA")}
            disabled={loading}
            className={clsx(
              "px-4 py-1.5 text-sm font-semibold rounded-full transition-colors",
              {
                "bg-secondary text-white shadow-sm":
                  transactionType === "VENDA" || !transactionType,
                "text-gray-600 hover:bg-gray-200": transactionType !== "VENDA",
              }
            )}
          >
            Venda
          </button>
          <button
            type="button"
            onClick={() => handleTransactionChange("LOCACAO")}
            disabled={loading}
            className={clsx(
              "px-4 py-1.5 text-sm font-semibold rounded-full transition-colors",
              {
                "bg-secondary text-white shadow-sm":
                  transactionType === "LOCACAO" || !transactionType,
                "text-gray-600 hover:bg-gray-200":
                  transactionType !== "LOCACAO",
              }
            )}
          >
            Locação
          </button>
        </div>

        <div className="grow"></div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full border disabled:opacity-50"
        >
          <Filter size={16} /> Filtros
        </button>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              className="inline-flex justify-center items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-semibold text-gray-600 shadow-xs hover:bg-gray-100 disabled:opacity-50"
              disabled={loading}
            >
              {currentOption?.label || "Ordenar por"}
              <ChevronDown
                className="h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden">
              <div className="py-1">
                {options.map((option) => (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        onClick={() => handleSortChange(option.value)}
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
      </div>
      <AdvancedFiltersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        control={form.control}
        watch={form.watch}
        setValue={form.setValue}
        onApply={applyFiltersAndCloseModal}
      />
    </>
  );
}
