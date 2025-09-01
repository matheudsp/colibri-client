"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { destroyCookie, setCookie } from "nookies";

import { LockIcon, MailIcon, Loader2 } from "lucide-react";

import { LoginFormData, loginSchema } from "../../../validations";
import { AuthService } from "../../../services/domains/authService";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomInput } from "@/components/forms/CustomInput";
import { extractAxiosError } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      destroyCookie(null, "authToken", { path: "/" });

      const response = await AuthService.login(data);

      setCookie(null, "authToken", response.data.access_token, {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });

      toast.success("Login efetuado com sucesso!");
      router.push("/properties");
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha no login", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh w-full bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Image
          width={200}
          height={200}
          src="/icons/logo-purple-black.svg"
          alt="Logo Colibri"
          priority
          className="w-auto h-36 sm:h-44 mx-auto mb-8"
        />
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">
              Acesse sua Conta
            </h1>
            <p className="text-foreground/70 mt-2">Bem-vindo de volta!</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  id="email"
                  label="Email"
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
                    label="Senha"
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
                  href="#"
                  className="text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

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
                onClick={() => router.push("/register")}
                ghost
                className="w-full"
              >
                Não tenho uma conta
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
