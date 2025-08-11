"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { PhotoCard } from "@/components/cards/PhotoCard";
import { AddPhotoModal } from "@/components/modals/photoModals/AddPhotoModal";
import { createPropertySchema, CreatePropertyFormValues } from "@/validations";
import { PropertyService } from "@/services/domains/propertyService";
import { PhotoService } from "@/services/domains/photoService";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";
import { Photo } from "@/interfaces/photo";
import { Stepper } from "@/components/layout/Stepper";

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
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: { isAvailable: true },
  });

  const stateValue = watch("state");
  const formSteps = ["Detalhes do Imóvel", "Envio de Fotos"];

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
      toast.error("Erro ao buscar o CEP.");
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
      const response = await PropertyService.create(data);
      toast.success("Detalhes salvos! Agora, envie as fotos.");
      setNewPropertyId(response.data.id);
      handleNextStep();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message || "Erro ao criar o imóvel."
          : "Ocorreu um erro inesperado.";
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
      router.push("/properties");
    } catch (error) {
      toast.error("Falha no upload das fotos.");
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
      <div className="min-h-svh mt-14 w-full flex flex-col items-center justify-center">
        <div className="bg-white shadow-lg p-4 sm:p-6 md:p-8  w-full max-w-4xl">
          <Stepper steps={formSteps} currentStep={step} />

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
                  <CustomFormInput
                    id="title"
                    icon={<Building2 />}
                    label="Título do Imóvel*"
                    {...register("title")}
                    error={errors.title?.message}
                  />
                  <CustomFormInput
                    id="description"
                    icon={<HomeIcon />}
                    label="Descrição*"
                    {...register("description")}
                    error={errors.description?.message}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  Endereço
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                  <CustomFormInput
                    id="cep"
                    icon={<MapPinIcon />}
                    label="CEP*"
                    registration={register("cep")}
                    mask="cep"
                    onBlur={handleCepBlur}
                    error={errors.cep?.message}
                    disabled={isCepLoading}
                  />
                  <CustomDropdownInput
                    placeholder="Estado (UF)*"
                    options={brazilianStates}
                    selectedOptionValue={watch("state")}
                    onOptionSelected={(val) =>
                      val && setValue("state", val, { shouldValidate: true })
                    }
                    error={errors.state?.message}
                  />
                  <CustomFormInput
                    id="street"
                    icon={<HomeIcon />}
                    placeholder="Ex: Rua das Flores"
                    label="Rua/Avenida*"
                    value={watch("street") || ""}
                    {...register("street")}
                    error={errors.street?.message}
                    className="md:col-span-2"
                  />
                  <CustomDropdownInput
                    placeholder={isCitiesLoading ? "Carregando..." : "Cidade*"}
                    options={cities}
                    selectedOptionValue={watch("city")}
                    onOptionSelected={(val) =>
                      val && setValue("city", val, { shouldValidate: true })
                    }
                    error={errors.city?.message}
                    disabled={!stateValue || isCitiesLoading}
                  />
                  <CustomFormInput
                    id="district"
                    placeholder="Ex: Centro"
                    icon={<MapIcon />}
                    label="Bairro*"
                    value={watch("district") || ""}
                    {...register("district")}
                    error={errors.district?.message}
                  />
                  <CustomFormInput
                    id="number"
                    icon={<HashIcon />}
                    label="Número*"
                    {...register("number")}
                    error={errors.number?.message}
                  />
                  <CustomFormInput
                    id="complement"
                    icon={<HashIcon />}
                    label="Complemento"
                    {...register("complement")}
                    error={errors.complement?.message}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
                  Características do Imóvel
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4">
                  <CustomFormInput
                    id="areaInM2"
                    icon={<Square />}
                    label="Área (m²)*"
                    type="number"
                    {...register("areaInM2", { valueAsNumber: true })}
                    error={errors.areaInM2?.message}
                  />
                  <CustomFormInput
                    id="numRooms"
                    icon={<Bed />}
                    label="Quartos*"
                    type="number"
                    {...register("numRooms", { valueAsNumber: true })}
                    error={errors.numRooms?.message}
                  />
                  <CustomFormInput
                    id="numBathrooms"
                    icon={<Bath />}
                    label="Banheiros*"
                    type="number"
                    {...register("numBathrooms", { valueAsNumber: true })}
                    error={errors.numBathrooms?.message}
                  />
                  <CustomFormInput
                    id="numParking"
                    icon={<Car />}
                    label="Vagas*"
                    type="number"
                    {...register("numParking", { valueAsNumber: true })}
                    error={errors.numParking?.message}
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
                {allPhotos.map((photo, index) => (
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
