"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PropertyResponse } from "@/services/domains/propertyService";

import { PropertyCardSkeleton } from "../skeletons/PropertyCardSkeleton";
import { PropertyCard } from "../cards/PropertyCard";

import notFoundAnimation from "../../../public/lottie/not-found-animation.json";

import dynamic from "next/dynamic";

const LottieAnimation = dynamic(
  () =>
    import("@/components/common/LottieAnimation").then(
      (mod) => mod.LottieAnimation
    ),
  { ssr: false }
);
interface PropertiesListProps {
  title: string;
  properties: PropertyResponse[];
  isLoading: boolean;
  viewAllLink?: string;
}

export function PropertiesList({
  title,
  properties,
  isLoading,
  viewAllLink,
}: PropertiesListProps) {
  return (
    <div className="w-full py-12 px-2">
      <div className="px-4 flex justify-between items-center mb-8 gap-1">
        <h2 className="text-3xl font-bold text-black">{title}</h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-primary hover:underline underline-offset-4 font-semibold inline-flex items-center gap-2 group text-sm"
          >
            Ver todos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="flex overflow-x-auto gap-6 pl-4 pb-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]"
            >
              <PropertyCardSkeleton variant="public" />
            </div>
          ))
        ) : properties.length > 0 ? (
          properties.map((property) => (
            <div
              key={property.id}
              className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]"
            >
              <PropertyCard property={property} variant="public" />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center w-full min-h-[200px] text-center text-gray-500 bg-background rounded-lg">
            <LottieAnimation
              animationData={notFoundAnimation}
              className="w-24 h-24"
            />
            <h3 className="text-base font-semibold text-gray-700 ">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-sm ">
              Parece que não há imóveis disponíveis nesta categoria.
            </p>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white border border-primary-hover border-b-primary-hover border-b-4  transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Ver todos os imóveis
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
