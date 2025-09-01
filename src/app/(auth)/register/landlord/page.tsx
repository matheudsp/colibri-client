"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";

import { toast } from "sonner";
import {
  CalendarIcon,
  FileTextIcon,
  HashIcon,
  HomeIcon,
  LockIcon,
  MailIcon,
  MapIcon,
  MapPinIcon,
  PhoneIcon,
  UserIcon,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import {
  LandlordRegisterFormData,
  landlordRegisterSchema,
} from "@/validations";
import { AuthService } from "@/services/domains/authService";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { companyType } from "@/constants";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";
import { unmaskNumeric } from "@/utils/masks/maskNumeric";
import { BrlCurrencyIcon } from "@/components/icons/BRLCurrencyIcon";
import { FormWrapper } from "@/components/forms/FormWrapper";
import { extractAxiosError } from "@/services/api";

const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-6">
    <h3 className="text-xl font-bold text-secondary border-b pb-2">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
      {children}
    </div>
  </section>
);

export default function LandlordRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [cityFromCep, setCityFromCep] = useState<string | null>(null);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setFocus,
  } = useForm<LandlordRegisterFormData>({
    resolver: zodResolver(landlordRegisterSchema),
    mode: "onChange",
    defaultValues: { cpfCnpj: "" },
  });

  const cpfCnpjValue = watch("cpfCnpj") || "";
  const companyTypeValue = watch("companyType");
  const stateValue = watch("state");

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
        setValue("state", address.rawUf, { shouldValidate: true });
        setFocus("number");
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

  const onSubmit = async (data: LandlordRegisterFormData) => {
    setLoading(true);
    try {
      console.log("CADASTRANDO LANDLORD", {
        email: data.email,
        name: data.name,
        // cpfCnpj: data.cpfCnpj.replace(/\D/g, ""),
        cpfCnpj: data.cpfCnpj,
        phone: data.phone,
        // phone: data.phone.replace(/\D/g, ""),
        password: data.password,
        cep: data.cep,
        street: data.street,
        number: data.number,
        province: data.province,
        city: data.city,
        state: data.state,
        complement: data.complement,
        companyType: data.companyType,
        birthDate: data.birthDate,
        incomeValue: unmaskNumeric(data.incomeValue),
      });
      await AuthService.registerLandlord({
        email: data.email,
        name: data.name,
        cpfCnpj: data.cpfCnpj.replace(/\D/g, ""),
        phone: data.phone.replace(/\D/g, ""),
        password: data.password,
        cep: data.cep,
        street: data.street,
        number: data.number,
        province: data.province,
        city: data.city,
        state: data.state,
        complement: data.complement,
        companyType: data.companyType,
        birthDate: data.birthDate,
        incomeValue: unmaskNumeric(data.incomeValue),
      });
      toast.success("Cadastro de locador realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao criar conta", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Cadastro de Locador"
      subtitle="Preencha seus dados para começar a anunciar seus imóveis."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormSection title="Dados Pessoais e de Acesso">
          <div className="md:col-span-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Nome Completo*"
                  id="name"
                  placeholder="ex: John Doe"
                  icon={<UserIcon size={20} />}
                  error={errors.name?.message}
                  autoComplete="name"
                  {...field}
                />
              )}
            />
          </div>
          <div className="md:col-span-2">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Email*"
                  type="email"
                  id="email"
                  placeholder="ex: johndoe@gmail.com"
                  icon={<MailIcon size={20} />}
                  error={errors.email?.message}
                  autoComplete="email"
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Celular*"
                id="phone"
                placeholder="ex: (89) 99417-6423"
                mask="phone"
                icon={<PhoneIcon size={20} />}
                error={errors.phone?.message}
                autoComplete="tel"
                {...field}
              />
            )}
          />

          <Controller
            name="cpfCnpj"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="CPF/CNPJ*"
                id="cpfCnpj"
                placeholder="ex: 243.432.234-33"
                mask="cpfCnpj"
                icon={<FileTextIcon size={20} />}
                error={errors.cpfCnpj?.message}
                {...field}
              />
            )}
          />

          {cpfCnpjValue.length > 11 ? (
            <div className="md:col-span-2">
              <CustomDropdownInput
                label="Tipo de Empresa*"
                placeholder="Tipo de Empresa*"
                options={companyType}
                selectedOptionValue={companyTypeValue}
                onOptionSelected={(val) => {
                  if (val)
                    setValue("companyType", val, { shouldValidate: true });
                }}
                error={errors.companyType?.message}
              />
            </div>
          ) : (
            cpfCnpjValue.length > 0 && (
              <div className="md:col-span-2">
                <Controller
                  name="birthDate"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Data de Nascimento*"
                      id="birthDate"
                      placeholder="08/08/2002"
                      mask="date"
                      icon={<CalendarIcon size={20} />}
                      error={errors.birthDate?.message}
                      autoComplete="bday"
                      {...field}
                    />
                  )}
                />
              </div>
            )
          )}
          <div className="md:col-span-2">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CustomInput
                  type="password"
                  label="Crie uma Senha*"
                  id="password"
                  placeholder="********"
                  icon={<LockIcon size={20} />}
                  error={errors.password?.message}
                  autoComplete="new-password"
                  {...field}
                />
              )}
            />
          </div>
          <div className="md:col-span-2">
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  type="password"
                  label="Confirme sua Senha*"
                  placeholder="********"
                  id="confirmPassword"
                  icon={<LockIcon size={20} />}
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Endereço">
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="CEP*"
                id="cep"
                mask="cep"
                placeholder="ex: 63233-239"
                icon={<MapPinIcon size={20} />}
                error={errors.cep?.message}
                disabled={isCepLoading}
                autoComplete="postal-code"
                {...field}
                onBlur={(e) => {
                  field.onBlur();
                  handleCepBlur(e);
                }}
              />
            )}
          />
          <CustomDropdownInput
            placeholder="Estado*"
            label="Estado*"
            options={brazilianStates}
            selectedOptionValue={stateValue}
            onOptionSelected={(val) => {
              if (val) setValue("state", val, { shouldValidate: true });
            }}
            error={errors.state?.message}
          />
          <div className="md:col-span-2">
            <CustomDropdownInput
              label="Cidade*"
              placeholder={isCitiesLoading ? "Carregando..." : "Cidade*"}
              options={cities}
              selectedOptionValue={watch("city")}
              onOptionSelected={(val) => {
                if (val) setValue("city", val, { shouldValidate: true });
              }}
              error={errors.city?.message}
              disabled={!stateValue || isCitiesLoading}
            />
          </div>
          <div className="md:col-span-2">
            <Controller
              name="street"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Rua/Avenida*"
                  id="street"
                  placeholder="ex: Rua Coronel "
                  icon={<HomeIcon size={20} />}
                  error={errors.street?.message}
                  autoComplete="address-line1"
                  {...field}
                />
              )}
            />
          </div>
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Bairro*"
                id="province"
                placeholder="ex: Taboca"
                icon={<MapIcon size={20} />}
                error={errors.province?.message}
                autoComplete="address-line2"
                {...field}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <CustomInput
                label="Número*"
                id="number"
                placeholder="ex: 13"
                icon={<HashIcon size={20} />}
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
                <CustomInput
                  label="Complemento"
                  id="complement"
                  placeholder="ex: Próximo ao Hemocentro"
                  icon={<HomeIcon size={20} />}
                  error={errors.complement?.message}
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>

        <FormSection title="Dados Financeiros">
          <div className="md:col-span-2">
            <Controller
              name="incomeValue"
              control={control}
              render={({ field }) => (
                <CustomInput
                  label="Renda/Faturamento Mensal*"
                  id="incomeValue"
                  placeholder="ex: 14.600,00"
                  mask="numeric"
                  icon={<BrlCurrencyIcon />}
                  error={errors.incomeValue?.message}
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>

        <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4">
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
            className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold text-lg py-3"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
          </CustomButton>
        </div>
        <p className="text-center text-xs text-gray-500 pt-2">
          Ao clicar em &quot;Criar Conta&quot;, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-primary">
            Termos de Uso
          </a>
          {` e `}
          <a href="#" className="underline hover:text-primary">
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </FormWrapper>
  );
}
