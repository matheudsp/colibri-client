"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize,
  FilePlus2,
  Edit,
  Trash2,
  Home,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { PropertyService } from "@/services/domains/propertyService";
import { type PropertyProps } from "@/interfaces/property";
import { formatCurrency } from "@/utils/masks/maskCurrency";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Roles } from "@/constants/userRole";
import { CustomButton } from "@/components/forms/CustomButton";
import { extractAxiosError } from "@/services/api";
import { CustomSwitch } from "../forms/CustomSwitch";

function DashboardActions({
  property,
  onDelete,
  onAvailabilityChange,
}: {
  property: PropertyProps;
  onDelete?: (id: string) => void;
  onAvailabilityChange?: (id: string, newStatus: boolean) => void;
}) {
  const router = useRouter();
  const { role, loading: roleLoading } = useCurrentUser();
  const [isAvailable, setIsAvailable] = useState(property.isAvailable);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsAvailable(property.isAvailable);
  }, [property.isAvailable]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onDelete) onDelete(property.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/properties/edit/${property.id}`);
  };

  const handleCreateContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/properties/${property.id}/create-contract`);
  };

  const handleNavigate = () => {
    router.push(`/properties/${property.id}`);
  };

  const handleAvailabilityChange = async (newStatus: boolean) => {
    setIsUpdating(true);
    setIsAvailable(newStatus);
    try {
      await PropertyService.update(property.id, { isAvailable: newStatus });
      toast.success(
        `Imóvel marcado como ${newStatus ? "disponível" : "indisponível"}.`
      );
      onAvailabilityChange?.(property.id, newStatus);
    } catch (error) {
      setIsAvailable(!newStatus);
      toast.error("Falha ao atualizar status", {
        description: extractAxiosError(error),
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (roleLoading) {
    return <div className="mt-4 pt-4 border-t h-[230px]"></div>; // Placeholder para evitar "layout shift"
  }

  const showAdminButtons = role === Roles.ADMIN || role === Roles.LOCADOR;

  if (!showAdminButtons) return null;

  return (
    <div className="mt-4 pt-4 border-t space-y-3">
      <CustomSwitch
        label="Disponível"
        tip="Ative para que o imóvel apareça nas buscas públicas. Desative para ocultá-lo."
        checked={isAvailable}
        onChange={handleAvailabilityChange}
        isLoading={isUpdating}
        disabled={isUpdating}
      />
      <CustomButton
        onClick={handleNavigate}
        icon={<Eye size={16} />}
        color="bg-gray-200"
        textColor="text-gray-800"
        className="w-full text-sm"
      >
        Ver Detalhes
      </CustomButton>
      <CustomButton
        onClick={handleCreateContract}
        icon={<FilePlus2 size={16} />}
        color="bg-primary"
        textColor="text-white"
        className="w-full text-sm"
      >
        Criar Contrato
      </CustomButton>
      <CustomButton
        onClick={handleEdit}
        icon={<Edit size={16} />}
        color="bg-blue-100"
        textColor="text-blue-800"
        className="w-full text-sm"
      >
        Editar
      </CustomButton>
      <CustomButton
        onClick={handleDelete}
        icon={<Trash2 size={16} />}
        color="bg-red-100"
        textColor="text-red-800"
        className="w-full text-sm"
      >
        Excluir
      </CustomButton>
    </div>
  );
}
export function PropertyCard({
  property,
  variant = "dashboard",
  onDelete,
  onAvailabilityChange,
}: {
  property: PropertyProps;
  variant?: "dashboard" | "public";
  onDelete?: (id: string) => void;
  onAvailabilityChange?: (id: string, newStatus: boolean) => void;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage((prev) => (prev + 1) % property.photos.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImage(
      (prev) => (prev - 1 + property.photos.length) % property.photos.length
    );
  };

  const cardContent = (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden transition-all duration-300 shadow-md flex flex-col h-full">
      <div className="relative w-full aspect-[4/3]">
        {property.photos && property.photos.length > 0 ? (
          <Image
            src={property.photos[currentImage].signedUrl}
            alt={`Foto de ${property.title}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {property.photos && property.photos.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Imagem anterior"
            >
              &larr;
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1.5 rounded-full shadow cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Próxima imagem"
            >
              &rarr;
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
              {property.photos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentImage === index ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
        {/* {variant === "public" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                alert("Funcionalidade a ser implementada!");
              }}
              className="absolute top-3 right-3 bg-white/80 p-2 rounded-full cursor-pointer hover:bg-white"
              aria-label="Favoritar imóvel"
            >
              <Heart className="w-5 h-5 text-gray-700" />
            </button>
          )} */}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        {variant === "public" && (
          <p className="text-sm text-primary font-semibold">Apartamento</p>
        )}

        <h3 className="text-lg font-bold text-gray-800 truncate mt-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">{property.district}</p>
        <p className="text-sm text-gray-500 truncate">
          {property.city} - {property.state}
        </p>

        <div className="flex-grow">
          {variant === "public" && (
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 mt-3 border-b pb-3">
              <span className="flex items-center gap-1">
                <Maximize size={16} /> <strong>{property.areaInM2}</strong> m²
              </span>
              <span className="flex items-center gap-1">
                <Bed size={16} />
                <strong> {property.numRooms}</strong>Quartos
              </span>
              <span className="flex items-center gap-1">
                <Bath size={16} /> <strong>{property.numBathrooms}</strong>
                Banheiros
              </span>
            </div>
          )}
          <div className="mt-3 flex justify-between items-center">
            <span className="text-gray-500 text-sm">Aluguel</span>
            <span className="font-bold text-gray-800">
              {formatCurrency(property.rentValue)}
            </span>
          </div>
        </div>
        {variant === "dashboard" && (
          <DashboardActions
            property={property}
            onDelete={onDelete}
            onAvailabilityChange={onAvailabilityChange}
          />
        )}
      </div>
    </div>
  );

  if (variant === "public") {
    return (
      <Link href={`/properties/${property.id}`} className="block group h-full">
        {cardContent}
      </Link>
    );
  }

  // Para a variante dashboard, ele não é um link, apenas um container
  return <div className="block h-full">{cardContent}</div>;
}
