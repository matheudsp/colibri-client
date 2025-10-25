"use client";

import { LuListMinus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

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
  ArrowRight,
  LandPlot,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomFormInput } from "@/components/forms/CustomFormInput";
import {
  createPropertySchema,
  type CreatePropertyFormValues,
} from "@/validations";
import { PropertyService } from "@/services/domains/propertyService";
import { PhotoService } from "@/services/domains/photoService";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";
import { Stepper } from "@/components/layout/Stepper";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";
import { BrlCurrencyIcon } from "@/components/icons/BRLCurrencyIcon";
import { extractAxiosError } from "@/services/api";
import { propertyType } from "@/constants";
import { CustomFormTextarea } from "@/components/forms/CustomFormTextarea";
import { PropertyPhotoManager } from "@/components/photos/PropertyPhotoManager";

export default function CreatePropertyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [newPropertyId, setNewPropertyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [cityFromCep, setCityFromCep] = useState<string | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { isAvailable: true },
  });

  const stateValue = watch("state");
  const propertyTitleValue = watch("title");
  const formSteps = ["Cadastrar Imóvel", "Envio de Fotos"];
  const propertyTypeValue = watch("propertyType");

  const handleNextStep = () => setStep((prev) => prev + 1);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (address) {
        setValue("street", address.street, { shouldValidate: true });
        setValue("province", address.district, { shouldValidate: true });
        setCityFromCep(address.city);
        setValue("state", address.state, { shouldValidate: true });
      } else {
        toast.error("CEP não encontrado. Preencha manualmente.");
      }
    } catch (error) {
      toast.error(`Erro ao buscar o CEP: ${error}. Preencha manualmente.`);
    } finally {
      setIsCepLoading(false);
    }
  };

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
      if (cityFromCep) {
        if (cityOptions.some((c) => c.value === cityFromCep)) {
          setValue("city", cityFromCep, { shouldValidate: true });
        }
        setCityFromCep(null);
      }
      setIsCitiesLoading(false);
    };
    loadCities();
  }, [stateValue, setValue, cityFromCep]);

  const onSubmitDetails = async (data: CreatePropertyFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        value: unmaskNumeric(data.value),
      };
      const response = await PropertyService.create(payload);
      toast.success("Imóvel cadastrado! Agora, envie as fotos.");
      setNewPropertyId(response.data.id);
      handleNextStep();
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao criar imóvel", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!newPropertyId) {
      toast.error("ID do imóvel não encontrado.");
      return;
    }
    if (photoFiles.length === 0) {
      toast.warning("Adicione pelo menos uma foto para concluir.");
      return;
    }

    setIsUploading(true);
    const promise = PhotoService.upload(newPropertyId, photoFiles);

    toast.promise(promise, {
      loading: "Enviando fotos...",
      success: () => {
        setIsUploading(false);
        router.push("/imoveis");
        return "Imóvel cadastrado com sucesso!";
      },
      error: (error) => {
        setIsUploading(false);
        return `Falha no upload das fotos: ${extractAxiosError(error)}`;
      },
    });
  };

  return (
    <div className="min-h-svh pt-24 w-full flex flex-col items-center justify-center">
      <div className="p-4 sm:p-6 md:p-8 w-full md:max-w-2xl">
        <Stepper
          steps={formSteps}
          currentStep={step}
          className=" mb-8 sm:mb-12"
        />

        {step === 1 && (
          <form
            onSubmit={handleSubmit(onSubmitDetails)}
            className="w-full space-y-6 md:space-y-8"
          >
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
                  selectedOptionValue={propertyTypeValue}
                  onOptionSelected={(val) => {
                    if (val)
                      setValue("propertyType", val, {
                        shouldValidate: true,
                      });
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
                      icon={<LuListMinus className="h-5 w-5" />}
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
                      disabled={isCepLoading}
                      onBlur={(e) => {
                        field.onBlur();
                        handleCepBlur(e);
                      }}
                      maxLength={9}
                      onChange={field.onChange}
                      value={field.value}
                      ref={field.ref}
                      name={field.name}
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
                  name="province"
                  control={control}
                  render={({ field }) => (
                    <CustomFormInput
                      id="province"
                      placeholder="ex: Centro"
                      icon={<MapIcon className="h-5 w-5" />}
                      label="Bairro*"
                      error={errors.province?.message}
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

            <div className="pt-4 flex justify-end">
              <CustomButton
                type="submit"
                fontSize="text-lg"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </CustomButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="w-full space-y-6">
            <PropertyPhotoManager
              propertyTitle={propertyTitleValue}
              onFilesChange={setPhotoFiles}
              isSubmitting={isUploading}
            />

            <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <CustomButton
                onClick={handleFinish}
                fontSize="text-lg"
                disabled={isUploading}
                className="w-full sm:w-auto"
              >
                {isUploading ? "Enviando..." : "Concluir Cadastro"}
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
