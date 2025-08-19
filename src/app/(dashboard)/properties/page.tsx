"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2Icon, Building2, Search } from "lucide-react";

import { PropertyCard } from "@/components/cards/PropertyCard";
import FabButton from "@/components/layout/FabButton";
import {
  PropertyResponse,
  PropertyService,
} from "@/services/domains/propertyService";
import { PropertyCardSkeleton } from "@/components/skeletons/PropertyCardSkeleton";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { ApiResponse, type PropertiesApiResponse } from "@/types/api";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import { Roles } from "@/constants/userRole";
import { DeletePropertyModal } from "@/components/modals/propertyModals/DeletePropertyModal";
import { useSearch } from "@/contexts/SearchContext";
export default function DashboardPropertiesPage() {
  const { searchValue } = useSearch();
  const [properties, setProperties] = useState<PropertyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const fetchProperties = useCallback(async () => {
    if (roleLoading) return;

    setLoading(true);
    try {
      let response: ApiResponse<PropertiesApiResponse>;
      if (searchValue.trim() === "") {
        response = await PropertyService.listAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });
      } else {
        const searchParams = {
          city: searchValue,
          state:
            searchValue.length === 2 ? searchValue.toUpperCase() : undefined,
          title: searchValue,
        };

        const cleanedParams = Object.fromEntries(
          Object.entries(searchParams).filter(
            ([, value]) => value !== undefined
          )
        );
        response = await PropertyService.search(cleanedParams);
      }

      // const data = response.data || [];

      // setProperties(Array.isArray(data) ? data : []);
      setProperties(
        Array.isArray(response.data.properties) ? response.data.properties : []
      );
      setPagination({
        total: response.data.meta?.resource?.total || 0,
        page: 1,
        totalPages: 1,
      });
    } catch (err) {
      console.error("Erro ao carregar propriedades:", err);
      toast.error("Não foi possível carregar as propriedades.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleLoading, searchValue]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    setLoading(true);
    try {
      await PropertyService.delete(propertyToDelete);
      toast.success("Imóvel excluído com sucesso!");

      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete));
    } catch (_error) {
      toast.error(`Erro ao excluir imóvel. ${_error}`);
    } finally {
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
      setLoading(false);
    }
  };

  const pageContent = {
    title: "Meus Imóveis",
    subtitle: "Gerencie e visualize todos os seus imóveis.",
    emptyIcon:
      role === Roles.LOCATARIO ? (
        <Search size={40} className="text-gray-400" />
      ) : (
        <Building2 size={40} className="text-gray-400" />
      ),
    emptyTitle: searchValue
      ? "Nenhum imóvel encontrado para esta busca."
      : role === Roles.LOCATARIO
      ? "Nenhum imóvel encontrado."
      : "Você ainda não cadastrou nenhum imóvel.",
    emptySubtitle:
      role === Roles.LOCATARIO
        ? "Tente uma nova busca ou alugue um imóvel."
        : "Clique no botão '+' para adicionar seu primeiro imóvel.",
  };

  if (roleLoading) {
    return (
      <div className="flex justify-center items-center h-svh w-screen">
        <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col items-center pt-24 px-4 pb-24 md:pt-28 md:px-8 md:pb-8 bg-gray-50">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {pageContent.title}
          </h1>
          <p className="text-gray-500 mt-1">{pageContent.subtitle}</p>
        </div>

        <div className="w-full grid gap-4 pb-10">
          {loading ? (
            <>
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
              <PropertyCardSkeleton />
            </>
          ) : properties.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center mt-10 p-6 bg-white rounded-lg shadow-sm">
              {pageContent.emptyIcon}
              <p className="text-gray-600 font-semibold">
                {pageContent.emptyTitle}
              </p>
              {!searchValue && (
                <p className="text-sm text-gray-500">
                  {pageContent.emptySubtitle}
                </p>
              )}
            </div>
          ) : (
            <>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  {...property}
                  onDelete={handleDeleteProperty}
                />
              ))}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </>
          )}
        </div>
      </div>

      {(role === Roles.ADMIN || role === Roles.LOCADOR) && <FabButton />}
      <DeletePropertyModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={loading}
      />
    </div>
  );
}
