import { FaWhatsapp } from "react-icons/fa";
import { InterestService } from "@/services/domains/interestService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Tooltip } from "@/components/common/Tooltip";
import { PropertyResponse } from "@/services/domains/propertyService";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CustomButton } from "@/components/forms/CustomButton";
import { CheckCircle, HelpCircle, User } from "lucide-react";
import { formatCurrency } from "@/utils/masks/maskCurrency";
export const PropertyPriceAndContact = ({
  property,
  onLoginRequired,
}: {
  property: PropertyResponse;
  onLoginRequired: () => void;
}) => {
  const { user } = useCurrentUser();
  const [interestSent, setInterestSent] = useState(false);

  const { data: interestStatus, isLoading: isLoadingInterestStatus } = useQuery(
    {
      queryKey: ["interestStatus", property.id, user?.id],
      queryFn: () => InterestService.checkInterest(property.id),
      enabled: !!user,
    }
  );

  // Efeito para sincronizar o estado local com o resultado da query
  useEffect(() => {
    if (interestStatus?.data?.hasInterested) {
      setInterestSent(true);
    }
  }, [interestStatus]);

  const isOwner = user?.id === property.landlordId;

  const whatsappLink = property.landlord?.phone
    ? `https://wa.me/${property.landlord.phone.replace(
        /\D/g,
        ""
      )}?text=Olá, tenho interesse no imóvel "${encodeURIComponent(
        property.title
      )}" (Cód: ${property.id.substring(0, 8)})`
    : null;

  const { mutate: demonstrateInterest, isPending } = useMutation({
    mutationFn: (propertyId: string) => InterestService.create({ propertyId }),
    onSuccess: () => {
      toast.success("Interesse enviado com sucesso!", {
        description: "O locador foi notificado e poderá entrar em contato.",
      });
      setInterestSent(true);
    },
    onError: (error) => {
      toast.error("Erro ao enviar interesse.", {
        description: error.message,
      });
    },
  });

  const handleShowInterest = () => {
    if (!user) {
      window.sessionStorage.setItem("loginIntent", "showInterest");
      onLoginRequired();
      return;
    }
    demonstrateInterest(property.id);
  };

  const renderActionButtons = () => {
    if (isOwner) {
      return (
        <div className="text-center text-sm text-foreground py-3 bg-primary-light/50 border-muted border border-dashed  rounded-lg">
          Você é o proprietário deste imóvel.
        </div>
      );
    }

    if (property.acceptOnlineProposals) {
      if (interestSent) {
        return (
          <CustomButton className="w-full" disabled={true}>
            <CheckCircle className="h-5 w-5 mr-2" />
            Interesse Já Enviado
          </CustomButton>
        );
      }
      return (
        <div className="flex items-center gap-2">
          <CustomButton
            onClick={handleShowInterest}
            className="w-full bg-secondary hover:bg-secondary-hover"
            disabled={isPending || isLoadingInterestStatus}
            isLoading={isPending || isLoadingInterestStatus}
          >
            Estou interessado
          </CustomButton>
          <Tooltip
            content="Ao clicar, o locador será notificado do seu interesse e poderá iniciar o processo de locação pela plataforma."
            position="top"
          >
            <HelpCircle className="h-5 w-5 text-gray-400 cursor-help" />
          </Tooltip>
        </div>
      );
    }

    if (whatsappLink) {
      return (
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <CustomButton className="w-full bg-green-500 hover:bg-green-600">
            <FaWhatsapp size={18} className="mr-2" />
            Conversar no WhatsApp
          </CustomButton>
        </a>
      );
    }

    return null;
  };

  return (
    <div className="border  border-border rounded-xl p-5 space-y-5 bg-card shadow-sm">
      <div>
        <p className="text-sm text-gray-500">
          {property.transactionType === "LOCACAO"
            ? "Valor do Aluguel"
            : "Valor de Venda"}
        </p>
        <p className="text-3xl font-bold text-primary">
          {formatCurrency(property.value)}
          {property.transactionType === "LOCACAO" && (
            <span className="text-lg font-medium text-gray-500">/mês</span>
          )}
        </p>
      </div>

      {/* Seção de Contato */}
      <div className="border-t border-border pt-5">
        <p className="font-bold text-gray-800 mb-3">Gostou do imóvel?</p>

        {/* Informações do Locador */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
            <User className="text-primary" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Locador(a)</p>
            <p className="font-semibold text-gray-800">
              {property.landlord.name}
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="mt-4 space-y-2">{renderActionButtons()}</div>
      </div>
    </div>
  );
};
