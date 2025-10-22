// src/app/(private)/(dashboard)/contratos/[contractId]/revisar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Check,
  MessageSquareWarning,
  Send,
  ScrollText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { ContractService } from "@/services/domains/contractService";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "@/components/forms/CustomButton";
import { CustomFormTextarea } from "@/components/forms/CustomFormTextarea";
import { ContractWithDocuments } from "@/interfaces/contract";
import { CustomCheckbox } from "@/components/forms/CustomCheckbox";
import clsx from "clsx";

const requestAlterationSchema = z.object({
  reason: z
    .string()
    .min(
      10,
      "Por favor, detalhe o motivo da solicitação (mínimo 10 caracteres)."
    )
    .max(500, "O motivo não pode exceder 500 caracteres."),
});
type RequestAlterationFormData = z.infer<typeof requestAlterationSchema>;

export default function ReviewContractPage() {
  const router = useRouter();
  const params = useParams();
  const contractId = params.contractId as string;
  const { sub, loading: userLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const {
    data: reviewData,
    isLoading: isLoadingReview,
    isError: isReviewError,
    error: reviewError,
  } = useQuery<{ renderedHtml: string }>({
    queryKey: ["contractReviewHtml", contractId],
    queryFn: async () => {
      const response = await ContractService.getContractForReview(contractId); // <<< CHAMADA CORRETA
      return response.data;
    },
    enabled: !!contractId && !userLoading,
    retry: false,
  });

  const {
    data: contractDetails,
    isLoading: isLoadingDetails,
    isError: isDetailsError,
    error: detailsError,
  } = useQuery<ContractWithDocuments>({
    queryKey: ["contractDetails", contractId],
    queryFn: async () => {
      const response = await ContractService.findOne(contractId);
      return response.data;
    },
    enabled: !!contractId && !userLoading,
    retry: false,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestAlterationFormData>({
    resolver: zodResolver(requestAlterationSchema),
  });

  useEffect(() => {
    if (isDetailsError) {
      toast.error("Erro ao carregar detalhes do contrato.", {
        description: extractAxiosError(detailsError),
      });
      router.push("/contratos");
      return;
    }
    if (isReviewError) {
      toast.error("Erro ao carregar visualização do contrato.", {
        description: extractAxiosError(reviewError),
      });
      return;
    }

    if (!userLoading && contractDetails) {
      if (sub !== contractDetails.tenantId) {
        toast.error("Acesso não autorizado.");
        router.push("/contratos");
        return;
      }
      if (contractDetails.status !== "AGUARDANDO_ACEITE_INQUILINO") {
        toast.info("Este contrato não está mais aguardando seu aceite.");
        router.push(`/contratos/${contractId}`);
      }
    }
  }, [
    contractDetails,
    isDetailsError,
    detailsError,
    isReviewError,
    reviewError,
    userLoading,
    sub,
    router,
    contractId,
  ]);

  const acceptMutation = useMutation({
    mutationFn: () => ContractService.tenantAcceptsContract(contractId),
    onSuccess: () => {
      toast.success("Contrato aceito com sucesso!", {
        description: "Agora você pode prosseguir com o envio dos documentos.",
      });
      queryClient.invalidateQueries({
        queryKey: ["contractDetails", contractId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contractReviewHtml", contractId], // Também invalidar o review
      });
      router.push(`/contratos/${contractId}/documentos`);
    },
    onError: (error) => {
      toast.error("Não foi possível aceitar o contrato.", {
        description: extractAxiosError(error),
      });
    },
  });

  const requestAlterationMutation = useMutation({
    mutationFn: (data: { reason: string }) =>
      ContractService.requestAlteration(contractId, data),
    onSuccess: () => {
      toast.success("Solicitação de alteração enviada!", {
        description: "O locador foi notificado e revisará sua solicitação.",
      });
      queryClient.invalidateQueries({
        queryKey: ["contractDetails", contractId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contractReviewHtml", contractId], // Também invalidar o review
      });
      router.push(`/contratos/${contractId}`);
    },
    onError: (error) => {
      toast.error("Falha ao enviar solicitação.", {
        description: extractAxiosError(error),
      });
    },
  });

  const handleAccept = () => acceptMutation.mutate();
  const handleRequestAlterationSubmit = (data: RequestAlterationFormData) =>
    requestAlterationMutation.mutate(data);

  const isLoading = isLoadingReview || isLoadingDetails || userLoading;
  const isMutating =
    acceptMutation.isPending || requestAlterationMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (isReviewError || !reviewData?.renderedHtml) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
        <p className="text-lg text-red-600 mb-4">
          Erro ao carregar a visualização do contrato. Tente novamente mais
          tarde.
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Detalhe: {extractAxiosError(reviewError)}
        </p>
        <CustomButton
          onClick={() => router.push("/contratos")}
          ghost
          icon={<ArrowLeft />}
        >
          Voltar para Contratos
        </CustomButton>
      </div>
    );
  }

  if (
    !contractDetails ||
    contractDetails.status !== "AGUARDANDO_ACEITE_INQUILINO"
  ) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
        <p className="text-lg text-gray-600 mb-4">
          Contrato inválido ou não está mais na fase de aceite.
        </p>
        <CustomButton
          onClick={() => router.push("/contratos")}
          ghost
          icon={<ArrowLeft />}
        >
          Voltar para Contratos
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen flex flex-col pt-2">
      <div className="flex-grow max-w-6xl w-full mx-auto px-4 py-6 md:py-8 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 xl:col-span-8 mb-6 lg:mb-0">
          <CustomButton
            onClick={() => router.back()}
            ghost
            className="mb-4 "
            icon={<ArrowLeft size={18} />}
          >
            Voltar
          </CustomButton>

          <div className="overflow-hidden space-y-2 ">
            <div className="p-4 border rounded-t-lg border-border bg-card flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <ScrollText
                  size={20}
                  className="text-muted-foreground flex-shrink-0"
                />
                <h2 className="font-semibold text-foreground text-base sm:text-lg whitespace-nowrap">
                  Contrato do Imóvel {contractDetails.property.title}
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-muted-foreground w-full sm:w-auto pl-8 sm:pl-0">
                <div className="truncate">
                  <span className="font-medium text-foreground">Locador:</span>{" "}
                  {contractDetails.landlord.name}
                </div>
                <span className="hidden sm:inline text-muted">|</span>
                <div className="truncate">
                  <span className="font-medium text-foreground">
                    Inquilino:
                  </span>{" "}
                  {contractDetails.tenant.name}
                </div>
              </div>
            </div>
            <div
              className="prose shadow-sm border border-border prose-sm sm:prose-base max-w-none p-4 md:p-6 bg-card max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-220px)] overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: reviewData.renderedHtml, // <<< RENDERIZAÇÃO CORRETA
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="hidden lg:block lg:sticky lg:top-24 space-y-6">
            <AnimatePresence>
              {showReasonInput && (
                <motion.div
                  key="reason-form-desktop"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={handleSubmit(handleRequestAlterationSubmit)}
                    className="space-y-4 p-4 border border-dashed border-amber-400 rounded-lg bg-amber-50 shadow-sm"
                  >
                    <h3 className="font-semibold text-amber-800 text-base flex items-center gap-2">
                      <MessageSquareWarning size={18} /> Solicitar Alteração no
                      Contrato
                    </h3>
                    <Controller
                      name="reason"
                      control={control}
                      render={({ field }) => (
                        <CustomFormTextarea
                          id="reason-desktop"
                          label="Descreva a alteração desejada*"
                          placeholder="Ex: Gostaria de incluir a permissão para um animal de estimação..."
                          icon={
                            <MessageSquareWarning className="h-5 w-5 invisible" />
                          }
                          error={errors.reason?.message}
                          maxLength={500}
                          rows={4}
                          disabled={isMutating}
                          {...field}
                        />
                      )}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <CustomButton
                        type="button"
                        onClick={() => {
                          setShowReasonInput(false);
                          reset();
                        }}
                        disabled={isMutating}
                        ghost
                      >
                        Cancelar
                      </CustomButton>
                      <CustomButton
                        type="submit"
                        disabled={isMutating}
                        isLoading={requestAlterationMutation.isPending}
                        color="bg-amber-500 hover:bg-amber-600"
                        textColor="text-white"
                        icon={<Send size={16} />}
                      >
                        Enviar Solicitação
                      </CustomButton>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {!showReasonInput && (
              <div className="bg-card rounded-lg border border-border shadow-sm p-5">
                <h3 className="font-semibold text-foreground mb-4 text-base">
                  Próximo Passo
                </h3>
                <div className="mb-5">
                  <CustomCheckbox
                    id="terms-agreement-desktop"
                    checked={hasAgreed}
                    onChange={(checked) => setHasAgreed(checked)}
                    label={
                      <span className="text-sm font-medium text-muted-foreground">
                        Declaro que li e concordo com todos os termos e
                        cláusulas apresentados neste contrato de locação.
                      </span>
                    }
                    disabled={isMutating}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <CustomButton
                    onClick={handleAccept}
                    disabled={isMutating || !hasAgreed}
                    isLoading={acceptMutation.isPending}
                    className="w-full text-base py-2.5"
                    icon={<Check size={18} />}
                  >
                    Aceitar Contrato e Continuar
                  </CustomButton>
                  <CustomButton
                    onClick={() => setShowReasonInput(true)}
                    disabled={isMutating}
                    color="bg-transparent"
                    textColor="text-amber-600"
                    className="w-full border border-amber-300 hover:bg-amber-50 text-base py-2.5"
                    icon={<MessageSquareWarning size={18} />}
                  >
                    Solicitar Alteração
                  </CustomButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "sticky bottom-0 left-0 w-full bg-white p-4 border-t border-border shadow-md-top z-20",
          "lg:hidden"
        )}
      >
        <AnimatePresence mode="wait">
          {showReasonInput ? (
            <motion.div
              key="reason-form-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <form
                onSubmit={handleSubmit(handleRequestAlterationSubmit)}
                className="space-y-3"
              >
                <h3 className="font-semibold text-amber-800 text-base flex items-center gap-2">
                  <MessageSquareWarning size={18} /> Solicitar Alteração
                </h3>
                <Controller
                  name="reason"
                  control={control}
                  render={({ field }) => (
                    <CustomFormTextarea
                      id="reason-mobile"
                      placeholder="Descreva a alteração desejada aqui...*"
                      icon={
                        <MessageSquareWarning className="h-5 w-5 invisible" />
                      }
                      error={errors.reason?.message}
                      maxLength={500}
                      rows={3}
                      disabled={isMutating}
                      {...field}
                    />
                  )}
                />
                <div className="flex justify-end gap-2 pt-1">
                  <CustomButton
                    type="button"
                    onClick={() => {
                      setShowReasonInput(false);
                      reset();
                    }}
                    disabled={isMutating}
                    ghost
                    className="px-3 py-1.5 text-sm"
                  >
                    Cancelar
                  </CustomButton>
                  <CustomButton
                    type="submit"
                    disabled={isMutating}
                    isLoading={requestAlterationMutation.isPending}
                    color="bg-amber-500 hover:bg-amber-600"
                    textColor="text-white"
                    icon={<Send size={14} />}
                    className="px-3 py-1.5 text-sm"
                  >
                    Enviar
                  </CustomButton>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="action-buttons-mobile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <CustomCheckbox
                  id="terms-agreement-mobile"
                  checked={hasAgreed}
                  onChange={(checked) => setHasAgreed(checked)}
                  label={
                    <span className="text-sm font-medium text-gray-700">
                      Li e concordo com os termos.
                    </span>
                  }
                  disabled={isMutating}
                />
              </div>
              <div className="flex flex-col gap-3">
                <CustomButton
                  onClick={handleAccept}
                  disabled={isMutating || !hasAgreed}
                  isLoading={acceptMutation.isPending}
                  className="w-full text-base py-2.5"
                  icon={<Check size={18} />}
                >
                  Aceitar e Continuar
                </CustomButton>
                <CustomButton
                  onClick={() => setShowReasonInput(true)}
                  disabled={isMutating}
                  ghost
                  className="w-full text-base py-2.5"
                  icon={<MessageSquareWarning size={18} />}
                >
                  Solicitar Alteração
                </CustomButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
