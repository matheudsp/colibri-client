"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { LockIcon, MailIcon, Loader2 } from "lucide-react";

import { LoginFormData, loginSchema } from "../../../validations";
import { AuthService } from "../../../services/domains/authService";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { extractAxiosError } from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import { SecuritySeal } from "@/components/common/SecuritySeal";

export default function LoginPage() {
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
    router.push("/imoveis");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await AuthService.login(data);

      if ("twoFactorRequired" in response && response.twoFactorRequired) {
        setPartialToken(response.partialToken);
        setIsOtpModalOpen(true);
        setLoading(false);
      } else {
        await completeLoginFlow();
        setLoading(false);
      }
    } catch (error: unknown) {
      toast.error("Falha no login", { description: extractAxiosError(error) });
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
      // toast.error("Falha na verificação", {
      //   description: "Código inválido ou expirado. Tente novamente.",
      // });
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
      setPartialToken(response.partialToken);
    }
    return { data: { message: "Código reenviado com sucesso!" } };
  };

  const handleCloseModal = () => {
    setIsOtpModalOpen(false);
    setLoading(false);
    setPartialToken(null);
  };

  return (
    <>
      <div className="min-h-[90svh] w-full bg-background flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className=" ">
            <div className="text-center mb-8 mt-20">
              <h1 className="text-3xl font-bold text-secondary">Entrar</h1>
              <p className="text-foreground/70 mt-2">Bem-vindo de volta!</p>
            </div>{" "}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    id="email"
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
                      id="password"
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
                    className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                  >
                    Esqueci a senha
                  </Link>
                </div>
              </div>

              <SecuritySeal />

              <div className="pt-4 space-y-4">
                <CustomButton
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold text-lg py-3"
                  disabled={loading}
                  isLoading={loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={() => router.push("/registrar")}
                  ghost
                  className="w-full"
                >
                  Ainda não possui conta? Crie agora
                </CustomButton>
              </div>
            </form>
          </div>
        </div>
      </div>
      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmOtp}
        onResendOtp={handleResendOtp}
        isLoading={loading}
        title="Verificação de Dois Fatores"
        description="Um código de segurança foi enviado para o seu e-mail. Insira-o abaixo para continuar."
        actionText="Confirmar e Entrar"
        codeAlreadySent={true}
      />
    </>
  );
}
