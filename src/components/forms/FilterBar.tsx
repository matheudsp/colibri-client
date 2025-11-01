"use client";

import { useState, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  Filter,
  ChevronDown,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
} from "lucide-react";
import clsx from "clsx";

import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import { AdvancedFiltersModal } from "../modals/propertyModals/AdvancedFiltersModal";
import { CustomButton } from "./CustomButton";
import { PiEraserFill } from "react-icons/pi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface FilterBarProps {
  form: UseFormReturn<PropertySearchFormValues>;
  onSearch: (data: PropertySearchFormValues) => void;
  loading: boolean;
}
const DEFAULT_SORT_VALUE = "createdAt:desc";
export function FilterBar({ form, onSearch, loading }: FilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { watch, setValue, handleSubmit, reset, getValues } = form;
  const transactionType = watch("transactionType");
  const sort = watch("sort");

  const hasActiveFilters = useMemo(() => {
    const currentValues = getValues();

    if (currentValues.q && currentValues.q !== "") {
      return true;
    }

    if (currentValues.sort && currentValues.sort !== DEFAULT_SORT_VALUE) {
      return true;
    }

    if (
      currentValues.city ||
      currentValues.state ||
      currentValues.propertyType
      // || currentValues.minPrice
      // || currentValues.numRooms
    ) {
      return true;
    }
    return false;
  }, [getValues]);

  const handleTransactionChange = (type: "VENDA" | "LOCACAO") => {
    setValue("transactionType", type, { shouldDirty: true });
    handleSubmit(onSearch)();
  };

  const handleSortChange = (value: string) => {
    setValue("sort", value, { shouldDirty: true });
    handleSubmit(onSearch)();
  };
  const handleClearFilters = () => {
    reset({
      transactionType: transactionType,
      sort: DEFAULT_SORT_VALUE,
      q: "",
      city: undefined,
      state: undefined,
      propertyType: undefined,
    });
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
      <div className="w-full bg-card p-3 rounded-xl shadow-md border border-border flex flex-wrap items-center gap-2">
        {/* Toggle Venda / Locação */}
        <div className="flex bg-muted rounded-2xl p-1">
          <button
            type="button"
            onClick={() => handleTransactionChange("VENDA")}
            disabled={loading}
            className={clsx(
              "px-4 py-1.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer",
              {
                "bg-secondary text-secondary-foreground shadow-sm":
                  transactionType === "VENDA" || !transactionType,
                "text-muted-foreground hover:bg-card":
                  transactionType !== "VENDA",
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
              "px-4 py-1.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer",
              {
                "bg-secondary  text-secondary-foreground shadow-sm":
                  transactionType === "LOCACAO" || !transactionType,
                "text-muted-foreground hover:bg-card":
                  transactionType !== "LOCACAO",
              }
            )}
          >
            Locação
          </button>
        </div>

        <div className="grow"></div>
        {hasActiveFilters && (
          <CustomButton
            type="button"
            onClick={handleClearFilters}
            disabled={loading}
            ghost
            rounded="rounded-full"
            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-muted rounded-full border border-border disabled:opacity-50 cursor-pointer"
          >
            <PiEraserFill size={16} /> Limpar filtros
          </CustomButton>
        )}
        <CustomButton
          type="button"
          ghost
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          rounded="rounded-full"
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-foreground hover:bg-muted rounded-full border border-border disabled:opacity-50 cursor-pointer"
        >
          <Filter size={16} /> Filtros
        </CustomButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CustomButton
              ghost
              rounded="rounded-full"
              className="inline-flex justify-center items-center gap-2 rounded-full border border-border hover:bg-muted px-4 py-2 text-sm font-semibold text-foreground cursor-pointer"
              disabled={loading}
            >
              {currentOption?.label || "Ordenar por"}
              <ChevronDown
                className="h-4 w-4 text-foreground"
                aria-hidden="true"
              />
            </CustomButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {options.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className="cursor-pointer "
              >
                <span>{option.label}</span>
                {option.value.endsWith("asc") ? (
                  <ArrowUpWideNarrow
                    size={14}
                    className="ml-auto text-muted-foreground "
                  />
                ) : (
                  <ArrowDownWideNarrow
                    size={14}
                    className="ml-auto text-muted-foreground"
                  />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
