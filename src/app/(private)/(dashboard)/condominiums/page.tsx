"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2Icon, Building2 } from "lucide-react";

import {
  Condominium,
  CondominiumService,
} from "@/services/domains/condominiumService";
import { useAuth } from "@/hooks/useAuth";
import { Pagination } from "@/components/layout/Pagination";
import { ITEMS_PER_PAGE } from "@/constants/pagination";
import { toast } from "sonner";
import { CondominiumCard } from "@/components/cards/CondominiumCard";
import FabButton from "@/components/layout/FabButton";
import { extractAxiosError } from "@/services/api";

export default function CondominiumsPage() {
  const [condominiums, setCondominiums] = useState<Condominium[]>([]);
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
    const fetchCondominiums = async () => {
      setLoading(true);
      try {
        const response = await CondominiumService.listAll({
          page: currentPage,
          limit: ITEMS_PER_PAGE,
        });

        const data = response.data || [];
        const meta = response.meta?.resource;

        setCondominiums(Array.isArray(data) ? data : []);
        setPagination({
          total: meta?.total || 0,
          page: meta?.page || 1,
          totalPages: meta?.totalPages || 1,
        });
      } catch (err) {
        const errorMessage = extractAxiosError(err);
        toast.error("Não foi possível carregar os condomínios", {
          description: errorMessage,
        });
        setCondominiums([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCondominiums();
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
            Meus Condomínios
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie e visualize todos os seus condomínios cadastrados.
          </p>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          {condominiums.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 text-center mt-10 p-6 bg-white rounded-lg shadow-sm">
              <Building2 size={40} className="text-gray-400" />
              <p className="text-gray-600 font-semibold">
                Nenhum condomínio encontrado.
              </p>
              <p className="text-sm text-gray-500">
                {'Clique no botão "+" para adicionar seu primeiro condomínio.'}
              </p>
            </div>
          ) : (
            <>
              {condominiums.map((condo) => (
                <CondominiumCard key={condo.id} condominium={condo} />
              ))}
              <div className="col-span-full mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <FabButton />
    </div>
  );
}
