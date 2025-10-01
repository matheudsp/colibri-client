"use client";

import { Roles } from "@/constants";
import { Interest } from "@/services/domains/interestService";
import { PiWarehouseFill } from "react-icons/pi";
import { User, Home, ChevronDown, ChevronUp } from "lucide-react";
import { TbKey } from "react-icons/tb";
import Image from "next/image";
interface InterestListItemProps {
  interest: Interest;
  isExpanded: boolean;
  onToggle: () => void;
  userRole?: string;
}

const interestStatusMap: Record<Interest["status"], string> = {
  PENDING: "Aguardando",
  CONTACTED: "Contatado",
  DISMISSED: "Dispensado",
};

const getStatusClasses = (status: Interest["status"]) => {
  switch (status) {
    case "CONTACTED":
      return "border-l-4 border-green-600";
    case "DISMISSED":
      return "border-l-4 border-gray-800 opacity-70";
    default:
      return "border-l-4 border-yellow-400";
  }
};

export function InterestListItem({
  interest,
  isExpanded,
  onToggle,
  userRole,
}: InterestListItemProps) {
  const photoToDisplay = interest.property.photos?.[0];
  const isLessor = userRole === Roles.LOCADOR;
  return (
    <div
      className={`bg-background border  rounded-lg transition-all duration-300 ${getStatusClasses(
        interest.status
      )}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex justify-between items-center text-left"
      >
        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 text-left">
          {isLessor ? (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                <User className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold text-primary">
                  {interest.tenant.name}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-12 w-12 bg-primary rounded-full flex items-center justify-center">
                <TbKey className="text-white" size={24} />
              </div>
              <div>
                <p className="font-semibold text-primary">
                  {interest.landlord.name}
                </p>
                <p className="text-xs text-gray-500">Locador(a)</p>
              </div>
            </div>
          )}
          <div className="hidden sm:block border-l h-8 border-border" />
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              {photoToDisplay ? (
                <Image
                  src={photoToDisplay.url}
                  alt={`Foto de ${interest.property.title}`}
                  fill
                  className="object-cover rounded-md"
                  sizes="48px"
                />
              ) : (
                <div className="h-full w-full bg-primary rounded-md flex items-center justify-center">
                  <PiWarehouseFill className="text-white" size={20} />
                </div>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500">Imóvel de Interesse</p>
              <p className="font-semibold text-sm sm:text-base text-primary">
                {interest.property.title}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-sm font-semibold text-gray-600 capitalize">
            {interestStatusMap[interest.status]}
          </span>
          {isExpanded ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>
    </div>
  );
}
