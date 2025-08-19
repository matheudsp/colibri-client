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
  CheckCircle2,
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
import { useAuth } from "@/hooks/useAuth";
import { CustomButton } from "@/components/forms/CustomButton";
import { PropertyGallery } from "@/components/galleries/PropertyGallery";

const PriceAndContactCard = ({ property }: { property: PropertyResponse }) => {
  const whatsappLink = `https://wa.me/${property.landlord.phone.replace(
    /\D/g,
    ""
  )}?text=Olá, tenho interesse no imóvel "${encodeURIComponent(
    property.title
  )}" (Cód: ${property.id.substring(0, 8)})`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
      <div>
        <p className="text-gray-500 text-sm">Valor do Aluguel (mensal)</p>
        <p className="text-3xl font-bold text-primary">
          {formatCurrency(property.rentValue)}
        </p>
      </div>

      <div className="border-t pt-5">
        <p className="font-bold text-gray-800 mb-3">
          Gostou? Fale com o locador!
        </p>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center">
            <User className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {property.landlord.name}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <CustomButton className="w-full bg-green-500 hover:bg-green-600">
              <FaWhatsapp size={18} className="mr-2" /> Conversar no WhatsApp
            </CustomButton>
          </a>
          <a href={`mailto:${property.landlord.email}`}></a>
        </div>
      </div>
    </div>
  );
};

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<PropertyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const propertyId = params.propertyId as string;

  useAuth();

  useEffect(() => {
    if (!propertyId) return;
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await PropertyService.getById(propertyId);
        setProperty(response.data);
      } catch {
        toast.error("Falha ao carregar os detalhes do imóvel.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Imóvel não encontrado.</p>
        <CustomButton onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="mr-2" /> Voltar
        </CustomButton>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
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

        {/* --- Corpo da Página --- */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Coluna Esquerda: Galeria e Detalhes */}
          <div className="lg:col-span-8 space-y-8">
            <PropertyGallery
              photos={property.photos}
              altText={property.title}
            />

            {/* Card de Contato (Mobile) */}
            <div className="lg:hidden">
              <PriceAndContactCard property={property} />
            </div>

            {/* Card de Detalhes do Imóvel */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {property.title}
                </h1>
                {property.isAvailable ? (
                  <div className="flex-shrink-0 flex items-center text-green-600 bg-green-100 font-bold text-xs px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={14} className="mr-1.5" /> Disponível
                    para Alugar
                  </div>
                ) : (
                  <div className="flex-shrink-0 flex items-center text-red-600 bg-red-100 font-bold text-xs px-2.5 py-1 rounded-full">
                    <XCircle size={14} className="mr-1.5" /> Já Alugado
                  </div>
                )}
              </div>

              {/* Detalhes Principais */}
              <div className="border-t pt-6">
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

              {/* Localização */}
              <div className="border-t pt-6">
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

              {/* Descrição */}
              {property.description && (
                <div className="border-t pt-6">
                  <h2 className="font-bold text-lg text-gray-800">Descrição</h2>
                  <p className="mt-3 text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Coluna Direita (Sticky Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-6">
              <PriceAndContactCard property={property} />
            </div>
          </aside>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">
          Código de Referência do Imóvel: {property.id}
        </p>
      </div>
    </div>
  );
}
