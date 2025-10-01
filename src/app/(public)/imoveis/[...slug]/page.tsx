"use client";

import {
  useEffect,
  useCallback,
  useMemo,
  useTransition,
  useDeferredValue,
} from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2Icon, Building2 } from "lucide-react";

import {
  propertySearchSchema,
  PropertySearchFormValues,
} from "@/validations/properties/propertySearchValidation";
import { PropertyService } from "@/services/domains/propertyService";
import { PropertyCard } from "@/components/cards/PropertyCard";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { FilterBar } from "@/components/forms/FilterBar";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { EmptyCard } from "@/components/common/EmptyCard";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { extractAxiosError } from "@/services/api";

const cleanupFilters = (
  filters: Partial<PropertySearchFormValues>
): Partial<PropertySearchFormValues> => {
  const cleanedFilters: Partial<PropertySearchFormValues> = {};
  for (const key in filters) {
    if (Object.prototype.hasOwnProperty.call(filters, key)) {
      const K = key as keyof PropertySearchFormValues;
      const value = filters[K];
      if (value !== "" && value !== null && value !== undefined) {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        (cleanedFilters[K] as any) = value;
      }
    }
  }
  return cleanedFilters;
};

export default function SearchResultsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();

  const currentPage = Number(searchParams.get("page")) || 1;
  const slug = (params.slug as string[]) || [];
  const transactionType = slug[0] === "a-venda" ? "VENDA" : "LOCACAO";
  const qFromQuery = searchParams.get("q") || "";
  const cityFromQuery = searchParams.get("city");
  const stateFromQuery = searchParams.get("state");
  const propertyTypeFromQuery = searchParams.get("propertyType");
  const sortFromQuery = searchParams.get("sort") || "createdAt:desc";

  const form = useForm<PropertySearchFormValues>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      q: qFromQuery,
      transactionType,
      city: cityFromQuery ?? undefined,
      state: stateFromQuery ?? undefined,
      propertyType: propertyTypeFromQuery ?? undefined,
      sort: sortFromQuery,
    },
  });
  const { reset, watch } = form;

  useEffect(() => {
    reset({
      q: qFromQuery,
      transactionType,
      city: cityFromQuery ?? undefined,
      state: stateFromQuery ?? undefined,
      propertyType: propertyTypeFromQuery ?? undefined,
      sort: sortFromQuery,
    });
  }, [
    params,
    searchParams,
    reset,
    transactionType,
    qFromQuery,
    cityFromQuery,
    stateFromQuery,
    propertyTypeFromQuery,
    sortFromQuery,
  ]);

  const qValue = watch("q");
  const deferredQ = useDeferredValue(qValue);

  const searchFilters = useMemo(() => {
    return cleanupFilters({
      q: deferredQ || undefined,
      transactionType,
      city: cityFromQuery ?? undefined,
      state: stateFromQuery ?? undefined,
      propertyType: propertyTypeFromQuery ?? undefined,
      sort: sortFromQuery,
    });
  }, [
    deferredQ,
    transactionType,
    cityFromQuery,
    stateFromQuery,
    propertyTypeFromQuery,
    sortFromQuery,
  ]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["properties", searchFilters, currentPage],
    queryFn: async () => {
      return PropertyService.publicSearch({
        ...searchFilters,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
    },
  });

  useEffect(() => {
    if (isError) {
      const _error = extractAxiosError(error);
      toast.error("Não foi possível carregar os imóveis.", {
        description: _error,
      });
    }
  }, [isError, error]);

  const properties = useMemo(
    () => response?.data?.properties ?? [],
    [response?.data?.properties]
  );
  const pagination = useMemo(
    () => ({
      total: response?.meta?.resource?.total || 0,
      page: response?.meta?.resource?.page || 1,
      totalPages: response?.meta?.resource?.totalPages || 1,
    }),
    [
      response?.meta?.resource?.total,
      response?.meta?.resource?.page,
      response?.meta?.resource?.totalPages,
    ]
  );

  const onSearch = useCallback(
    (data: PropertySearchFormValues) => {
      const { transactionType: tt, ...otherFilters } = data;
      const cleanedFilters = cleanupFilters(otherFilters);

      const transactionSlug = tt === "VENDA" ? "a-venda" : "para-alugar";
      const path = `/imoveis/${transactionSlug}`;

      const queryParams = new URLSearchParams(
        cleanedFilters as Record<string, string>
      );
      queryParams.set("page", "1");

      startTransition(() => {
        router.push(`${path}?${queryParams.toString()}`);
      });
    },
    [router, startTransition]
  );

  const renderedProperties = useMemo(() => {
    return properties.map((property) => (
      <PropertyCard key={property.id} property={property} variant="public" />
    ));
  }, [properties]);

  const displayLocation =
    qFromQuery || cityFromQuery || stateFromQuery || "Brasil";

  return (
    <div className="min-h-svh w-full bg-background pt-24 md:pt-28 px-4 pb-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          location={displayLocation}
          transactionType={transactionType}
          totalResults={pagination.total}
        />
        <div className="mb-8">
          <FilterBar
            form={form}
            onSearch={onSearch}
            loading={isFetching || isNavigating}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
          </div>
        ) : (
          <div>
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                <ErrorBoundary
                  fallback={<p>Não foi possível carregar alguns imóveis.</p>}
                >
                  {renderedProperties}
                </ErrorBoundary>
              </div>
            ) : (
              <EmptyCard
                icon={<Building2 size={40} />}
                title="Nenhum imóvel encontrado"
                subtitle=" Tente alterar os filtros da sua busca."
                className="w-full"
              />
            )}

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
