"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LockIcon, Loader2 } from "lucide-react";

import { FormWrapper } from "@/components/forms/FormWrapper";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/validations/auths/resetPasswordValidation";
import { AuthService } from "@/services/domains/authService";
import { extractAxiosError } from "@/services/api";

function ResetPasswordComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      toast.error("Token inválido ou ausente.");
      router.push("/entrar");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Token de redefinição não encontrado.");
      return;
    }
    setLoading(true);
    try {
      await AuthService.resetPassword(data.password, token);
      toast.success("Senha redefinida com sucesso!");
      router.push("/entrar");
    } catch (error) {
      toast.error("Falha ao redefinir a senha", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <FormWrapper
      title="Redefinir Senha"
      subtitle="Crie uma nova senha para sua conta."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              type="password"
              placeholder="*********"
              id="password"
              label="Nova Senha"
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
              id="confirmPassword"
              placeholder="*********"
              label="Confirme a Nova Senha"
              icon={<LockIcon />}
              error={errors.confirmPassword?.message}
              {...field}
            />
          )}
        />
        <CustomButton
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-secondary font-bold text-lg py-3 mt-4"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" /> : "Redefinir Senha"}
        </CustomButton>
      </form>
    </FormWrapper>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  );
}
