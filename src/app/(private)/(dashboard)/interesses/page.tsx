"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Inbox, Send } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

import { InterestService } from "@/services/domains/interestService";
import { extractAxiosError } from "@/services/api";
import { InterestCard } from "@/components/cards/InterestCard";
import PageHeader from "@/components/common/PageHeader";
import { InterestListItem } from "@/components/lists/InterestListItem";
import { EmptyCard } from "@/components/common/EmptyCard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants/userRole";

export default function InterestsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useCurrentUser();

  const isLessor = user?.role === Roles.LOCADOR;

  const queryKey = isLessor ? ["receivedInterests"] : ["sentInterests"];
  const queryFn = isLessor
    ? () => InterestService.listReceived()
    : () => InterestService.listSent();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey,
    queryFn,
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    toast.error("Erro ao carregar os interesses", {
      description: extractAxiosError(error),
    });
  }

  const interests = response?.data || [];

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderInterestsList = () => {
    if (interests.length === 0) {
      return isLessor ? (
        <EmptyCard
          icon={<Inbox />}
          title="Nenhum interesse recebido"
          subtitle="Quando um locatário demonstrar interesse em um de seus imóveis, ele aparecerá aqui."
        />
      ) : (
        <EmptyCard
          icon={<Send />}
          title="Nenhum interesse enviado"
          subtitle="Quando você demonstrar interesse em um imóvel, seu status aparecerá aqui."
        />
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {interests.map((interest) => (
          <div key={interest.id} className="flex flex-col gap-1">
            <InterestListItem
              interest={interest}
              isExpanded={expandedId === interest.id}
              onToggle={() => handleToggle(interest.id)}
              userRole={user?.role}
            />
            <AnimatePresence>
              {expandedId === interest.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-1 -mt-2">
                    <InterestCard interest={interest} userRole={user?.role} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pt-8 md:pt-14 px-4 pb-24">
      <PageHeader
        title={isLessor ? "Interesses Recebidos" : "Meus Interesses Enviados"}
        subtitle={
          isLessor
            ? "Gerencie os locatários interessados em seus imóveis e inicie novas locações. É necessário possuir a funcionalidade Receber propostas online ativa."
            : "Acompanhe os imóveis pelos quais você demonstrou interesse e o status do contato."
        }
      />
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          renderInterestsList()
        )}
      </div>
    </div>
  );
}
