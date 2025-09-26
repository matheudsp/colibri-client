"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { LockIcon, MailIcon } from "lucide-react";
import Image from "next/image";

import { Modal } from "@/components/modals/Modal";
import { LoginFormData, loginSchema } from "@/validations";
import {
  AuthService,
  TwoFactorRequiredResponse,
} from "@/services/domains/authService";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { extractAxiosError } from "@/services/api";
import { useUserStore } from "@/stores/userStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [partialToken, setPartialToken] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const completeLoginFlow = async () => {
    const meResponse = await AuthService.getMe();
    useUserStore.getState().setUser(meResponse.data);
    toast.success("Login efetuado com sucesso!");
    onSuccess();
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AuthService.login(data);

      if ("twoFactorRequired" in response && response.twoFactorRequired) {
        setPartialToken(
          (response as TwoFactorRequiredResponse).partialToken || null
        );
        setIsOtpModalOpen(true);
      } else {
        await completeLoginFlow();
      }
    } catch (error: unknown) {
      toast.error("Falha no login", { description: extractAxiosError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmOtp = async (otp: string) => {
    if (!partialToken) return;
    setLoading(true);
    try {
      await AuthService.loginWith2FA({ partialToken, code: otp });
      await completeLoginFlow();
      setIsOtpModalOpen(false);
    } catch (error) {
      toast.error("Falha na verificação", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const loginData = getValues();
    const response = await AuthService.login(loginData);
    if ("twoFactorRequired" in response && response.twoFactorRequired) {
      setPartialToken(
        (response as TwoFactorRequiredResponse).partialToken || null
      );
    }
    return { data: { message: "Código reenviado com sucesso!" } };
  };

  const handleCloseAll = () => {
    setIsOtpModalOpen(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCloseAll} title="">
        <div className="text-center p-2 sm:p-4">
          <Image
            src="/logo/paisagem/paisagem-svg/7.svg"
            alt="Logo Colibri"
            width={160}
            height={48}
            className="mx-auto mb h-10 sm:h-12 w-auto"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-secondary">
            Acessar sua conta
          </h2>
          <p className="text-foreground/70 mt-1 text-sm sm:text-base">
            Bem-vindo de volta!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6 pt-6 px-2 sm:px-4"
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                id="email-modal"
                label="Email *"
                placeholder="ex: johndoe@gmail.com"
                type="email"
                icon={<MailIcon size={20} />}
                error={errors.email?.message}
                autoComplete="email"
                {...field}
              />
            )}
          />
          <div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="password-modal"
                  label="Senha *"
                  type="password"
                  placeholder="********"
                  icon={<LockIcon size={20} />}
                  error={errors.password?.message}
                  autoComplete="current-password"
                  {...field}
                />
              )}
            />
            <div className="text-right mt-2">
              <Link
                href="/esqueci-senha"
                onClick={onClose}
                className="text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                Esqueci a senha
              </Link>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <CustomButton
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold text-base sm:text-lg py-3"
              disabled={loading}
              isLoading={loading}
            >
              Entrar
            </CustomButton>
            <CustomButton
              type="button"
              onClick={() => {
                onClose();
                router.push("/registrar");
              }}
              ghost
              className="w-full"
            >
              Ainda não possui conta? Crie agora
            </CustomButton>
          </div>
        </form>
      </Modal>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={handleConfirmOtp}
        onResendOtp={handleResendOtp}
        isLoading={loading}
        title="Verificação de Dois Fatores"
        description="Um código de segurança foi enviado para o seu e-mail."
        actionText="Confirmar e Entrar"
        codeAlreadySent={true}
      />
    </>
  );
}
