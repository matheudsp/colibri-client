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
    <div className="w-full py-12 px-4 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Imóveis recentes para alugar
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <>
            <PropertyCardSkeleton variant="public" />
            <PropertyCardSkeleton variant="public" />
            <PropertyCardSkeleton variant="public" />
            <PropertyCardSkeleton variant="public" />
          </>
        ) : (
          properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              variant="public"
            />
          ))
        )}
      </div>

      {!isLoading && properties.length > 0 && (
        <div className="mt-8 text-center">
          <Link
            href="/imoveis"
            className="text-primary hover:underline underline-offset-4 font-semibold inline-flex items-center gap-2 group"
          >
            Ver mais imóveis para alugar
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  );
}
