"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bath,
  Bed,
  Building,
  Car,
  CheckCircle2,
  Loader2,
  Maximize,
  XCircle,
} from "lucide-react";

import { PropertyService } from "@/services/domains/propertyService";
import { CustomButton } from "@/components/forms/CustomButton";
import { PropertyGallery } from "@/components/galleries/PropertyGallery";
import { extractAxiosError } from "@/services/api";
import { LoginModal } from "@/components/modals/authModals/LoginModal";
import { InterestIndicator } from "@/components/layout/InterestIndicator";
import { PropertyPriceAndContact } from "@/components/cards/details/PropertyPriceAndContact";

import { AutopromoteSection } from "./autopromote-section";

export default function PropertyDetailsPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;

  const {
    data: property,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const response = await PropertyService.getById(propertyId);
      return response.data;
    },
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
    retry: 1, // Tenta novamente 1 vez em caso de erro
  });

  if (isError) {
    const errorMessage = extractAxiosError(error);
    toast.error("Ocorreu um erro ao carregar detalhes do imóvel", {
      description: errorMessage,
    });
  }

  const handleLoginRequired = () => {
    window.sessionStorage.setItem("loginIntent", "showInterest");
    setIsLoginModalOpen(true);
  };

  if (isLoading) {
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
      <div className=" min-h-screen w-full ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <nav className="mt-24 pb-6">
            <CustomButton
              onClick={() => router.back()}
              ghost
              className=""
              icon={<ArrowLeft size={18} />}
            >
              Voltar
            </CustomButton>
          </nav>

          <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
            <div className="lg:col-span-8 space-y-8">
              <PropertyGallery
                photos={property.photos}
                altText={property.title}
              />

              <div className="lg:hidden">
                <PropertyPriceAndContact
                  property={property}
                  onLoginRequired={handleLoginRequired}
                />
              </div>

              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
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
                      {/* <strong>Endereço:</strong> {property.street},{" "}
                      {property.number}{" "} */}
                      <strong>Endereço:</strong> {property.street}
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
                <PropertyPriceAndContact
                  property={property}
                  onLoginRequired={handleLoginRequired}
                />
              </div>
            </aside>
          </div>

          <AutopromoteSection />

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
