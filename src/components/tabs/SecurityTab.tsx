"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";

import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomSwitch } from "@/components/forms/CustomSwitch";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { StatusBadge } from "@/components/common/StatusBadge";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";

import { VerificationService } from "@/services/domains/verificationService";
import { VerificationContexts } from "../../constants/verification-contexts";
import { TwoFactorAuthService } from "@/services/domains/twoFactorAuthService";
import { AuthService } from "@/services/domains/authService";
import { useUserStore } from "@/stores/userStore";
import { extractAxiosError } from "@/services/api";

const SecuritySection = ({
  title,
  description,
  statusBadge,
  children,
}: {
  title: string;
  description: string;
  statusBadge?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="px-0 md:px-6 border-b border-gray-200 pb-12">
    <div className="flex items-center justify-between mb-1">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {statusBadge}
    </div>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <div className="space-y-4">{children}</div>
  </div>
);

type OtpAction = "enable-2fa" | "disable-2fa";

export function SecurityTab() {
  const { user, loading } = useCurrentUser();
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [otpAction, setOtpAction] = useState<OtpAction | null>(null);

  const updateUserState = async () => {
    try {
      const meResponse = await AuthService.getMe();
      useUserStore.getState().setUser(meResponse.data);
    } catch {
      toast.error("Não foi possível atualizar os dados da sessão.");
    }
  };

  const handleVerifyEmail = async () => {
    setIsActionLoading(true);
    try {
      await AuthService.resendVerificationEmail();
      toast.success("Link de verificação enviado!", {
        description: "Por favor, verifique a caixa de entrada do seu e-mail.",
      });
    } catch (error) {
      toast.error("Falha ao enviar e-mail", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggle2FA = (checked: boolean) => {
    setOtpAction(checked ? "enable-2fa" : "disable-2fa");
  };

  const handleConfirmOtp = async (otp: string) => {
    if (!otpAction) return;

    setIsActionLoading(true);
    try {
      if (otpAction === "enable-2fa") {
        await TwoFactorAuthService.confirmEnable(otp);
        toast.success("Autenticação de Dois Fatores ativada com sucesso!");
      } else if (otpAction === "disable-2fa") {
        await TwoFactorAuthService.disable(otp);
        toast.success("Autenticação de Dois Fatores desativada com sucesso!");
      }

      await updateUserState();
      setOtpAction(null);
    } catch (error) {
      toast.error("Código de verificação inválido", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendOrResendOtpFor2FA = async () => {
    try {
      if (otpAction === "enable-2fa") {
        await TwoFactorAuthService.enable();
      } else if (otpAction === "disable-2fa") {
        await VerificationService.request(VerificationContexts.DISABLE_2FA);
      }
      return {
        data: { message: "Um novo código foi enviado para o seu e-mail." },
      };
    } catch (error) {
      toast.error("Falha ao enviar código", {
        description: extractAxiosError(error),
      });
      throw error;
    }
  };

  const isEmailVerified = user?.emailVerified ?? false;
  const isTwoFactorEnabled = user?.isTwoFactorEnabled ?? false;

  return (
    <>
      <div className="p-0 md:p-6 rounded-b-xl rounded-tr-xl space-y-12 ">
        <SecuritySection
          title="Verificação de E-mail"
          description="Garanta que seu e-mail está correto para receber notificações e códigos de segurança."
          statusBadge={
            <StatusBadge
              isActive={isEmailVerified}
              activeText="Verificado"
              inactiveText="Não verificado"
            />
          }
        >
          <div className="flex items-center gap-4">
            <div className="w-full grow">
              <CustomInput
                id="security-email"
                label="Seu E-mail"
                icon={<Mail />}
                value={user?.email || ""}
                disabled
              />
            </div>
          </div>
          {!isEmailVerified && (
            <CustomButton
              onClick={handleVerifyEmail}
              disabled={loading || isActionLoading}
              className="w-full sm:w-auto"
            >
              {isActionLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Reenviar link de verificação"
              )}
            </CustomButton>
          )}
        </SecuritySection>

        <SecuritySection
          title="Autenticação de Dois Fatores (2FA)"
          description="Adicione uma camada extra de segurança. Ao entrar, você precisará fornecer um código enviado para o seu e-mail."
          statusBadge={<StatusBadge isActive={isTwoFactorEnabled} />}
        >
          <CustomSwitch
            label={
              isTwoFactorEnabled
                ? "Autenticação de 2 Fatores Ativado"
                : "Autenticação de 2 Fatores Desativado"
            }
            checked={isTwoFactorEnabled}
            onChange={handleToggle2FA}
            isLoading={loading || isActionLoading}
            tip="Também conhecida como duplo fator de autenticação, esta funcionalidade é utilizada no processo de autenticação de login para trazer mais segurança ao usuário."
          />
        </SecuritySection>
      </div>

      <OtpVerificationModal
        isOpen={!!otpAction}
        onClose={() => setOtpAction(null)}
        onConfirm={handleConfirmOtp}
        onResendOtp={handleSendOrResendOtpFor2FA}
        isLoading={isActionLoading}
        title="Verificação de Segurança (2FA)"
        description="Para sua segurança, clique em 'Enviar Código' para receber o código de 6 dígitos no seu e-mail."
        actionText="Confirmar"
        codeAlreadySent={false}
      />
    </>
  );
}
