"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
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
  ArrowLeft,
  Loader2,
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
import { extractAxiosError } from "@/services/api";

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
    control,
    handleSubmit,
    setValue,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<CreateCondominiumFormValues>({
    resolver: zodResolver(createCondominiumSchema),
    mode: "onBlur",
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
      router.push("/condominiums");
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao cadastrar condomínio", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-svh mt-14 md:mt-0 w-full bg-white flex flex-col items-center max-w-xl mx-auto justify-center py-8 px-4">
      <div className="p-6 sm:p-8 rounded-2xl w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">{`Cadastrar Novo Condomínio`}</h1>
          <p className="text-foreground/70 mt-2">{`Preencha as informações de nome e endereço`}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="md:col-span-2">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CustomFormInput
                placeholder="ex: Condomínio Rosa"
                label="Nome do Condomínio*"
                id="name"
                icon={<Building2 />}
                error={errors.name?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
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
            options={brazilianStates}
            selectedOptionValue={watch("state")}
            onOptionSelected={(val) =>
              val && setValue("state", val, { shouldValidate: true })
            }
            error={errors.state?.message}
          />
          <div className="sm:col-span-2">
            <CustomDropdownInput
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
          </div>
          <div className="sm:col-span-2">
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <CustomFormInput
                  placeholder="ex: Rua das Flores"
                  label="Rua/Avenida*"
                  id="street"
                  icon={<HomeIcon />}
                  error={errors.street?.message}
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <CustomFormInput
                placeholder="ex: Centro"
                label="Bairro*"
                id="district"
                icon={<MapIcon />}
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
                label="Número*"
                placeholder="ex: 12"
                id="number"
                icon={<HashIcon />}
                error={errors.number?.message}
                {...field}
              />
            )}
          />
        </div>

        <div className="pt-4 flex flex-col-reverse sm:flex-row gap-4">
          <CustomButton
            type="button"
            onClick={() => router.back()}
            ghost
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </CustomButton>
          <CustomButton
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Criar Condomínio"
            )}
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
