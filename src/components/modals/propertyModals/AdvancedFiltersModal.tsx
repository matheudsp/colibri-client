"use client";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { brazilianStates } from "@/constants/states";
import { propertyType } from "@/constants";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";
import { Building2 } from "lucide-react";

interface AdvancedFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  control: Control<PropertySearchFormValues>;
  watch: UseFormWatch<PropertySearchFormValues>;
  setValue: UseFormSetValue<PropertySearchFormValues>;
  onApply: () => void;
}

export function AdvancedFiltersModal({
  isOpen,
  onClose,
  control,
  watch,
  setValue,
  onApply,
}: AdvancedFiltersModalProps) {
  const stateValue = watch("state");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mais Filtros">
      <div className="space-y-4">
        {/* <Controller
          name="q"
          control={control}
          render={({ field }) => (
            <CustomInput
              id="q-modal"
              label="Busca por termo"
              placeholder="Título, rua, bairro..."
              icon={<Search size={20} />}
              {...field}
            />
          )}
        /> */}
        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <CustomInput
              id="city-modal"
              label="Cidade"
              placeholder="Ex: Teresina"
              icon={<Building2 size={20} />}
              {...field}
            />
          )}
        />
        <CustomDropdownInput
          label="Estado"
          placeholder="Selecione o Estado"
          options={brazilianStates}
          selectedOptionValue={stateValue}
          onOptionSelected={(val) => setValue("state", val || "")}
        />
        <CustomDropdownInput
          label="Tipo de Imóvel"
          placeholder="Selecione o tipo"
          options={propertyType}
          selectedOptionValue={watch("propertyType")}
          onOptionSelected={(val) => setValue("propertyType", val || "")}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <CustomButton
          color="bg-gray-200"
          textColor="text-gray-800"
          onClick={onClose}
        >
          Cancelar
        </CustomButton>
        <CustomButton onClick={onApply}>Aplicar Filtros</CustomButton>
      </div>
    </Modal>
  );
}
