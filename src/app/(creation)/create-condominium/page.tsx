"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Building2,
  MapPinIcon,
  HomeIcon,
  HashIcon,
  MapIcon,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomFormInput } from "@/components/forms/CustomFormInput";
import {
  createCondominiumSchema,
  CreateCondominiumFormValues,
} from "@/validations/condominiums/condominiumCreateValidation";
import { CondominiumService } from "@/services/domains/condominiumService";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";

export default function CreateCondominiumPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);
  const [cityFromCep, setCityFromCep] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<CreateCondominiumFormValues>({
    resolver: zodResolver(createCondominiumSchema),
  });

  const stateValue = watch("state");

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
        setFocus("number");
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

  const onSubmit = async (data: CreateCondominiumFormValues) => {
    setIsLoading(true);
    try {
      await CondominiumService.create(data);
      toast.success("Condomínio cadastrado com sucesso!");
      router.push("/condominiums"); // Redireciona para a página de listagem
    } catch (error: unknown) {
      const errorMessage =
        error instanceof axios.AxiosError
          ? error.response?.data?.message || "Erro ao criar o condomínio."
          : "Ocorreu um erro inesperado.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg p-6 sm:p-8 rounded-xl w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Cadastrar Novo Condomínio
            </h1>
            <p className="text-gray-500 mt-1">
              Preencha as informações de endereço.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <CustomFormInput
              id="name"
              icon={<Building2 />}
              label="Nome do Condomínio*"
              {...register("name")}
              error={errors.name?.message}
              className="sm:col-span-2"
            />
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
          </div>

          <div className="pt-4 flex justify-end">
            <CustomButton
              type="submit"
              fontSize="text-lg"
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Condomínio"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
