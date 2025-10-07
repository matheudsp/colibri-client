"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";

import { ContractService } from "@/services/domains/contractService";

import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";

import { toast } from "sonner";
import { ContractCard } from "@/components/cards/ContractCard";
import type { Contract } from "@/interfaces/contract";
import { extractAxiosError } from "@/services/api";
import { EmptyCard } from "@/components/common/EmptyCard";
import PageHeader from "@/components/common/PageHeader";
import { ContractCardSkeleton } from "@/components/skeletons/ContractCardSkeleton";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const response = await ContractService.listAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        const data = response.data || [];
        const meta = response.meta?.resource;

        setContracts(data);
        setPagination({
          total: meta?.total || 0,
          page: meta?.page || 1,
          totalPages: meta?.totalPages || 1,
        });
      } catch (err) {
        console.error("Erro ao carregar contratos:", err);
        const errorMessage = extractAxiosError(err);
        toast.error("Não foi possível carregar os contratos", {
          description: errorMessage,
        });
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [currentPage]);

  if (loading) {
    return (
      <div className="min-h-svh flex flex-col  pt-8 md:pt-14 px-4 pb-24 ">
        <div className="w-full max-w-7xl ">
          <PageHeader
            className="mb-8"
            title="Meus Contratos"
            subtitle="Gerencie e visualize todos os seus contratos de aluguel."
            icon={FileText}
          />
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContractCardSkeleton />
            <ContractCardSkeleton />
            <ContractCardSkeleton />
            <ContractCardSkeleton />
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
          title="Meus Contratos"
          subtitle="Gerencie e visualize todos os seus contratos de aluguel."
          icon={FileText}
        />
        {contracts.length === 0 ? (
          <div className="w-full">
            <EmptyCard
              icon={<FileText size={48} />}
              title="Nenhum contrato encontrado"
              subtitle="Seus contratos serão listados aqui assim que forem criados."
            />
          </div>
        ) : (
          <div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                total={pagination.total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
