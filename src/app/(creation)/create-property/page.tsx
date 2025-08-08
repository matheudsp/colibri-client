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
  CameraIcon,
  SaveIcon,
  ArrowRight,
  UploadCloud,
  Trash2,
} from "lucide-react";

import { CustomButton } from "../../../components/forms/CustomButton";
import { CustomDropdownInput } from "../../../components/forms/CustomDropdownInput";
import { CustomFormInput } from "../../../components/forms/CustomFormInput";
import { CustomFileInput } from "@/components/forms/CustomFileInput";

import {
  createPropertySchema,
  CreatePropertyFormValues,
} from "../../../validations";
import { PropertyService } from "../../../services/domains/propertyService";
import { PhotoService } from "../../../services/domains/photoService";

import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";
import Image from "next/image";

interface Photo {
  id: string;
  file?: File;
  tempUrl?: string;
  filePath: string;
}

const PhotoCard = ({
  photo,
  onDelete,
}: {
  photo: Photo;
  onDelete: (id: string) => void;
}) => (
  <div className="relative group aspect-square border rounded-lg overflow-hidden">
    <Image
      src={photo.tempUrl || photo.filePath}
      alt="Foto do imóvel"
      layout="fill"
      objectFit="cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
      <button
        type="button"
        onClick={() => onDelete(photo.id)}
        className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"
        title="Excluir foto"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  </div>
);

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

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      if (address) {
        setValue("street", address.street, { shouldValidate: true });
        setValue("district", address.district, { shouldValidate: true });
        setCityFromCep(address.city);
        setValue("state", address.rawUf, { shouldValidate: true });

        setFocus("number");
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
      if (!cityFromCep) setValue("city", "");
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
      toast.success("Imóvel cadastrado! Agora, adicione as fotos.");
      setNewPropertyId(response.data.id);
      setStep(2);
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

  const handlePhotosAdded = useCallback(
    (files: FileList) => {
      if (!newPropertyId) return;

      const filesArray = Array.from(files);
      const tempPhotos: Photo[] = filesArray.map((file) => ({
        file,
        tempUrl: URL.createObjectURL(file),
        id: `temp-${file.name}-${Date.now()}`,
        filePath: "",
      }));

      setAllPhotos((prev) => [...prev, ...tempPhotos]);
      setIsUploading(true);

      (async () => {
        try {
          await PhotoService.upload(newPropertyId, filesArray);
          toast.success(`${files.length} foto(s) enviada(s) com sucesso!`);
          // Opcional: Recarregar as fotos do servidor para ter as URLs permanentes
          // ou apenas remover o estado 'isUploading'.
        } catch (error) {
          setAllPhotos((prev) => prev.filter((p) => !p.id.startsWith("temp-")));
          toast.error("Falha no upload das fotos.");
        } finally {
          setIsUploading(false);
        }
      })();
    },
    [newPropertyId]
  );

  const handleDeletePhoto = useCallback(async (photoId: string) => {
    // Se a foto for temporária, apenas remove do estado local
    if (photoId.startsWith("temp-")) {
      setAllPhotos((prev) => prev.filter((p) => p.id !== photoId));
      return;
    }
    // Se já estiver no servidor, chama o serviço de delete
    try {
      await PhotoService.delete(photoId);
      setAllPhotos((prev) => prev.filter((p) => p.id !== photoId));
      toast.success("Foto excluída.");
    } catch (error) {
      toast.error("Erro ao excluir foto.");
    }
  }, []);

  const handleFinish = () => {
    toast.success("Imóvel cadastado!");
    router.push("/properties");
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center pt-12 pb-8 px-4 bg-muted/20">
      <div className="bg-white grid place-items-center shadow-lg p-8 rounded-xl w-full max-w-2xl md:max-w-4xl">
        {step === 1 && (
          <form
            onSubmit={handleSubmit(onSubmitDetails)}
            className="w-full space-y-6"
          >
            <h1 className="text-3xl text-foreground font-sans font-bold text-center">
              Passo 1: Detalhes do Imóvel
            </h1>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <CustomFormInput
                id="title"
                icon={<Building2 />}
                label="Título do Imóvel*"
                placeholder="Ex: Apartamento 2 quartos no Centro"
                {...register("title")}
                error={errors.title?.message}
                className="md:col-span-2"
              />
              <CustomFormInput
                id="description"
                icon={<HomeIcon />}
                label="Descrição*"
                placeholder="Descreva o imóvel detalhadamente"
                {...register("description")}
                error={errors.description?.message}
                className="md:col-span-2"
              />
              <CustomFormInput
                id="cep"
                icon={<MapPinIcon />}
                label="CEP*"
                registration={register("cep")}
                mask="cep"
                placeholder="Ex: 12345-678"
                onBlur={handleCepBlur}
                error={errors.cep?.message}
                disabled={isCepLoading}
              />
              <CustomDropdownInput
                placeholder="Selecione o estado*"
                options={brazilianStates}
                selectedOptionValue={watch("state")}
                onOptionSelected={(val) =>
                  val && setValue("state", val, { shouldValidate: true })
                }
                error={errors.state?.message}
              />
              <CustomDropdownInput
                placeholder={
                  isCitiesLoading ? "Carregando..." : "Selecione uma cidade*"
                }
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
                id="street"
                icon={<HomeIcon />}
                placeholder="Ex: Rua das Flores"
                label="Rua/Avenida*"
                value={watch("street") || ""}
                {...register("street")}
                error={errors.street?.message}
                className="md:col-span-2"
              />
              <CustomFormInput
                id="number"
                icon={<HashIcon />}
                placeholder="Ex: 123"
                label="Número*"
                {...register("number")}
                required
                error={errors.number?.message}
              />
              <CustomFormInput
                id="complement"
                icon={<HashIcon />}
                placeholder="Ex: Apto 45"
                label="Complemento"
                {...register("complement")}
                error={errors.complement?.message}
              />
              <CustomFormInput
                id="areaInM2"
                icon={<Square />}
                placeholder="Ex: 75"
                label="Área (m²)*"
                type="number"
                {...register("areaInM2")}
                error={errors.areaInM2?.message}
              />
              <CustomFormInput
                id="numRooms"
                icon={<Bed />}
                label="Nº de Quartos*"
                placeholder="Ex: 3"
                type="number"
                {...register("numRooms")}
                error={errors.numRooms?.message}
              />
              <CustomFormInput
                id="numBathrooms"
                icon={<Bath />}
                label="Nº de Banheiros*"
                type="number"
                placeholder="Ex: 2"
                {...register("numBathrooms")}
                error={errors.numBathrooms?.message}
              />
              <CustomFormInput
                id="numParking"
                icon={<Car />}
                label="Nº de Vagas*"
                type="number"
                placeholder="Ex: 1"
                {...register("numParking")}
                error={errors.numParking?.message}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <CustomButton
                type="submit"
                fontSize="text-lg"
                disabled={isLoading}
              >
                Próximo: Fotos
                <ArrowRight className="w-4 h-4 ml-2" />
              </CustomButton>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="w-full space-y-6">
            <h1 className="text-3xl text-foreground font-sans font-bold text-center">
              Passo 2: Fotos do Imóvel
            </h1>
            <div className="p-4 border-2 border-dashed rounded-lg border-muted-foreground/30">
              <CustomFileInput
                id="photo-upload"
                multiple
                onFilesSelected={handlePhotosAdded}
                disabled={isUploading}
                icon={
                  <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground" />
                }
                label="Arraste e solte as fotos aqui, ou clique para selecionar"
              />
            </div>
            {isUploading && (
              <p className="text-sm text-center text-muted-foreground">
                Enviando fotos...
              </p>
            )}
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {allPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onDelete={handleDeletePhoto}
                />
              ))}
            </div>
            <div className="pt-4 flex justify-end">
              <CustomButton
                onClick={handleFinish}
                fontSize="text-lg"
                disabled={isUploading}
              >
                Concluir
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
