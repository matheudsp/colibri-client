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
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (cleanedFilters[K] as any) = value;
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
    // CORREÇÃO: Usar 'sort' como valor padrão
    defaultValues: {
      q: "",
      transactionType: "LOCACAO",
      sort: "createdAt:desc",
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
    const transactionType = slug[0] === "a-venda" ? "VENDA" : "LOCACAO";

    const qFromQuery = searchParams.get("q") || "";
    const cityFromQuery = searchParams.get("city");
    const stateFromQuery = searchParams.get("state");
    const propertyTypeFromQuery = searchParams.get("propertyType");

    // CORREÇÃO: Lê o parâmetro 'sort' da URL
    const sortFromQuery = searchParams.get("sort") || "createdAt:desc";

    const displayLocation =
      qFromQuery || cityFromQuery || stateFromQuery || "Brasil";

    setSearchQuery({ location: displayLocation, transactionType });

    const filtersFromUrl: Partial<PropertySearchFormValues> = {
      q: qFromQuery,
      transactionType,
      city: cityFromQuery ?? undefined,
      state: stateFromQuery ?? undefined,
      propertyType: propertyTypeFromQuery ?? undefined,
      sort: sortFromQuery, // CORREÇÃO: Usa o novo parâmetro 'sort'
    };

    reset(cleanupFilters(filtersFromUrl) as PropertySearchFormValues);
    fetchProperties(filtersFromUrl);
  }, [params, searchParams, fetchProperties, reset]);

  const onSearch = (data: PropertySearchFormValues) => {
    const { transactionType, q, ...otherFilters } = data;
    const cleanedFilters = cleanupFilters(otherFilters);

    if (cleanedFilters.city || cleanedFilters.state) {
      delete cleanedFilters.q;
    } else if (q) {
      cleanedFilters.q = q;
    }

    const transactionSlug =
      transactionType === "VENDA" ? "a-venda" : "para-alugar";
    const path = `/imoveis/${transactionSlug}`;

    const queryParams = new URLSearchParams(
      cleanedFilters as Record<string, string>
    );
    queryParams.set("page", "1");

    router.push(`${path}?${queryParams.toString()}`);
  };

  const getEmptyMessage = () => {
    const city = capitalize(searchParams.get("city") || "");
    const state = capitalize(searchParams.get("state") || "");
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
