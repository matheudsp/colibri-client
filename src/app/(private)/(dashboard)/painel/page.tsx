"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

import { PaymentService } from "@/services/domains/paymentService";
import { PaymentResponse } from "@/interfaces/payment";
import { extractAxiosError } from "@/services/api";
import { aggregateByProperty } from "@/utils/formatters/paymentAggregator";
import { PaymentsByPropertyChart } from "@/components/charts/PaymentsByPropertyChart";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { EmptyCard } from "@/components/common/EmptyCard";

export default function PainelPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await PaymentService.findUserPayments();
        setPayments(response.data);
      } catch (error) {
        toast.error("Falha ao buscar os dados para o painel", {
          description: extractAxiosError(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const aggregatedData = aggregateByProperty(payments);

  return (
    <div className="min-h-svh flex flex-col items-center pt-8 md:pt-14 px-4 pb-24 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Painel de Controle
          </h1>
          <p className="text-gray-500 mt-1">
            Resumo financeiro dos seus contratos.
          </p>
        </header>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Receitas por Imóvel e Status
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <PaymentsByPropertyChart data={aggregatedData} />
          )}
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Detalhes de Todos os Pagamentos
          </h2>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : payments.length === 0 ? (
            <EmptyCard
              icon={<FileText size={48} />}
              title="Nenhum pagamento encontrado"
              subtitle="Não há faturas para exibir no momento."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Imóvel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Inquilino
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vencimento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white z-50 divide-y divide-gray-200">
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {p.contract.property.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.contract.tenant?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateForDisplay(p.dueDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        R$ {formatDecimalValue(p.amountDue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {p.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
