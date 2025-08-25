"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  // User, Phone,
  ArrowLeft,
} from "lucide-react";

import { useUserRole } from "@/hooks/useUserRole";
import { CustomButton } from "@/components/forms/CustomButton";
// import { CustomFormInput } from "@/components/forms/CustomFormInput";
import { UserService } from "@/services/domains/userService";
import {
  userUpdateSchema,
  UserUpdateFormValues,
} from "@/validations/users/userUpdateValidation";
import { AuthService } from "@/services/domains/authService";
import { useRouter } from "next/navigation";
import { extractAxiosError } from "@/services/api";

export default function ProfilePage() {
  const { sub, loading: userLoading } = useUserRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    // control,
    handleSubmit,
    setValue,
    formState: {
      // errors,
      isDirty,
    },
  } = useForm<UserUpdateFormValues>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AuthService.getMe();

        const { name } = response.data;
        setValue("name", name);
      } catch (error) {
        const errorMessage = extractAxiosError(error);
        toast.error("Não foi possível carregar seus dados", {
          description: errorMessage,
        });
      }
    };
    fetchUserData();
  }, [setValue]);

  const onSubmit = async (data: UserUpdateFormValues) => {
    if (!sub) return;
    setLoading(true);
    try {
      await UserService.update(sub, data);
      toast.success("Dados atualizados com sucesso!");
    } catch (error) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao atualizar dados", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 md:pt-28 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        <CustomButton
          onClick={() => router.push("/account")}
          ghost
          className="text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="mr-2" />
          Voltar para Conta
        </CustomButton>
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h1 className="text-2xl font-bold text-gray-800 text-center">
            Meus Dados
          </h1>
          <p className="text-gray-500 mt-1 text-center">
            Mantenha suas informações sempre atualizadas.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* <CustomFormInput
              id="name"
              label="Nome Completo"
              icon={<User />}
              {...register("name")}
              error={errors.name?.message}
            />
            <CustomFormInput
              id="phone"
              label="Celular"
              icon={<Phone />}
              mask="phone"
              {...register("phone")}
              error={errors.phone?.message}
            /> */}
            <CustomButton
              type="submit"
              disabled={loading || !isDirty}
              className="w-full"
              fontSize="text-lg"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Salvar Alterações"
              )}
            </CustomButton>
          </form>
        </div>
      </div>
    </div>
  );
}
