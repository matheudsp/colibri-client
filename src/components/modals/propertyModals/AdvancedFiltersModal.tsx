"use client";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { brazilianStates } from "@/constants/states";
import { propertyType } from "@/constants";
import { Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { PropertySearchFormValues } from "@/validations/properties/propertySearchValidation";

import { fetchCitiesByState } from "@/utils/ibge";
import { useEffect, useState } from "react";
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
  // control
  watch,
  setValue,
  onApply,
}: AdvancedFiltersModalProps) {
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  const stateValue = watch("state");
  useEffect(() => {
    if (!stateValue) {
      setCities([]);
      setValue("city", "");
      return;
    }

    const loadCities = async () => {
      setIsCitiesLoading(true);
      const selectedState = brazilianStates.find(
        (state) => state.value === stateValue
      );
      const stateUf = selectedState ? selectedState.id : "";

      if (stateUf) {
        const cityOptions = await fetchCitiesByState(stateUf);
        setCities(
          cityOptions.map((c) => ({ id: c.id, value: c.value, label: c.label }))
        );
      }
      setIsCitiesLoading(false);
    };

    loadCities();
  }, [stateValue, setValue]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Filtrar imóveis">
      <div className="space-y-4 ">
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
        <CustomDropdownInput
          label="Estado"
          placeholder="Selecione o Estado"
          options={brazilianStates}
          selectedOptionValue={stateValue}
          onOptionSelected={(val) => {
            setValue("state", val || "");
            setValue("city", "");
          }}
        />
        <CustomDropdownInput
          label="Cidade"
          placeholder={
            isCitiesLoading ? "Carregando cidades..." : "Selecione a Cidade"
          }
          options={cities}
          selectedOptionValue={watch("city")}
          onOptionSelected={(val) => setValue("city", val || "")}
          disabled={!stateValue || isCitiesLoading}
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
        <CustomButton onClick={onApply}>Filtrar</CustomButton>
      </div>
    </Modal>
  );
}
