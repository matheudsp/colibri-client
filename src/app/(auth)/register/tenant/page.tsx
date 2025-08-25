"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarIcon,
  FileTextIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { FormWrapper } from "@/components/forms/FormWrapper";
import {
  TenantRegisterFormData,
  tenantRegisterSchema,
} from "@/validations/index";
import { AuthService } from "@/services/domains/authService";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { extractAxiosError } from "@/services/api";

export default function TenantRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantRegisterFormData>({
    resolver: zodResolver(tenantRegisterSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: TenantRegisterFormData) => {
    setLoading(true);
    try {
      await AuthService.registerTenant(data);
      toast.success("Cadastro realizado com sucesso!", {
        description: "Você será redirecionado para a página de login.",
      });
      setTimeout(() => router.push("/login"), 2000);
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
      title="Cadastro de Inquilino"
      subtitle="Crie sua conta para encontrar o imóvel ideal."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <CustomInput
              label="Nome Completo*"
              id="name"
              placeholder="ex: John Doe"
              icon={<UserIcon />}
              error={errors.name?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              label="Email*"
              type="email"
              placeholder="ex: johndoe@gmail.com"
              id="email"
              icon={<MailIcon />}
              error={errors.email?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="cpfCnpj"
          control={control}
          render={({ field }) => (
            <CustomInput
              label="CPF*"
              id="cpfCnpj"
              placeholder="ex: 243.432.234-33"
              mask="cpfCnpj"
              icon={<FileTextIcon />}
              error={errors.cpfCnpj?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <CustomInput
              label="Celular*"
              id="phone"
              mask="phone"
              placeholder="ex: (89) 99417-6423"
              icon={<PhoneIcon />}
              error={errors.phone?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="birthDate"
          control={control}
          render={({ field }) => (
            <CustomInput
              label="Data de Nascimento*"
              id="birthDate"
              placeholder="08/08/2002"
              mask="date"
              icon={<CalendarIcon />}
              error={errors.birthDate?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              type="password"
              label="Senha*"
              placeholder="********"
              id="password"
              icon={<LockIcon />}
              error={errors.password?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              type="password"
              label="Confirme sua senha*"
              placeholder="********"
              id="confirmPassword"
              icon={<LockIcon />}
              error={errors.confirmPassword?.message}
              {...field}
            />
          )}
        />

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
            className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold"
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Criar Conta"}
          </CustomButton>
        </div>
        <p className="text-center text-xs text-gray-500 pt-4">
          Ao se cadastrar, você concorda com nossos{" "}
          <a href="#" className="underline hover:text-primary">
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" className="underline hover:text-primary">
            Política de Privacidade
          </a>
          .
        </p>
      </form>
    </FormWrapper>
  );
}
