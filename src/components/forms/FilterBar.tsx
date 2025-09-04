"use client";

import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { Filter, ListFilter } from "lucide-react";
import clsx from "clsx";

import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import { AdvancedFiltersModal } from "@/components/modals/propertyModals/AdvancedFiltersModal";

interface FilterBarProps {
  form: UseFormReturn<PropertySearchFormValues>;
  onSearch: (data: PropertySearchFormValues) => void;
  loading: boolean;
}

export function FilterBar({ form, onSearch, loading }: FilterBarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { watch, setValue, handleSubmit } = form;
  const transactionType = watch("transactionType");

  const handleTransactionChange = (type: "VENDA" | "LOCACAO") => {
    setValue("transactionType", type, { shouldDirty: true });
    // Dispara a busca imediatamente ao trocar o tipo de transação
    handleSubmit(onSearch)();
  };

  const applyFiltersAndCloseModal = () => {
    setIsModalOpen(false);
    handleSubmit(onSearch)();
  };

  const handleUnsupportedFeature = () => {
    toast.info("Funcionalidade em desenvolvimento.");
  };

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
                "bg-secondary text-white shadow":
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
                "bg-secondary text-white shadow":
                  transactionType === "LOCACAO" || !transactionType,
                "text-gray-600 hover:bg-gray-200":
                  transactionType !== "LOCACAO",
              }
            )}
          >
            Locação
          </button>
        </div>

        <div className="flex-grow"></div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full border disabled:opacity-50"
        >
          <Filter size={16} /> Filtros
        </button>
        <button
          type="button"
          onClick={handleUnsupportedFeature}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-full border disabled:opacity-50"
        >
          Mais próximos <ListFilter size={16} />
        </button>
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
