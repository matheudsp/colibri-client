"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize,
  FilePlus2,
  Trash2,
  Home,
  Eye,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  MoveHorizontal,
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
import { getPropertyTypeLabel } from "@/utils/helpers/getPropertyType";

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

  const handleCreateContract = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/imovel/${property.id}/criar-contrato`);
  };

  const handleNavigate = () => {
    router.push(`/imovel/${property.id}`);
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
    return <div className="mt-4 pt-4 border-t h-[230px]"></div>;
  }

  const showAdminButtons = role === Roles.ADMIN || role === Roles.LOCADOR;

  if (!showAdminButtons) return null;

  return (
    <div className="mt-2 pt-2 border-t space-y-3">
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  const minSwipeDistance = 50;

  useEffect(() => {
    const hintShownKey = `swipeHintShown_${property.id}`;
    const hintHasBeenShown = sessionStorage.getItem(hintShownKey);

    if (property.photos.length > 1 && !hintHasBeenShown) {
      const timer = setTimeout(() => {
        setShowSwipeHint(true);
        sessionStorage.setItem(hintShownKey, "true");
      }, 1500); // Mostra a dica após 1.5s
      return () => clearTimeout(timer);
    }
  }, [property.id, property.photos.length]);

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (property.photos.length > 1) {
      setCurrentImage((prev) => (prev + 1) % property.photos.length);
    }
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (property.photos.length > 1) {
      setCurrentImage(
        (prev) => (prev - 1 + property.photos.length) % property.photos.length
      );
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  const cardContent = (
    <div className=" overflow-hidden transition-all duration-300 flex flex-col h-full group">
      <div
        className="relative w-full aspect-3/2"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {property.photos && property.photos.length > 0 ? (
          <Image
            src={property.photos[currentImage].url}
            alt={`Foto de ${property.title}`}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex rounded-md items-center justify-center">
            <Home className="w-16 h-16 text-gray-400" />
          </div>
        )}

        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: [0, 1, 1, 0], x: -40 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1],
              }}
              onAnimationComplete={() => setShowSwipeHint(false)}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-black/60 backdrop-blur-xs p-3 rounded-full">
                <MoveHorizontal className="text-white" size={24} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {property.photos && property.photos.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-white z-20"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full shadow-md transition-opacity opacity-70 hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-white z-20"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 z-20">
              <ImageIcon size={14} />
              <span>
                {currentImage + 1} / {property.photos.length}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="p-2 flex flex-col grow">
        <p className="text-sm text-primary font-semibold">
          {getPropertyTypeLabel(property.propertyType)}
        </p>
        <h3 className="text-lg font-bold text-gray-800 truncate mt-1">
          {property.title}
        </h3>
        <p className="text-sm text-gray-500 truncate">
          {property.street}, {property.number} - {property.district}
        </p>
        <p className="text-sm text-gray-500 truncate">
          {property.city} - {property.state}
        </p>
        <div className="grow">
          {variant === "public" && (
            <div className="grid grid-cols-2 sm:grid-cols-2 font-medium gap-x-4 gap-y-2 text-sm text-gray-600 my-1 border-t border-b py-3">
              <span className="flex items-center gap-2 ">
                <Maximize
                  className="text-white bg-primary p-1 rotate-45 rounded-lg"
                  size={20}
                />
                <strong>{property.areaInM2} m²</strong>
              </span>
              <span className="flex items-center gap-2">
                <Bed
                  className="text-white bg-primary p-1 rounded-lg"
                  size={20}
                />
                <strong>{property.numRooms} Quartos</strong>
              </span>
              <span className="flex items-center gap-2">
                <Bath
                  className="text-white bg-primary p-1 rounded-lg"
                  size={20}
                />
                <strong>{property.numBathrooms} Banheiros</strong>
              </span>
            </div>
          )}
          <div className="mt-1 flex justify-between items-center">
            <span className="text-gray-500 text-sm">Aluguel</span>
            <span className="font-bold text-gray-800 text-base">
              {formatCurrency(property.value)}
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
      <Link href={`/imovel/${property.id}`} className="block group h-full">
        {cardContent}
      </Link>
    );
  }

  return <div className="block h-full">{cardContent}</div>;
}
