"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building,
  Car,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Maximize,
  User,
  XCircle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { formatCurrency } from "@/utils/masks/maskCurrency";
import {
  PropertyResponse,
  PropertyService,
} from "@/services/domains/propertyService";

import { CustomButton } from "@/components/forms/CustomButton";
import { PropertyGallery } from "@/components/galleries/PropertyGallery";
import { extractAxiosError } from "@/services/api";
import { InterestService } from "@/services/domains/interestService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { LoginModal } from "@/components/modals/authModals/LoginModal";
import { Tooltip } from "@/components/common/Tooltip";
import { InterestIndicator } from "@/components/layout/InterestIndicator";

const PriceAndContactCard = ({
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
        <div className="text-center text-sm text-foreground-muted py-3 bg-background-alt border border-border rounded-lg">
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
    <div className="border border-border rounded-xl p-5 space-y-5 bg-background shadow-sm">
      {/* Seção de Preço */}
      <div>
        <p className="text-gray-500 text-sm">Valor do Aluguel (mensal)</p>
        <p className="text-3xl font-bold text-primary">
          {formatCurrency(property.value)}
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

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;

  useEffect(() => {
    if (!propertyId) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await PropertyService.getById(propertyId);
        setProperty(response.data);
      } catch (_error) {
        const errorMessage = extractAxiosError(_error);
        toast.error("Ocorreu um erro ao carregar detalhes do imóvel", {
          description: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  const handleLoginRequired = () => {
    window.sessionStorage.setItem("loginIntent", "showInterest");
    setIsLoginModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <p className="text-gray-600 text-lg">Imóvel não encontrado.</p>
        <CustomButton onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2" /> Voltar
        </CustomButton>
      </div>
    );
  }

  return (
    <>
      <div className=" min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <nav className="mt-24 pb-6">
            <CustomButton
              onClick={() => router.back()}
              ghost
              className="text-gray-600 hover:text-gray-900 px-2"
            >
              <ArrowLeft className="mr-2" /> Voltar
            </CustomButton>
          </nav>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-8 space-y-8">
              <PropertyGallery
                photos={property.photos}
                altText={property.title}
              />

              <div className="lg:hidden">
                <PriceAndContactCard
                  property={property}
                  onLoginRequired={handleLoginRequired}
                />
              </div>

              <div className=" border border-border rounded-xl p-6 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    {property.isAvailable ? (
                      <div className="shrink-0 flex items-center text-green-600 bg-green-100 font-bold text-xs px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={14} className="mr-1.5" /> Disponível
                        para Alugar
                      </div>
                    ) : (
                      <div className="shrink-0 flex items-center text-red-600 bg-red-100 font-bold text-xs px-2.5 py-1 rounded-full">
                        <XCircle size={14} className="mr-1.5" /> Já Alugado
                      </div>
                    )}
                    <InterestIndicator count={property.interestCount || 0} />
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h2 className="font-bold text-lg text-gray-800 mb-4">
                    Características
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 font-medium">
                    <div className="flex items-center gap-2 ">
                      <div className="bg-primary p-2 rounded-xl">
                        <Maximize size={16} className="text-white rotate-45 " />{" "}
                      </div>
                      {property.areaInM2} m² de área
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary p-2 rounded-xl">
                        <Bed size={16} className="text-white" />{" "}
                      </div>
                      {property.numRooms} Quarto(s)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary p-2 rounded-xl">
                        <Bath size={16} className="text-white" />{" "}
                      </div>
                      {property.numBathrooms} Banheiro(s)
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-primary p-2 rounded-xl">
                        <Car size={16} className="text-white" />{" "}
                      </div>
                      {property.numParking} Vaga(s)
                    </div>
                    {property.condominiumId && (
                      <div className="flex items-center gap-2">
                        <div className="bg-primary p-2 rounded-xl">
                          <Building size={16} className="text-white" />
                        </div>{" "}
                        Em condomínio
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <h2 className="font-bold text-lg text-gray-800 mb-4">
                    Localização
                  </h2>
                  <div className="text-gray-600 space-y-1">
                    <p>
                      <strong>Endereço:</strong> {property.street},{" "}
                      {property.number}{" "}
                      {property.complement && `, ${property.complement}`}
                    </p>
                    <p>
                      <strong>Bairro:</strong> {property.district}
                    </p>
                    <p>
                      <strong>Cidade/Estado:</strong> {property.city} /{" "}
                      {property.state}
                    </p>
                    <p>
                      <strong>CEP:</strong> {property.cep}
                    </p>
                  </div>
                </div>

                {property.description && (
                  <div className="border-t border-border pt-4">
                    <h2 className="font-bold text-lg text-gray-800">
                      Descrição
                    </h2>
                    <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <aside className="hidden lg:block lg:col-span-4">
              <div className="sticky top-6">
                <PriceAndContactCard
                  property={property}
                  onLoginRequired={handleLoginRequired}
                />
              </div>
            </aside>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-center">
            Código de Referência do Imóvel: {property.id}
          </p>
        </div>
      </div>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          window.sessionStorage.removeItem("loginIntent");
        }}
        onSuccess={() => {
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
}
