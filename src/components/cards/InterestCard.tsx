"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  Check,
  FilePlus2,
  Mail,
  MessageSquare,
  Phone,
  ThumbsDown,
  User,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Interest, InterestService } from "@/services/domains/interestService";
import { extractAxiosError } from "@/services/api";
import { CustomButton } from "../forms/CustomButton";
import { DismissInterestModal } from "../modals/interestModals/DismissInterestModal";
import { Roles } from "@/constants/userRole";

interface InterestCardProps {
  interest: Interest;
  userRole?: string;
}

export function InterestCard({ interest, userRole }: InterestCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);

  const isLessor = userRole === Roles.LOCADOR;

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (data: {
      status: "CONTACTED" | "DISMISSED";
      dismissalReason?: string;
    }) => InterestService.updateStatus(interest.id, data),
    onSuccess: () => {
      toast.success("Status do interesse foi atualizado.");
      const queryKey = isLessor ? ["receivedInterests"] : ["sentInterests"];
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar status", {
        description: extractAxiosError(error),
      });
    },
  });

  const handleStartContract = () => {
    router.push(`/imovel/${interest.property.id}/criar-contrato`);
  };

  const handleConfirmDismiss = (reason: string) => {
    updateStatus({ status: "DISMISSED", dismissalReason: reason });
    setIsDismissModalOpen(false);
  };

  return (
    <div className="bg-background border border-border rounded-b-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          {isLessor ? (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <User size={16} /> Contato do Interessado
              </p>
              <div className="text-sm text-gray-700 space-y-1 pl-2 border-l-2 border-border">
                <p className="font-medium">{interest.tenant.name}</p>
                <p className="flex items-center gap-2 break-all">
                  <Mail size={16} className="flex-shrink-0 text-gray-500" />
                  <span>{interest.tenant.email}</span>
                </p>
                <p className="flex items-center gap-2 break-all">
                  <Phone size={16} className="flex-shrink-0 text-gray-500" />
                  <span>{interest.tenant.phone}</span>
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Building size={16} /> Locador
              </p>
              <div className="text-sm text-gray-700 space-y-1 pl-2 border-l-2 border-border">
                <p className="font-medium">{interest.landlord.name}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare size={16} /> Mensagem
          </p>
          <div className="text-sm text-gray-700 pl-2 border-l-2 border-border">
            <p className="italic">
              {interest.message || "Nenhuma mensagem enviada."}
            </p>
          </div>
        </div>
      </div>

      {isLessor ||
        (interest.status !== "DISMISSED" && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <p className="text-sm font-semibold text-center mb-1">
              Ações Rápidas
            </p>
            {interest.status === "PENDING" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <CustomButton
                  onClick={() => setIsDismissModalOpen(true)}
                  disabled={isPending}
                  color="bg-gray-200"
                  textColor="text-gray-800"
                >
                  <ThumbsDown size={16} className="mr-2" /> Dispensar
                </CustomButton>
                <CustomButton
                  onClick={() => updateStatus({ status: "CONTACTED" })}
                  disabled={isPending}
                >
                  <Check size={16} className="mr-2" /> Marcar como Contatado
                </CustomButton>
              </div>
            )}

            <CustomButton
              onClick={handleStartContract}
              disabled={isPending}
              className="bg-secondary hover:bg-secondary-hover"
            >
              <FilePlus2 size={16} className="mr-2" /> Iniciar Contrato
            </CustomButton>
          </div>
        ))}

      <DismissInterestModal
        isOpen={isDismissModalOpen}
        onClose={() => setIsDismissModalOpen(false)}
        onConfirm={handleConfirmDismiss}
        isLoading={isPending}
      />
    </div>
  );
}
