"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnalyticsService } from "@/services/domains/analyticsService";
import {
  RentIncomeResponseDto,
  TenantsStatusResponseDto,
  PaymentsSummaryResponseDto,
  PropertiesOccupancyResponseDto,
} from "@/interfaces/analytics";
import { RentIncomeChart } from "@/components/charts/RentIncomeChart";
import { TenantsStatusChart } from "@/components/charts/TenantsStatusChart";
import { PropertiesOccupancyChart } from "@/components/charts/PropertiesOccupancyChart";
import { PaymentsSummary } from "@/components/cards/details/PaymentsSummary";
import { PaymentsSummarySkeleton } from "@/components/skeletons/PaymentsSummarySkeleton";
import { ChartSkeleton } from "@/components/skeletons/ChartSkeleton";
import {
  periodOptions,
  PeriodSelector,
  PeriodValue,
} from "@/components/common/PeriodSelector";
import { Tooltip } from "@/components/common/Tooltip";
import { HelpCircle } from "lucide-react";

export default function Painel() {
  const [rentIncome, setRentIncome] = useState<RentIncomeResponseDto | null>(
    null
  );
  const [tenantsStatus, setTenantsStatus] =
    useState<TenantsStatusResponseDto | null>(null);
  const [paymentsSummary, setPaymentsSummary] =
    useState<PaymentsSummaryResponseDto | null>(null);
  const [propertiesOccupancy, setPropertiesOccupancy] =
    useState<PropertiesOccupancyResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodValue>(
    periodOptions[0].value
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [
          rentIncomeData,
          tenantsStatusData,
          paymentsSummaryData,
          propertiesOccupancyData,
        ] = await Promise.all([
          AnalyticsService.getRentIncome(selectedPeriod),
          AnalyticsService.getTenantsStatus(),
          AnalyticsService.getPaymentsSummary(selectedPeriod),
          AnalyticsService.getPropertiesOccupancy(),
        ]);
        setRentIncome(rentIncomeData);
        setTenantsStatus(tenantsStatusData);
        setPaymentsSummary(paymentsSummaryData);
        setPropertiesOccupancy(propertiesOccupancyData);
      } catch (error) {
        if (error instanceof Error) {
          toast.error("Erro ao carregar dados do painel", {
            description: error.message,
          });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [selectedPeriod]);
  const selectedPeriodLabel =
    periodOptions.find((option) => option.value === selectedPeriod)?.label ||
    "";

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 ">
      <div className="w-full max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Painel de Analytics
          </h1>
          <PeriodSelector
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
        {loading ? (
          <PaymentsSummarySkeleton />
        ) : (
          paymentsSummary && (
            <PaymentsSummary
              data={{ ...paymentsSummary, period: selectedPeriodLabel }}
            />
          )
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {loading ? (
            <>
              <ChartSkeleton />
              <ChartSkeleton />
            </>
          ) : (
            <>
              {rentIncome && (
                <div className="rounded-lg border p-6 shadow-sm">
                  <div className="flex gap-2 items-center">
                    <h3 className="text-lg font-medium  leading-6 gap-1">
                      Receita de Aluguel{" "}
                      <strong className="text-base font-extralight text-zinc-700/90">
                        ({rentIncome.year})
                      </strong>
                    </h3>
                    <Tooltip
                      content={
                        "Este gráfico mostra o total de dinheiro que você recebeu com aluguéis a cada mês, ajudando a ver se sua receita está crescendo. A linha vermelha representa sua média de ganhos, mostrando quais meses foram melhores ou piores que o esperado. "
                      }
                      position="top"
                    >
                      <HelpCircle className="h-5 w-5 text-gray-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <RentIncomeChart data={rentIncome.monthlyIncome} />
                </div>
              )}

              {tenantsStatus && (
                <div className="rounded-lg border p-6 shadow-sm">
                  <h3 className="text-lg font-medium leading-6 ">
                    Resumo dos seus locatários{" "}
                    <em className="text-xs font-light text-gray-600/80">
                      (Total: {tenantsStatus.totalTenants})
                    </em>
                  </h3>
                  <TenantsStatusChart data={tenantsStatus.status} />
                </div>
              )}
            </>
          )}
        </div>

        {loading ? (
          <ChartSkeleton />
        ) : (
          propertiesOccupancy && (
            <div className="rounded-lg border p-6 shadow-sm">
              <h3 className="text-lg font-medium leading-6 ">
                Ocupação de Imóveis
              </h3>
              <PropertiesOccupancyChart data={propertiesOccupancy.types} />
            </div>
          )
        )}
      </div>
    </div>
  );
}
