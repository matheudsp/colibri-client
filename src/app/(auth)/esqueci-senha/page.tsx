"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MailIcon, ArrowLeft, Loader2 } from "lucide-react";

import { FormWrapper } from "@/components/forms/FormWrapper";
import { CustomInput } from "@/components/forms/CustomInput";
import { CustomButton } from "@/components/forms/CustomButton";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/validations/auths/forgotPasswordValidation";
import { AuthService } from "@/services/domains/authService";
import { extractAxiosError } from "@/services/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    try {
      await AuthService.forgotPassword(data);
      toast.success("Link de recuperação enviado!", {
        description:
          "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.",
      });
      router.push("/entrar");
    } catch (error) {
      toast.error("Falha ao enviar e-mail", {
        description: extractAxiosError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Recuperar Senha"
      subtitle="Digite seu e-mail para receber o link de recuperação."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              id="email"
              label="E-mail"
              placeholder="Ex: johndoe@email.com"
              icon={<MailIcon />}
              error={errors.email?.message}
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
            {loading ? <Loader2 className="animate-spin" /> : "Enviar Link"}
          </CustomButton>
        </div>
      </form>
    </FormWrapper>
  );
}
