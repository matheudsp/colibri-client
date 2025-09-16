"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  MapPin,
  Home,
  Hash,
  MapIcon,
  Building2,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import {
  UserService,
  UserComplete,
  UpdateUserData,
} from "@/services/domains/userService";
import {
  userProfileSchema,
  UserProfileFormValues,
} from "@/validations/users/userProfileValidation";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { BrlCurrencyIcon } from "@/components/icons/BRLCurrencyIcon";
import { getCompanyTypeLabel } from "@/constants/companyType";
import { FormSection } from "@/components/forms/FormSection";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { VerificationService } from "@/services/domains/verificationService";
import { VerificationContexts } from "../../constants/verificationContexts";

export function AccountTab() {
  const { sub } = useCurrentUser();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isJuridica, setIsJuridica] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] =
    useState<UpdateUserData | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, dirtyFields },
    reset,
  } = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      setInitialLoading(true);
      try {
        const response = await UserService.findMe();
        const userData = response.data;

        Object.keys(userData).forEach((key) => {
          const typedKey = key as keyof UserComplete;
          if (typedKey === "birthDate" && userData.birthDate) {
            setValue("birthDate", formatDateForDisplay(userData.birthDate));
          } else if (
            userData[typedKey] !== null &&
            userData[typedKey] !== undefined
          ) {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            setValue(typedKey as any, String(userData[typedKey]));
          }
        });

        if (
          userData.cpfCnpj &&
          userData.cpfCnpj.replace(/\D/g, "").length > 11
        ) {
          setIsJuridica(true);
        }
      } catch (error) {
        toast.error("Não foi possível carregar seus dados", {
          description: extractAxiosError(error),
        });
      } finally {
        setInitialLoading(false);
      }
    };
    if (sub) {
      fetchUserData();
    }
  }, [sub, setValue]);

  const handleUpdateSubmit = async (data: UserProfileFormValues) => {
    if (!sub || !isDirty) return;

    const payload: UpdateUserData = {};
    (Object.keys(dirtyFields) as Array<keyof UserProfileFormValues>).forEach(
      (key) => {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (payload as any)[key] = data[key];
      }
    );

    if (Object.keys(payload).length === 0) {
      toast.info("Nenhuma alteração para salvar.");
      return;
    }

    setLoading(true);
    try {
      setPendingUpdateData(payload);
      setIsOtpModalOpen(true);
    } catch (error) {
      toast.error("Falha ao solicitar código de verificação", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (otp: string) => {
    if (!sub || !pendingUpdateData) return;

    setLoading(true);
    try {
      const verificationResponse = await VerificationService.confirm(
        VerificationContexts.UPDATE_USER_PROFILE,
        otp
      );

      await UserService.update(sub, {
        ...pendingUpdateData,
        actionToken: verificationResponse.data.actionToken,
      });

      toast.success("Dados atualizados com sucesso!");
      setIsOtpModalOpen(false);
      setPendingUpdateData(null);
      reset(await UserService.findMe().then((res) => res.data));
    } catch (error) {
      toast.error("Falha ao atualizar dados", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleUpdateSubmit)}
        className="space-y-6 p-0 md:p-6"
      >
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Controller
              name="cpfCnpj"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="cpfCnpj"
                  label={isJuridica ? "CNPJ" : "CPF"}
                  icon={<FileText size={18} />}
                  mask="cpfCnpj"
                  error={errors.cpfCnpj?.message}
                  {...field}
                  disabled
                />
              )}
            />

            {isJuridica ? (
              <Controller
                name="companyType"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    id="companyType"
                    label="Tipo de Empresa"
                    icon={<Building2 size={18} />}
                    value={getCompanyTypeLabel(field.value)}
                    disabled
                  />
                )}
              />
            ) : (
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    id="birthDate"
                    label="Data de Nascimento"
                    icon={<Calendar size={18} />}
                    mask="date"
                    error={errors.birthDate?.message}
                    {...field}
                    disabled
                  />
                )}
              />
            )}

            <div className="md:col-span-2">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    id="name"
                    label={isJuridica ? "Razão Social" : "Nome Completo"}
                    icon={<User size={18} />}
                    error={errors.name?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="email"
                  label="Email"
                  type="email"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="phone"
                  label="Celular"
                  icon={<Phone size={18} />}
                  mask="phone"
                  error={errors.phone?.message}
                  {...field}
                  maxLength={11}
                  placeholder="Digite para alterar"
                />
              )}
            />
          </div>
        </section>

        <FormSection title="Endereço">
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="cep"
                label="CEP"
                icon={<MapPin size={18} />}
                mask="cep"
                error={errors.cep?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="street"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="street"
                label="Rua/Avenida"
                icon={<Home size={18} />}
                error={errors.street?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="number"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="number"
                label="Número"
                icon={<Hash size={18} />}
                error={errors.number?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="province"
                label="Bairro"
                icon={<MapIcon size={18} />}
                error={errors.province?.message}
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
                  id="complement"
                  label="Complemento"
                  icon={<Home size={18} />}
                  error={errors.complement?.message}
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="city"
                label="Cidade"
                icon={<MapPin size={18} />}
                error={errors.city?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="state"
                label="Estado (UF)"
                icon={<MapPin size={18} />}
                error={errors.state?.message}
                maxLength={2}
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection title="Dados Financeiros">
          <div className="md:col-span-2">
            <Controller
              name="incomeValue"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="incomeValue"
                  label="Renda/Faturamento Mensal"
                  icon={<BrlCurrencyIcon />}
                  mask="numeric"
                  error={errors.incomeValue?.message}
                  {...field}
                />
              )}
            />
          </div>
        </FormSection>

        <div className="flex justify-end pt-4">
          <CustomButton
            type="submit"
            disabled={loading || !isDirty}
            className="w-full sm:w-auto"
            fontSize="text-lg"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Salvar Alterações"
            )}
          </CustomButton>
        </div>
      </form>
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleConfirmOtp}
        onResendOtp={() =>
          VerificationService.request(VerificationContexts.UPDATE_USER_PROFILE)
        }
        isLoading={loading}
        title="Verificação de Segurança"
        description="Para proteger sua conta, insira o código de 6 dígitos que enviamos para o seu e-mail."
        actionText="Confirmar e Salvar"
      />
    </>
  );
}
