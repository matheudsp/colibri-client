"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2Icon, FileText } from "lucide-react";

import { ContractService } from "@/services/domains/contractService";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";

import { toast } from "sonner";
import { ContractCard } from "@/components/cards/ContractCard";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  useAuth();

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
        toast.error("Não foi possível carregar os contratos.");
        setContracts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, [currentPage]);

  if (loading) {
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
            Meus Contratos
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie e visualize todos os seus contratos de aluguel.
          </p>
        </div>

        <div className="w-full grid gap-4">
          {contracts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center mt-10 p-6 bg-white rounded-lg shadow-sm">
              <FileText size={40} className="text-gray-400" />
              <p className="text-gray-600 font-semibold">
                Nenhum contrato encontrado.
              </p>
            </div>
          ) : (
            <>
              {contracts.map((contract) => (
                <ContractCard key={contract.id} contract={contract} />
              ))}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
