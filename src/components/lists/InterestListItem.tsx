"use client";

import React from "react";
import Image from "next/image";
import { Roles } from "@/constants";
import { Interest } from "@/services/domains/interestService";
import { PiWarehouseFill } from "react-icons/pi";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { TbKey } from "react-icons/tb";

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
      return {
        accent: "bg-green-600",
        badge: "bg-green-200 text-green-700",
      };
    case "DISMISSED":
      return {
        accent: "bg-gray-800",
        badge: "bg-neutral-900 text-neutral-100",
      };
    default:
      return {
        accent: "bg-yellow-400",
        badge: "bg-yellow-200 text-yellow-700",
      };
  }
};

export function InterestListItem({
  interest,
  isExpanded,
  onToggle,
  userRole,
}: InterestListItemProps) {
  const photoToDisplay = interest.property?.photos?.[0];
  const isLessor = userRole === Roles.LOCADOR;
  const status = interest.status ?? "PENDING";
  const statusClasses = getStatusClasses(status);

  return (
    <article
      className="group bg-background border border-border rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md"
      aria-labelledby={`interest-${interest.id}-label`}
    >
      <div className="flex">
        <div aria-hidden className={`w-1 ${statusClasses.accent}`} />

        <button
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="flex-1 p-4 flex items-center gap-4 text-left hover:bg-background-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              {isLessor ? (
                <User className="text-white" size={20} />
              ) : (
                <TbKey className="text-white" size={20} />
              )}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-sm text-primary truncate">
                {isLessor
                  ? interest.tenant?.name ?? "-"
                  : interest.landlord?.name ?? "-"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isLessor ? "Inquilino(a)" : "Locador(a)"}
              </p>
            </div>
          </div>

          <div className="hidden sm:block border-l h-8 border-border mx-3" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
              {photoToDisplay?.url ? (
                <Image
                  src={photoToDisplay.url}
                  alt={interest.property?.title ?? "Imóvel"}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <PiWarehouseFill size={18} className="text-white/90" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Imóvel de interesse</p>
              <h3
                id={`interest-${interest.id}-label`}
                className="font-semibold text-sm sm:text-base text-primary truncate"
              >
                {interest.property?.title ?? "-"}
              </h3>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <span
              className={`hidden md:inline-flex text-sm font-semibold px-3 py-1 rounded-full ${statusClasses.badge}`}
            >
              {interestStatusMap[status]}
            </span>

            <span className="sr-only">
              {isExpanded ? "Fechar detalhes" : "Abrir detalhes"}
            </span>
            {isExpanded ? <ChevronUp /> : <ChevronDown />}
          </div>
        </button>
      </div>
    </article>
  );
}
