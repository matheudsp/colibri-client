"use client";

import { LuListMinus } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";

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
  PlusIcon,
  ArrowRight,
  LandPlot,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { PhotoCard } from "@/components/cards/PhotoCard";
import { AddPhotoModal } from "@/components/modals/photoModals/AddPhotoModal";
import {
  createPropertySchema,
  type CreatePropertyFormValues,
} from "@/validations";
import { PropertyService } from "@/services/domains/propertyService";
import { PhotoService } from "@/services/domains/photoService";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";
import { Photo } from "@/interfaces/photo";
import { Stepper } from "@/components/layout/Stepper";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";
import { BrlCurrencyIcon } from "@/components/icons/BRLCurrencyIcon";
import { extractAxiosError } from "@/services/api";
import { propertyType } from "@/constants";
import { CustomFormTextarea } from "@/components/forms/CustomFormTextarea";

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
  const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isAddPhotoModalOpen, setIsAddPhotoModalOpen] = useState(false);

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
  const formSteps = ["Cadastrar Imóvel", "Envio de Fotos"];
  const propertyTypeValue = watch("propertyType");
  const handleNextStep = () => setStep((prev) => prev + 1);
  // const handlePreviousStep = () => setStep((prev) => prev - 1);

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;
    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (address) {
        setValue("street", address.street, { shouldValidate: true });
        setValue("district", address.district, { shouldValidate: true });
        setCityFromCep(address.city);
        setValue("state", address.rawUf, { shouldValidate: true });
        // setFocus("number");
      } else {
        toast.error("CEP não encontrado.");
      }
    } catch (error) {
      toast.error(`Erro ao buscar o CEP: ${error}`);
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
      const cityOptions = await fetchCitiesByState(stateValue);
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
      // console.log("DADOS DA CRIACAO DE PROPRIEDADE: ", payload);
      const response = await PropertyService.create(payload);
      toast.success("Imóvel criado! Agora, envie as fotos.");
      setNewPropertyId(response.data.id);
      handleNextStep();
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao criar imóvel", {
        description: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePhotosAdded = useCallback((newFiles: File[]) => {
    const newPhotos: Photo[] = newFiles.map((file) => ({
      file,
      tempUrl: URL.createObjectURL(file),
      id: `temp-${file.name}-${Date.now()}`,
      filePath: "",
    }));
    setAllPhotos((prev) => [...prev, ...newPhotos]);
  }, []);

  const handleDeletePhoto = useCallback(async (photoId: string) => {
    setAllPhotos((prev) =>
      prev.filter((p) => {
        if (p.id === photoId && p.tempUrl) {
          URL.revokeObjectURL(p.tempUrl);
        }
        return p.id !== photoId;
      })
    );
  }, []);

  const handleFinish = async () => {
    if (!newPropertyId) {
      toast.error("ID do imóvel não encontrado.");
      return;
    }
    if (allPhotos.length === 0) {
      toast.warning("Adicione pelo menos uma foto.");
      return;
    }
    setIsUploading(true);
    const filesToUpload = allPhotos
      .map((p) => p.file)
      .filter((f): f is File => !!f);
    try {
      await PhotoService.upload(newPropertyId, filesToUpload);
      toast.success("Imóvel cadastrado com sucesso!");
      router.push("/imoveis");
    } catch (error) {
      toast.error(`Falha no upload das fotos: ${error}`);
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      allPhotos.forEach((photo) => {
        if (photo.tempUrl) URL.revokeObjectURL(photo.tempUrl);
      });
    };
  }, [allPhotos]);

  return (
    <>
      <div className="min-h-svh pt-16 w-full flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8 w-full max-w-4xl">
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
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
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
                        placeholder="ex: Apartamento de alto padrão, com acabamentos finos, área de lazer completa e localizado em bairro nobre..."
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
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
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

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
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
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                  Fotos do Imóvel
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  A primeira foto que você adicionar será a capa do anúncio.
                </p>
              </div>
              <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {allPhotos.map((photo) => (
                  <PhotoCard
                    key={photo.id}
                    photo={photo}
                    onDelete={handleDeletePhoto}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setIsAddPhotoModalOpen(true)}
                  className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg border-gray-300 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  title="Adicionar nova foto"
                >
                  <PlusIcon className="w-8 h-8 sm:w-10 sm:h-10" />
                  <span className="text-xs sm:text-sm mt-1">Adicionar</span>
                </button>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                {/* <CustomButton
                  onClick={handlePreviousStep}
                  fontSize="text-lg"
                  ghost
                  textColor="text-gray-600"
                  className="w-full sm:w-auto"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                </CustomButton> */}
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
      <AddPhotoModal
        isOpen={isAddPhotoModalOpen}
        onClose={() => setIsAddPhotoModalOpen(false)}
        onPhotosAdded={handlePhotosAdded}
        isLoading={isUploading}
      />
    </>
  );
}
