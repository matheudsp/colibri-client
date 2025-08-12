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
  Home,
  Loader2,
  Mail,
  MapPin,
  Maximize,
  Phone,
  Tag,
  User,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Property, PropertyService } from "@/services/domains/propertyService";
import { useAuth } from "@/hooks/useAuth";
import { CustomButton } from "@/components/forms/CustomButton";
import { PropertyGallery } from "@/components/galleries/PropertyGallery";

export default function PropertyDetailsPage() {
  const [property, setProperty] = useState<Property | null>(null);
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
      <div className="flex justify-center items-center h-screen" role="status">
        <Loader2
          className="animate-spin text-primary"
          size={48}
          aria-hidden="true"
        />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Imóvel não encontrado.</p>
        <CustomButton
          onClick={() => router.back()}
          className="mt-4"
          aria-label="Voltar"
        >
          <ArrowLeft className="mr-2" aria-hidden="true" /> Voltar
        </CustomButton>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/${property.landlord.phone.replace(
    /\D/g,
    ""
  )}?text=Olá, tenho interesse no imóvel ${encodeURIComponent(property.title)}`;

  const LandlordContactCard = () => (
    <div className="bg-white rounded-xl shadow-lg p-5 border">
      <h2 id="locador" className="text-xl font-bold text-gray-800 mb-4">
        Fale com o Locador
      </h2>
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <User className="text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{property.landlord.name}</p>
          <a
            href={`mailto:${property.landlord.email}`}
            className="text-sm text-gray-600 hover:underline flex items-center mt-1"
          >
            <Mail size={14} className="mr-2" /> {property.landlord.email}
          </a>
        </div>
      </div>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
        <CustomButton className="w-full bg-whatsapp hover:bg-whatsapp-dark focus:ring-green-500">
          <FaWhatsapp size={20} className="mr-2" /> Contatar via WhatsApp
        </CustomButton>
      </a>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <CustomButton
          onClick={() => router.back()}
          ghost
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" /> Voltar
        </CustomButton>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Coluna Principal */}
          <main className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-5">
              <PropertyGallery
                photos={property.photos}
                altText={property.title}
              />
              <div className="mt-4">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 my-2">
                  <MapPin size={18} className="mr-2" />
                  <p>
                    {property.street}, {property.number} - {property.district},{" "}
                    {property.city} - {property.state}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-5">
              <section aria-labelledby="caracteristicas">
                <h2
                  id="caracteristicas"
                  className="text-2xl font-bold text-gray-800 mb-4"
                >
                  Características
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    {
                      icon: <Maximize />,
                      label: "Área",
                      value: `${property.areaInM2} m²`,
                    },
                    {
                      icon: <Bed />,
                      label: "Quartos",
                      value: property.numRooms,
                    },
                    {
                      icon: <Bath />,
                      label: "Banheiros",
                      value: property.numBathrooms,
                    },
                    {
                      icon: <Car />,
                      label: "Vagas",
                      value: property.numParking,
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 p-3 rounded-lg"
                      role="group"
                    >
                      <div className="text-primary mb-1 flex justify-center">
                        {item.icon}
                      </div>
                      <p className="font-bold">{item.value}</p>
                      <p className="text-sm text-gray-600">{item.label}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {property.description && (
              <div className="bg-white rounded-xl shadow-lg p-5">
                <section aria-labelledby="descricao">
                  <h2
                    id="descricao"
                    className="text-2xl font-bold text-gray-800 mb-2"
                  >
                    Descrição
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </section>
              </div>
            )}
          </main>

          {/* Coluna Lateral (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <LandlordContactCard />
            </div>
          </aside>
        </div>
      </div>

      {/* Rodapé Fixo de Contato (Mobile) */}
      <div className="lg:hidden sticky bottom-0 w-full bg-white border-t p-4 shadow-top">
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <CustomButton className="w-full bg-whatsapp hover:bg-whatsapp-dark focus:ring-green-500">
            <FaWhatsapp size={20} className="mr-2" /> Contatar via WhatsApp
          </CustomButton>
        </a>
      </div>
    </div>
  );
}
