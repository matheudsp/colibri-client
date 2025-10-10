"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Building2,
  MapPinIcon,
  HomeIcon,
  HashIcon,
  MapIcon,
  Square,
  Bed,
  Bath,
  Car,
  Loader2,
  LandPlot,
} from "lucide-react";

import { Modal } from "@/components/modals/Modal";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { CustomFormTextarea } from "@/components/forms/CustomFormTextarea";
import {
  updatePropertySchema,
  type UpdatePropertyFormValues,
} from "@/validations";
import { PropertyService } from "@/services/domains/propertyService";
import { brazilianStates } from "@/constants/states";
import { fetchCitiesByState } from "@/utils/ibge";
import { BrlCurrencyIcon } from "@/components/icons/BRLCurrencyIcon";
import { extractAxiosError } from "@/services/api";
import { propertyType } from "@/constants";
import { PropertyProps } from "@/interfaces/property";
import { formatCurrency } from "@/utils/masks/maskCurrency";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";
import { PropertyPhotoManager } from "@/components/photos/PropertyPhotoManager";
import { Photo } from "@/interfaces/photo";

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: PropertyProps;
  onUpdate: () => void;
}

export function EditPropertyModal({
  isOpen,
  onClose,
  property,
  onUpdate,
}: EditPropertyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdatePropertyFormValues>({
    resolver: zodResolver(updatePropertySchema),
  });

  const stateValue = watch("state");

  useEffect(() => {
    if (property) {
      reset({
        ...property,
        value: formatCurrency(property.value),
        complement: property.complement || "",
      });
    }
  }, [property, reset]);

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
      const cityOptions = await fetchCitiesByState(stateUf);
      setCities(
        cityOptions.map((c) => ({ id: c.id, value: c.value, label: c.label }))
      );
      setIsCitiesLoading(false);
    };
    loadCities();
  }, [stateValue, setValue]);

  const handlePhotoListUpdate = () => {
    onUpdate();
  };
  const onSubmit = async (data: UpdatePropertyFormValues) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        value: unmaskNumeric(data.value!),
      };

      const response = await PropertyService.update(property.id, payload);

      // Combina os dados atualizados do formulário com as fotos atuais
      const finalUpdatedProperty: PropertyProps = {
        ...response.data,
        photos: property.photos, // Mantém as fotos que já estão no estado
      };

      onUpdate();
      onClose();
      toast.success("Imóvel atualizado com sucesso!");
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao atualizar imóvel", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Imóvel"
      scrollable
      maxWidth="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col overflow-hidden flex-1"
      >
        <div className="overflow-y-auto p-6 space-y-6 md:space-y-8">
          <PropertyPhotoManager
            property={property}
            onPhotoListUpdate={handlePhotoListUpdate}
            isSubmitting={isSubmitting}
            propertyTitle={watch("title") || ""}
          />

          {/* Seção: Informações Principais */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b border-border pb-2">
              Informações Principais
            </h2>
            <div className="grid grid-cols-1 gap-y-4">
              <CustomDropdownInput
                label="Categoria do Imóvel*"
                placeholder="Selecione a categoria"
                options={propertyType}
                icon={<LandPlot />}
                selectedOptionValue={watch("propertyType")}
                onOptionSelected={(val) => {
                  if (val)
                    setValue("propertyType", val, { shouldValidate: true });
                }}
                error={errors.propertyType?.message}
              />
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="title"
                    placeholder="ex: Apartamento 3 Quartos"
                    icon={<Building2 className="h-5 w-5" />}
                    label="Título do Imóvel*"
                    error={errors.title?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <CustomFormTextarea
                    id="description"
                    placeholder="ex: Apartamento de alto padrão..."
                    icon={<Building2 className="h-5 w-5" />}
                    label="Descrição*"
                    error={errors.description?.message}
                    maxLength={250}
                    {...field}
                  />
                )}
              />
              <Controller
                name="value"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="value"
                    placeholder="ex: 2.650,00"
                    icon={<BrlCurrencyIcon className="h-6 w-6" />}
                    label="Valor do Aluguel*"
                    error={errors.value?.message}
                    mask="numeric"
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Seção: Endereço */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b border-border pb-2">
              Endereço
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="cep"
                    icon={<MapPinIcon className="h-5 w-5" />}
                    label="CEP*"
                    placeholder="ex: 64104-342"
                    mask="cep"
                    error={errors.cep?.message}
                    maxLength={9}
                    {...field}
                  />
                )}
              />
              <CustomDropdownInput
                placeholder="Selecione o Estado"
                label="Estado*"
                icon={<MapPinIcon className="h-5 w-5" />}
                options={brazilianStates}
                selectedOptionValue={watch("state")}
                onOptionSelected={(val) =>
                  val && setValue("state", val, { shouldValidate: true })
                }
                error={errors.state?.message}
              />
              <CustomDropdownInput
                icon={<MapPinIcon className="h-5 w-5" />}
                placeholder={
                  isCitiesLoading ? "Carregando..." : "Selecione a Cidade"
                }
                label="Cidade*"
                options={cities}
                selectedOptionValue={watch("city")}
                onOptionSelected={(val) =>
                  val && setValue("city", val, { shouldValidate: true })
                }
                error={errors.city?.message}
                disabled={!stateValue || isCitiesLoading}
              />
              <Controller
                name="street"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="street"
                    icon={<HomeIcon className="h-5 w-5" />}
                    placeholder="ex: Rua das Flores"
                    label="Rua/Avenida*"
                    error={errors.street?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="district"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="district"
                    placeholder="ex: Centro"
                    icon={<MapIcon className="h-5 w-5" />}
                    label="Bairro*"
                    error={errors.district?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="number"
                    icon={<HashIcon className="h-5 w-5" />}
                    label="Número*"
                    placeholder="ex: 12"
                    error={errors.number?.message}
                    {...field}
                  />
                )}
              />
              <div className="md:col-span-2">
                <Controller
                  name="complement"
                  control={control}
                  render={({ field }) => (
                    <CustomFormInput
                      id="complement"
                      placeholder="ex: Próximo ao Hospital"
                      icon={<HashIcon className="h-5 w-5" />}
                      label="Complemento"
                      error={errors.complement?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Seção: Características do Imóvel */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b border-border pb-2">
              Características do Imóvel
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
              <Controller
                name="areaInM2"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="areaInM2"
                    icon={<Square className="rotate-45 h-5 w-5" />}
                    placeholder="ex: 50"
                    label="Área (m²)*"
                    type="number"
                    error={errors.areaInM2?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="numRooms"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="numRooms"
                    icon={<Bed className="h-5 w-5" />}
                    label="Quartos*"
                    placeholder="ex: 5"
                    type="number"
                    maxLength={3}
                    error={errors.numRooms?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="numBathrooms"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="numBathrooms"
                    icon={<Bath className="h-5 w-5" />}
                    label="Banheiros*"
                    placeholder="ex: 3"
                    type="number"
                    maxLength={3}
                    error={errors.numBathrooms?.message}
                    {...field}
                  />
                )}
              />
              <Controller
                name="numParking"
                control={control}
                render={({ field }) => (
                  <CustomFormInput
                    id="numParking"
                    icon={<Car className="h-5 w-5" />}
                    label="Vagas*"
                    type="number"
                    maxLength={3}
                    placeholder="ex: 2"
                    error={errors.numParking?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Rodapé Fixo com Botões */}
        <div className="flex-shrink-0 flex justify-end rounded-b-xl gap-3 p-6 border-t border-border bg-background">
          <CustomButton
            type="button"
            color="bg-gray-200"
            textColor="text-gray-800"
            onClick={onClose}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="submit"
            disabled={isSubmitting}
            color="bg-primary"
            textColor="text-white"
            isLoading={isSubmitting}
          >
            Salvar Alterações
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
}
