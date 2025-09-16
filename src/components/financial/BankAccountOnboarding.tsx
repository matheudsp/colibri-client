"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

import {
  pixKeySchema,
  PixKeyFormValues,
} from "@/validations/bankAccounts/pixKeyValidation";
import { VerificationService } from "@/services/domains/verificationService";
import { VerificationContexts } from "@/constants/verificationContexts";
import { BankAccountService } from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { pixKeyTypes } from "@/constants/pixKeyTypes";
import { PixIcon } from "../icons/PixIcon";

interface BankAccountOnboardingProps {
  onSuccess: () => void;
}

export function BankAccountOnboarding({
  onSuccess,
}: BankAccountOnboardingProps) {
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingData, setPendingData] = useState<PixKeyFormValues | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PixKeyFormValues>({
    resolver: zodResolver(pixKeySchema),
    defaultValues: {
      pixAddressKeyType: "CPF",
      pixAddressKey: "",
    },
  });

  const pixKeyType = watch("pixAddressKeyType");

  const handleInitialSubmit = async (data: PixKeyFormValues) => {
    setLoading(true);
    try {
      await VerificationService.request(
        VerificationContexts.CREATE_BANK_ACCOUNT
      );
      setPendingData(data);
      setIsOtpModalOpen(true);
      toast.info("Enviamos um código de verificação para o seu e-mail.");
    } catch (error) {
      toast.error("Falha ao solicitar código de verificação", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (otp: string) => {
    if (!pendingData) return;
    setLoading(true);
    try {
      const verificationResponse = await VerificationService.confirm(
        VerificationContexts.CREATE_BANK_ACCOUNT,
        otp
      );
      const { actionToken } = verificationResponse.data;

      await BankAccountService.create({ ...pendingData, actionToken });
      toast.success("Conta de pagamentos criada com sucesso!", {
        description:
          "Pode ser necessário o envio de documentos adicionais. Verifique abaixo.",
      });
      onSuccess();
    } catch (error) {
      toast.error("Falha ao criar conta", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
      setIsOtpModalOpen(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <PixIcon width={50} height={50} className="mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-gray-800 mt-4">
            Cadastre sua Conta de Pagamentos
          </h2>
          <p className="text-gray-500 mt-1 max-w-md mx-auto">
            Para receber os aluguéis, cadastre uma chave PIX. Isso criará sua
            conta de pagamentos automaticamente.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(handleInitialSubmit)}
          className="space-y-4 pt-4"
        >
          <CustomDropdownInput
            label="Tipo de Chave PIX"
            placeholder="Selecione o tipo da chave"
            options={pixKeyTypes}
            selectedOptionValue={pixKeyType}
            onOptionSelected={(value) =>
              setValue(
                "pixAddressKeyType",
                value as PixKeyFormValues["pixAddressKeyType"],
                { shouldValidate: true }
              )
            }
            error={errors.pixAddressKeyType?.message}
          />
          <Controller
            name="pixAddressKey"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="pixAddressKey"
                label="Chave PIX"
                icon={<KeyRound />}
                placeholder="Digite sua chave PIX"
                error={errors.pixAddressKey?.message}
                {...field}
              />
            )}
          />
          <div className="pt-2">
            <CustomButton
              type="submit"
              disabled={loading}
              className="w-full"
              fontSize="text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Cadastrar Chave PIX"
              )}
            </CustomButton>
          </div>
        </form>
      </div>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleConfirmOtp}
        onResendOtp={() =>
          VerificationService.request(VerificationContexts.CREATE_BANK_ACCOUNT)
        }
        isLoading={loading}
        title="Verificação de Segurança"
        description="Para sua segurança, um código de 6 dígitos foi enviado para o seu e-mail para confirmar a criação da conta."
        actionText="Confirmar"
      />
    </>
  );
}
