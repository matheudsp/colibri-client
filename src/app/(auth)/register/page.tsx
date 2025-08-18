"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { CustomButton } from "../../../components/forms/CustomButton";
import { CustomAuthInput } from "../../../components/forms/CustomAuthInput";
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
} from "lucide-react";
import {
  TenantRegisterFormData,
  LandlordRegisterFormData,
  tenantRegisterSchema,
  landlordRegisterSchema,
} from "../../../validations/index";
import { AuthService } from "../../../services/domains/authService";
import axios from "axios";
import { toast } from "sonner";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { companyType } from "@/constants";
import { CustomRadioGroup } from "@/components/forms/CustomRadioGroup";
import { brazilianStates } from "@/constants/states";
import { fetchAddressByCep } from "@/utils/viacep";
import { fetchCitiesByState } from "@/utils/ibge";

type Role = "LOCATARIO" | "LOCADOR";

const TenantForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantRegisterFormData>({
    resolver: zodResolver(tenantRegisterSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TenantRegisterFormData) => {
    setLoading(true);
    try {
      await AuthService.registerTenant({
        email: data.email,
        name: data.name,
        cpfCnpj: data.cpfCnpj,
        phone: data.phone,
        password: data.password,
        birthDate: data.birthDate,
      });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Erro ao cadastrar.");
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 grid place-items-center"
    >
      <div className="w-full grid place-items-center gap-8">
        <CustomAuthInput
          label="Nome Completo*"
          id="name"
          icon={<UserIcon />}
          registration={register("name")}
          error={errors.name?.message}
        />
        <CustomAuthInput
          label="Email*"
          type="email"
          id="email"
          icon={<MailIcon />}
          registration={register("email")}
          error={errors.email?.message}
        />
        <CustomAuthInput
          label="CPF*"
          id="cpfCnpj"
          icon={<FileTextIcon />}
          registration={register("cpfCnpj")}
          error={errors.cpfCnpj?.message}
        />
        <CustomAuthInput
          label="Celular*"
          id="phone"
          mask="phone"
          maxLength={15}
          icon={<PhoneIcon />}
          registration={register("phone")}
          error={errors.phone?.message}
        />

        <CustomAuthInput
          label="Data de Nascimento*"
          id="birthDate"
          type="text"
          mask="date"
          maxLength={10}
          icon={<CalendarIcon />}
          registration={register("birthDate")}
          error={errors.birthDate?.message}
        />
        <CustomAuthInput
          type="password"
          label="Senha*"
          id="password"
          icon={<LockIcon />}
          registration={register("password")}
          error={errors.password?.message}
        />
        <CustomAuthInput
          type="password"
          label="Confirme sua senha*"
          id="confirmPassword"
          icon={<LockIcon />}
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="grid gap-4 pt-8">
        <CustomButton
          type="submit"
          fontSize="text-lg"
          className="w-48 hover:bg-secondary-hover"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </CustomButton>
        <CustomButton
          type="button"
          onClick={() => router.push("/login")}
          ghost
          fontSize="text-lg"
          className="w-48"
        >
          Voltar ao Login
        </CustomButton>
      </div>
    </form>
  );
};

const LandlordForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [cities, setCities] = useState<
    { id: string; value: string; label: string }[]
  >([]);
  const [cityFromCep, setCityFromCep] = useState<string | null>(null);
  const [isCitiesLoading, setIsCitiesLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setFocus,
  } = useForm<LandlordRegisterFormData>({
    resolver: zodResolver(landlordRegisterSchema),
    mode: "onBlur",
  });

  const cpfCnpjValue = watch("cpfCnpj");
  const companyTypeValue = watch("companyType");
  const stateValue = watch("state");
  const cityValue = watch("city");
  const streetValue = watch("street");
  const provinceValue = watch("province");

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) {
      return;
    }

    setIsCepLoading(true);
    try {
      const address = await fetchAddressByCep(cep);
      console.log(address);
      if (address) {
        setValue("street", address.street, { shouldValidate: true });
        setValue("province", address.district, { shouldValidate: true });

        setCityFromCep(address.city);

        setValue("state", address.rawUf, { shouldValidate: true });

        // toast.success("Endereço preenchido!");
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
      await AuthService.registerLandlord({
        email: data.email,
        name: data.name,
        cpfCnpj: data.cpfCnpj,
        phone: data.phone,
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
        incomeValue: Number(data.incomeValue.replace(/\D/g, "")),
      });
      toast.success("Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data.message || "Erro ao cadastrar.");
      } else {
        toast.error("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 grid place-items-center"
    >
      <div className="w-full grid place-items-center gap-8">
        <CustomAuthInput
          label="Nome Completo*"
          id="name"
          icon={<UserIcon />}
          registration={register("name")}
          error={errors.name?.message}
        />
        <CustomAuthInput
          label="Email*"
          type="email"
          id="email"
          icon={<MailIcon />}
          registration={register("email")}
          error={errors.email?.message}
        />
        <CustomAuthInput
          label="CPF/CNPJ*"
          id="cpfCnpj"
          icon={<FileTextIcon />}
          registration={register("cpfCnpj")}
          error={errors.cpfCnpj?.message}
        />
        <CustomAuthInput
          label="Celular*"
          id="phone"
          mask="phone"
          maxLength={15}
          icon={<PhoneIcon />}
          registration={register("phone")}
          error={errors.phone?.message}
        />
        <CustomAuthInput
          type="password"
          label="Senha*"
          id="password"
          icon={<LockIcon />}
          registration={register("password")}
          error={errors.password?.message}
        />
        <CustomAuthInput
          type="password"
          label="Confirme sua senha*"
          id="confirmPassword"
          icon={<LockIcon />}
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        {cpfCnpjValue && cpfCnpjValue.length > 11 && (
          <CustomDropdownInput
            placeholder="Selecione o Tipo de Empresa*"
            options={companyType}
            selectedOptionValue={companyTypeValue}
            onOptionSelected={(val) => {
              if (val) setValue("companyType", val);
            }}
            error={errors.companyType?.message}
            className="w-full"
          />
        )}
        {cpfCnpjValue && cpfCnpjValue.length === 11 && (
          <CustomAuthInput
            label="Data de Nascimento*"
            id="birthDate"
            type="text"
            mask="date"
            maxLength={10}
            icon={<CalendarIcon />}
            registration={register("birthDate")}
            error={errors.birthDate?.message}
          />
        )}
        <CustomAuthInput
          label="CEP*"
          id="cep"
          mask="cep"
          maxLength={9}
          icon={<MapPinIcon />}
          registration={register("cep")}
          onBlur={handleCepBlur}
          error={errors.cep?.message}
          disabled={isCepLoading}
        />
        <CustomAuthInput
          label="Rua/Avenida*"
          id="street"
          icon={<HomeIcon />}
          registration={register("street")}
          value={streetValue || ""}
          error={errors.street?.message}
        />
        <CustomAuthInput
          label="Número*"
          id="number"
          icon={<HashIcon />}
          registration={register("number")}
          error={errors.number?.message}
        />
        <CustomAuthInput
          label="Bairro*"
          id="province"
          icon={<MapIcon />}
          registration={register("province")}
          value={provinceValue || ""}
          error={errors.province?.message}
        />

        <CustomDropdownInput
          placeholder="Selecione o Estado (UF)*"
          options={brazilianStates}
          selectedOptionValue={stateValue}
          onOptionSelected={(val) => {
            if (val) setValue("state", val, { shouldValidate: true });
          }}
          error={errors.state?.message}
          className="w-full"
        />
        <CustomDropdownInput
          placeholder={
            isCitiesLoading ? "Carregando..." : "Selecione a Cidade*"
          }
          options={cities}
          selectedOptionValue={cityValue}
          onOptionSelected={(val) => {
            if (val) setValue("city", val, { shouldValidate: true });
          }}
          error={errors.city?.message}
          className="w-full"
          disabled={!stateValue || isCitiesLoading}
        />
        <CustomAuthInput
          label="Complemento"
          id="complement"
          icon={<HomeIcon />}
          registration={register("complement")}
          error={errors.complement?.message}
        />
        <CustomAuthInput
          label="Renda/Faturamento Mensal*"
          id="incomeValue"
          mask="currency"
          icon={<UserIcon />}
          registration={register("incomeValue")}
          error={errors.incomeValue?.message}
        />
      </div>
      <div className="grid gap-4 pt-8">
        <CustomButton
          type="submit"
          fontSize="text-lg"
          className="w-48 hover:bg-secondary-hover"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </CustomButton>
        <CustomButton
          type="button"
          onClick={() => router.push("/login")}
          ghost
          fontSize="text-lg"
          className="w-48"
        >
          Voltar ao Login
        </CustomButton>
      </div>
    </form>
  );
};

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("LOCATARIO");

  const roleOptions = [
    { id: "1", value: "LOCATARIO", label: "Quero Alugar" },
    { id: "2", value: "LOCADOR", label: "Quero Anunciar" },
  ];

  return (
    <div className="min-h-svh w-full flex flex-col gap-10 items-center justify-start pt-6 pb-12 xl:pt-12">
      <Image
        width={200}
        height={200}
        src="/images/logo-black-vertical.png"
        alt="Logo Colibri"
        priority
        className="w-auto h-44 md:h-52"
      />

      <div className="bg-primary shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-md">
        <h1 className="text-2xl text-white mb-4 text-center font-sans">
          Faça seu Cadastro
        </h1>

        <CustomRadioGroup
          name="role"
          options={roleOptions}
          selectedValue={role}
          onChange={(value) => setRole(value as Role)}
          className="mb-6"
          gridCols={2}
          textColor="text-white"
          borderColor="border-white"
          checkedBgColor="bg-white"
          checkedBorderColor="border-white"
          dotColor="bg-white"
        />

        {role === "LOCATARIO" ? <TenantForm /> : <LandlordForm />}
      </div>
    </div>
  );
}
