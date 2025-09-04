"use client";

import { useEffect, useState, useMemo, type JSX } from "react";
import { toast } from "sonner";
import { PaymentResponse } from "@/interfaces/payment";
import { PaymentStatus } from "@/constants";
import {
  PaymentService,
  PaymentFilters,
} from "@/services/domains/paymentService";
import { BankSlipService } from "@/services/domains/bankSlipService";
import {
  Loader2,
  FileText,
  CheckCircle,
  Clock,
  Filter,
  Eye,
  DownloadCloud,
  XCircle,
} from "lucide-react";
import { CustomButton } from "@/components/forms/CustomButton";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { extractAxiosError } from "@/services/api";

const statusMap: Record<
  PaymentStatus,
  { label: string; color: string; icon: JSX.Element }
> = {
  PENDENTE: {
    label: "Pendente",
    color: "border-yellow-500 bg-yellow-50 text-yellow-700",
    icon: <Clock size={14} />,
  },
  PAGO: {
    label: "Pago",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  ATRASADO: {
    label: "Atrasado",
    color: "border-red-500 bg-red-50 text-red-700",
    icon: <Clock size={14} />,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "border-gray-400 bg-gray-50 text-gray-600",
    icon: <XCircle size={14} />,
  },
  ISENTO: {
    label: "Isento",
    color: "border-blue-500 bg-blue-50 text-blue-700",
    icon: <CheckCircle size={14} />,
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "border-green-500 bg-green-50 text-green-700",
    icon: <CheckCircle size={14} />,
  },
  FALHOU: {
    label: "Falhou",
    color: "border-red-500 bg-red-50 text-red-700",
    icon: <XCircle size={14} />,
  },
};

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<PaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingSlipId, setGeneratingSlipId] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilters>({});

  const fetchPayments = async (currentFilters: PaymentFilters) => {
    try {
      setLoading(true);
      const response = await PaymentService.findUserPayments(currentFilters);
      setPayments(response.data);
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao buscar pagamentos", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(filters);
  }, [filters]);

  const handleGenerateSlip = async (paymentOrderId: string) => {
    setGeneratingSlipId(paymentOrderId);
    try {
      await BankSlipService.generate(paymentOrderId);
      toast.success("Boleto gerado com sucesso!", {
        description: "A sua lista de pagamentos foi atualizada.",
      });
      await fetchPayments(filters);
    } catch (error: unknown) {
      const errorMessage = extractAxiosError(error);
      toast.error("Falha ao gerar boleto", {
        description: errorMessage,
      });
    } finally {
      setGeneratingSlipId(null);
    }
  };

  const uniqueProperties = useMemo(() => {
    const propertyMap = new Map<string, { id: string; title: string }>();
    payments.forEach((p) => {
      if (p.contract.property?.id && p.contract.property?.title) {
        propertyMap.set(p.contract.property.id, p.contract.property);
      }
    });
    return Array.from(propertyMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [payments]);

  return (
    <div className="bg-gray-50 min-h-screen pt-24 md:pt-28 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Meus Pagamentos
            </h1>
            <p className="text-gray-500 mt-1">
              Consulte o seu histórico de faturas e gere os seus boletos.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="hidden sm:flex items-center text-gray-600 font-semibold mr-2">
              <Filter size={18} className="mr-1" /> <span>Filtrar:</span>
            </div>
            <select
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  propertyId:
                    e.target.value === "all" ? undefined : e.target.value,
                }))
              }
              className="flex-1 md:flex-initial p-2 border rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos os Imóveis</option>
              {uniqueProperties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.title}
                </option>
              ))}
            </select>
            <select
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  status:
                    e.target.value === "all"
                      ? undefined
                      : (e.target.value as PaymentStatus),
                }))
              }
              className="flex-1 md:flex-initial p-2 border rounded-md bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all">Todos os Status</option>
              {Object.entries(statusMap).map(([status, { label }]) => (
                <option key={status} value={status}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mx-auto text-gray-400" size={48} />
              <p className="mt-4 text-lg font-semibold text-gray-700">
                Nenhum pagamento encontrado
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Tente ajustar os filtros ou verifique mais tarde.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 hidden md:table-header-group">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Imóvel
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Vencimento
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Valor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 md:divide-y-0">
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="block md:table-row border-b md:border-none"
                    >
                      <td
                        data-label="Imóvel"
                        className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left text-sm font-bold text-gray-900 before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:float-left md:before:content-none"
                      >
                        {payment.contract.property?.title || "Sem título"}
                      </td>
                      <td
                        data-label="Vencimento"
                        className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left text-sm text-gray-600 before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:float-left md:before:content-none"
                      >
                        {formatDateForDisplay(payment.dueDate)}
                      </td>
                      <td
                        data-label="Valor"
                        className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left text-sm text-gray-600 before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:float-left md:before:content-none"
                      >
                        R$ {formatDecimalValue(payment.amountDue)}
                      </td>
                      <td
                        data-label="Status"
                        className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell text-right md:text-left text-sm before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:float-left md:before:content-none"
                      >
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border ${
                            statusMap[payment.status]?.color
                          }`}
                        >
                          {statusMap[payment.status]?.icon}
                          {statusMap[payment.status]?.label || payment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap block md:table-cell text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2 mt-2 md:mt-0">
                          {payment.bankSlip ? (
                            <CustomButton
                              onClick={() =>
                                window.open(
                                  payment.bankSlip.bankSlipUrl,
                                  "_blank"
                                )
                              }
                              color="bg-gray-200"
                              textColor="text-black"
                            >
                              <Eye size={16} className="mr-1" /> Visualizar
                              Boleto
                            </CustomButton>
                          ) : (
                            (payment.status === "PENDENTE" ||
                              payment.status === "ATRASADO") && (
                              <CustomButton
                                onClick={() => handleGenerateSlip(payment.id)}
                                color="bg-orange-500"
                                textColor="text-white"
                                disabled={generatingSlipId === payment.id}
                              >
                                {generatingSlipId === payment.id ? (
                                  <Loader2 className="animate-spin" size={16} />
                                ) : (
                                  <DownloadCloud size={16} className="mr-1" />
                                )}
                                Gerar Boleto
                              </CustomButton>
                            )
                          )}
                        </div>
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
