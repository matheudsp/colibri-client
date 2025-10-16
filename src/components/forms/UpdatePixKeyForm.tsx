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
import { VerificationContexts } from "@/constants/verification-contexts";
import { BankAccountService } from "@/services/domains/bankAccountService";
import { extractAxiosError } from "@/services/api";
import { CustomDropdownInput } from "@/components/forms/CustomDropdownInput";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { pixKeyTypes } from "@/constants/pixKeyTypes";

interface UpdatePixKeyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function UpdatePixKeyForm({
  onSuccess,
  onCancel,
}: UpdatePixKeyFormProps) {
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
    defaultValues: { pixAddressKeyType: "CPF", pixAddressKey: "" },
  });

  const pixKeyType = watch("pixAddressKeyType");

  const handleInitialSubmit = (data: PixKeyFormValues) => {
    setPendingData(data);
    setIsOtpModalOpen(true);
  };

  const handleConfirmOtp = async (otp: string) => {
    if (!pendingData) return;
    setLoading(true);
    try {
      const verificationResponse = await VerificationService.confirm(
        VerificationContexts.PIX_KEY_UPDATE,
        otp
      );
      const { actionToken } = verificationResponse.data;

      await BankAccountService.update({ ...pendingData, actionToken });
      toast.success("Chave PIX alterada com sucesso!");
      onSuccess();
    } catch (error) {
      toast.error("Falha ao alterar a chave PIX", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
      setIsOtpModalOpen(false);
    }
  };

  return (
    <>
      <div className="p-4 border border-dashed border-border rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          Alterar Chave PIX
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Insira a nova chave PIX que você deseja usar para receber os repasses.
          Uma verificação de segurança será necessária.
        </p>
        <form
          onSubmit={handleSubmit(handleInitialSubmit)}
          className="space-y-4"
        >
          <CustomDropdownInput
            label="Novo Tipo de Chave PIX"
            placeholder="Selecione o tipo"
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
                label="Nova Chave PIX"
                icon={<KeyRound />}
                placeholder="Digite a nova chave"
                error={errors.pixAddressKey?.message}
                {...field}
              />
            )}
          />
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <CustomButton
              type="button"
              onClick={onCancel}
              disabled={loading}
              ghost
              className="w-full sm:w-auto"
            >
              Cancelar
            </CustomButton>
            <CustomButton
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Salvar e Verificar
            </CustomButton>
          </div>
        </form>
      </div>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleConfirmOtp}
        onResendOtp={() =>
          VerificationService.request(VerificationContexts.PIX_KEY_UPDATE)
        }
        isLoading={loading}
        title="Verificação de Segurança"
        description="Para proteger sua conta, clique em 'Enviar Código' para receber o código de 6 dígitos no seu e-mail."
        actionText="Confirmar"
      />
    </>
  );
}
