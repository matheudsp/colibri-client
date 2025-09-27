"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { UserService } from "@/services/domains/userService";
import { extractAxiosError } from "@/services/api";
import {
  preferencesSchema,
  PreferencesFormValues,
} from "@/validations/users/preferencesValidation";

import { CustomSwitch } from "@/components/forms/CustomSwitch";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomLabel } from "../forms/CustomLabel";

export function PreferencesTab() {
  const { data: initialPreferences, isLoading } = useQuery({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      const response = await UserService.getPreferences();
      console.log(response);
      return response.data;
    },
    staleTime: Infinity,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: {
        acceptOnlineProposals: false,
      },
    },
  });

  useEffect(() => {
    if (initialPreferences) {
      reset(initialPreferences);
    }
  }, [initialPreferences, reset]);

  const onSubmit = async (data: PreferencesFormValues) => {
    try {
      await UserService.updatePreferences(data);
      toast.success("Preferências salvas com sucesso!");
      reset(data);
    } catch (error) {
      toast.error("Falha ao salvar as preferências.", {
        description: extractAxiosError(error),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-0 md:p-4 rounded-b-xl rounded-tr-xl space-y-8"
    >
      <div className="flex items-center justify-between rounded-lg border border-border p-4 gap-2">
        <div className="space-y-0.5 ">
          <CustomLabel htmlFor="accept-proposals">
            Receber propostas online
          </CustomLabel>
          <p className="text-sm text-foreground-muted">
            Essa opção oculta seu telefone da página do imóvel e coleta
            interessados no seu imóvel, você pode consulta-los na página de
            interessados para contatar, rejeitar ou iniciar contrato
            rapidamente.
          </p>
        </div>
        <Controller
          name="notifications.acceptOnlineProposals"
          control={control}
          render={({ field }) => (
            <CustomSwitch
              label=""
              checked={field.value}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
          )}
        />
      </div>

      <div className="flex justify-end">
        <CustomButton type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar alterações
        </CustomButton>
      </div>
    </form>
  );
}
