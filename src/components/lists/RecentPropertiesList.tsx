"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PropertyService,
  type PropertyResponse,
} from "@/services/domains/propertyService";

import { PropertyCardSkeleton } from "../skeletons/PropertyCardSkeleton";
import { PropertyCard } from "../cards/PropertyCard";

export function RecentPropertiesList() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      const response = await PropertyService.listAvailable({
        page: 1,
        limit: 4,
      });

      if (response && response.properties) {
        setProperties(response.properties);
      }
      setIsLoading(false);
    };

    fetchProperties();
  }, []);

  return (
    <div className="w-full py-12 px-2">
      <div className="px-4 flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-black">
          Imóveis recentes para alugar
        </h2>
        <Link
          href="/imoveis/para-alugar"
          className="text-primary hover:underline underline-offset-4 font-semibold inline-flex items-center gap-2 group text-sm"
        >
          Ver todos
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex overflow-x-auto gap-6 pl-4 pb-4">
        {isLoading ? (
          <>
            <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]">
              <PropertyCardSkeleton variant="public" />
            </div>
            <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]">
              <PropertyCardSkeleton variant="public" />
            </div>
            <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]">
              <PropertyCardSkeleton variant="public" />
            </div>
            <div className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]">
              <PropertyCardSkeleton variant="public" />
            </div>
          </>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[320px]"
            >
              <PropertyCard property={property} variant="public" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
