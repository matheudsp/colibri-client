"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2Icon, Building2 } from "lucide-react";

import {
  propertySearchSchema,
  PropertySearchFormValues,
} from "@/validations/properties/propertySearchValidation";
import {
  PropertyService,
  PropertyResponse,
} from "@/services/domains/propertyService";
import { ApiResponse, PropertiesApiResponse } from "@/types/api";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { FilterBar } from "@/components/forms/FilterBar";
import { slugify } from "@/utils/helpers/slugify";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { capitalize } from "@/utils/helpers/capitalize";

const cleanupFilters = (
  filters: Partial<PropertySearchFormValues>
): Partial<PropertySearchFormValues> => {
  const cleanedFilters: Partial<PropertySearchFormValues> = {};
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const K = key as keyof PropertySearchFormValues;
      const value = filters[K];
      if (value !== "" && value !== null && value !== undefined) {
        (cleanedFilters[K] as unknown) = value;
      }
    }
  }
  return cleanedFilters;
};

export default function SearchResultsPage() {
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [searchQuery, setSearchQuery] = useState<{
    location: string;
    transactionType: "VENDA" | "LOCACAO";
  }>({
    location: "",
    transactionType: "LOCACAO",
  });

  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const form = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      q: "",
      transactionType: "LOCACAO",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  });
  const { reset } = form;

  const fetchProperties = useCallback(
    async (filters: Partial<PropertySearchFormValues>) => {
      setLoading(true);
      try {
        const response: ApiResponse<PropertiesApiResponse> =
          await PropertyService.publicSearch({
            ...filters,
            page: currentPage,
            limit: ITEMS_PER_PAGE,
          });
        setProperties(response.data.properties || []);
        setPagination({
          total: response.meta?.resource?.total || 0,
          page: response.meta?.resource?.page || 1,
          totalPages: response.meta?.resource?.totalPages || 1,
        });
      } catch (err) {
        toast.error("Não foi possível carregar as propriedades.", {
          description: err as string,
        });
      } finally {
        setLoading(false);
      }
    },
    [currentPage]
  );

  useEffect(() => {
    const slug = (params.slug as string[]) || [];
    const [...locationParts] = slug;

    const transactionType = slug[0] === "a-venda" ? "VENDA" : "LOCACAO";
    const qFromSlug = locationParts
      .join(" ")
      .replace(/-/g, " ")
      .replace("imoveis", "")
      .trim();

    const cityFromQuery = searchParams.get("city");
    const stateFromQuery = searchParams.get("state");

    let displayLocation = "Brasil";
    if (qFromSlug) {
      displayLocation = qFromSlug;
    } else if (cityFromQuery && stateFromQuery) {
      displayLocation = `${cityFromQuery}, ${stateFromQuery}`;
    } else if (cityFromQuery) {
      displayLocation = cityFromQuery;
    } else if (stateFromQuery) {
      displayLocation = stateFromQuery;
    }

    setSearchQuery({ location: displayLocation, transactionType });

    const filtersFromUrl: Partial<PropertySearchFormValues> = {
      q: qFromSlug,
      transactionType,
      city: cityFromQuery ?? undefined,
      state: stateFromQuery ?? undefined,
      propertyType: searchParams.get("propertyType") ?? undefined,
      sortBy:
        (searchParams.get("sortBy") as PropertySearchFormValues["sortBy"]) ??
        "createdAt",
      sortOrder:
        (searchParams.get(
          "sortOrder"
        ) as PropertySearchFormValues["sortOrder"]) ?? "desc",
    };

    reset(cleanupFilters(filtersFromUrl) as PropertySearchFormValues);
    fetchProperties(filtersFromUrl);
  }, [params, searchParams, fetchProperties, reset]);

  const onSearch = (data: PropertySearchFormValues) => {
    const { transactionType, q, sortBy, sortOrder, ...otherFilters } = data;
    const cleanedFilters = cleanupFilters(otherFilters);

    const transactionSlug =
      transactionType === "VENDA" ? "a-venda" : "para-alugar";
    const locationSlug = slugify(q || "");

    let path = `/properties/${transactionSlug}`;
    if (locationSlug) {
      path += `/${locationSlug}`;
    }

    const queryParams = new URLSearchParams();
    Object.entries(cleanedFilters).forEach(([key, value]) => {
      queryParams.set(key, String(value));
    });

    // Corrige o erro TypeScript, garantindo que os valores não são undefined
    queryParams.set("sortBy", sortBy ?? "createdAt");
    queryParams.set("sortOrder", sortOrder ?? "desc");

    queryParams.set("page", "1");
    const newUrl = `${path}?${queryParams.toString()}`;
    router.push(newUrl);
  };
  const city = capitalize(searchParams.get("city") || "");
  const state = capitalize(searchParams.get("state") || "");

  const getEmptyMessage = () => {
    if (city && state) {
      return `Nenhum imóvel encontrado em ${city}, ${state}.`;
    }
    return `Nenhum imóvel encontrado.`;
  };

  return (
    <div className="min-h-svh w-full bg-background pt-24 md:pt-28 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          location={searchQuery.location}
          transactionType={searchQuery.transactionType}
          totalResults={pagination.total}
        />
        <div className="mb-8">
          <FilterBar form={form} onSearch={onSearch} loading={loading} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
              {properties.length > 0 ? (
                properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="public"
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center gap-3 text-center mt-10 p-6 bg-white rounded-lg shadow-sm">
                  <Building2 size={40} className="text-gray-400" />
                  <p className="text-gray-600 font-semibold">
                    {getEmptyMessage()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Tente alterar os filtros da sua busca.
                  </p>
                </div>
              )}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
            />
          </div>
        )}
      </div>
    </div>
  );
}
