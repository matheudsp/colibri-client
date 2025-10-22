"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, Search, HomeIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { PropertyCard } from "@/components/cards/PropertyCard";
import FabButton from "@/components/layout/FabButton";
import {
  // PropertyResponse,
  PropertyService,
} from "@/services/domains/propertyService";
import { PropertyCardSkeleton } from "@/components/skeletons/PropertyCardSkeleton";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { ApiResponse, type PropertiesApiResponse } from "@/types/api";
import { toast } from "sonner";

import { Roles } from "@/constants/userRole";
import { useSearch } from "@/contexts/SearchContext";
import { extractAxiosError } from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import { VerificationService } from "@/services/domains/verificationService";
import { OtpVerificationModal } from "@/components/modals/verificationModals/OtpVerificationModal";
import { VerificationContexts } from "../../../../constants/verification-contexts";
import { EmptyCard } from "@/components/common/EmptyCard";
import PageHeader from "@/components/common/PageHeader";

export default function DashboardPropertiesPage() {
  const { searchValue } = useSearch();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const { user, loading: roleLoading } = useUserStore();
  const role = user?.role;

  const propertiesQueryKey = ["properties", currentPage, searchValue];

  const {
    data: response,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: propertiesQueryKey,
    queryFn: async (): Promise<ApiResponse<PropertiesApiResponse>> => {
      let responseData: ApiResponse<PropertiesApiResponse>;
      if (searchValue.trim() === "") {
        responseData = await PropertyService.listAll({
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
        responseData = await PropertyService.search(cleanedParams);
      }
      return responseData;
    },
    enabled: !roleLoading,
  });

  const properties = response?.data.properties || [];
  const pagination = {
    total: response?.meta?.resource?.total || 0,
    page: response?.meta?.resource?.page || 1,
    totalPages: response?.meta?.resource?.totalPages || 1,
  };

  const handleDeleteProperty = (id: string) => {
    setPropertyToDelete(id);
    setIsOtpModalOpen(true);
  };

  const confirmDeleteWithOtp = async (otp: string) => {
    if (!propertyToDelete) return;

    const promise = async () => {
      const verificationResponse = await VerificationService.confirm(
        VerificationContexts.DELETE_PROPERTY,
        otp
      );
      if (verificationResponse.data.actionToken) {
        await PropertyService.delete(
          propertyToDelete,
          verificationResponse.data.actionToken
        );
        await refetch();
      } else {
        throw new Error("Token de ação inválido.");
      }
    };

    toast.promise(promise(), {
      loading: "Excluindo imóvel...",
      success: "Imóvel excluído com sucesso!",
      error: (err) => `Falha na exclusão: ${extractAxiosError(err)}`,
    });

    setIsOtpModalOpen(false);
    setPropertyToDelete(null);
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

  const handleAvailabilityUpdate = () => {
    refetch();
  };

  const handlePropertyUpdate = () => {
    refetch();
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-svh  flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 ">
        <div className="w-full max-w-7xl mx-auto">
          <PageHeader
            className="mb-8"
            title={pageContent.title}
            subtitle={pageContent.subtitle}
            icon={HomeIcon}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
            <PropertyCardSkeleton variant="dashboard" />
            <PropertyCardSkeleton variant="dashboard" />
            <PropertyCardSkeleton variant="dashboard" />
            <PropertyCardSkeleton variant="dashboard" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 ">
      <div className="w-full max-w-7xl mx-auto">
        <PageHeader
          className="mb-8"
          title={pageContent.title}
          subtitle={pageContent.subtitle}
          icon={HomeIcon}
        />
        <div className="w-full grid gap-4 pb-10">
          {properties.length === 0 ? (
            <EmptyCard
              icon={pageContent.emptyIcon}
              title={pageContent.emptyTitle}
              subtitle={pageContent.emptySubtitle}
              className="border"
            />
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    variant="dashboard"
                    onDelete={handleDeleteProperty}
                    onAvailabilityChange={handleAvailabilityUpdate}
                    onUpdate={handlePropertyUpdate}
                  />
                ))}
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
      {(role === Roles.ADMIN || role === Roles.LOCADOR) && <FabButton />}

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        onConfirm={confirmDeleteWithOtp}
        onResendOtp={() =>
          VerificationService.request(VerificationContexts.DELETE_PROPERTY)
        }
        isLoading={loading}
        title="Confirmar Exclusão de Imóvel"
        description="Para sua segurança, por favor, insira o código de 6 dígitos enviado para o seu e-mail."
        actionText="Excluir Imóvel"
      />
    </div>
  );
}
