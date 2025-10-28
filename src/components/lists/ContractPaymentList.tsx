"use client";

import React, { useState } from "react";

import { toast } from "sonner";
import { PaymentResponse } from "@/interfaces/payment";
import { PaymentService } from "@/services/domains/paymentService";
import { ChargeService } from "@/services/domains/chargeService";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { statusMap } from "@/constants/paymentStatusMap";
import { Loader2, FileText, SquareArrowOutUpRight } from "lucide-react";
import { EmptyCard } from "@/components/common/EmptyCard";
import { RegisterPaymentModal } from "@/components/modals/paymentModals/RegisterPaymentModal";
import { PaymentActionsDropdown } from "../dropdownMenus/PaymentActionsDropdown";
import { WildcardPaymentButton } from "../common/WildcardPaymentButton";
import { CustomButton } from "../forms/CustomButton";
import Link from "next/link";

interface Props {
  payments: PaymentResponse[];
  loading?: boolean;
  onRefresh?: () => Promise<void>;
  onOpenUrl?: (url: string) => void;
}

export function ContractPaymentList({
  payments,
  loading = false,
  onRefresh,
  onOpenUrl,
}: Props) {
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [showRegisterPaymentModal, setShowRegisterPaymentModal] =
    useState<boolean>(false);

  const openUrl = (url: string) => {
    if (!url) return;
    if (onOpenUrl) {
      try {
        onOpenUrl(url);
        return;
      } catch {
        // Fallback para window.open
      }
    }
    window.open(url, "_blank");
  };

  const handleGenerateSlip = async (paymentOrderId: string) => {
    setIsActionLoading(true);
    try {
      await ChargeService.generate(paymentOrderId);
      toast.success("Boleto gerado com sucesso!");
      if (onRefresh) await onRefresh();
    } catch (error: unknown) {
      const message = extractAxiosError(error);
      toast.error("Falha ao gerar boleto", { description: message });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedPaymentId) return;

    setIsActionLoading(true);
    try {
      await PaymentService.confirmCashPayment(selectedPaymentId, {});
      toast.success("Pagamento registrado com sucesso!");
      setShowRegisterPaymentModal(false);
      if (onRefresh) await onRefresh();
    } catch (_error) {
      const errorMessage = extractAxiosError(_error);
      toast.error("Não foi possível registrar o pagamento", {
        description: errorMessage,
      });
    } finally {
      setIsActionLoading(false);
      setSelectedPaymentId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <EmptyCard
        icon={<FileText size={48} />}
        title="Nenhuma fatura encontrada"
        subtitle="Ainda não há faturas geradas para este contrato."
      />
    );
  }

  return (
    <div className="w-full max-h-[400px] overflow-y-auto border border-border rounded-lg shadow-sm">
      <div className="md:hidden divide-y divide-border">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-gradient-to-t from-card/40 to-card  p-4  space-y-4 transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Vencimento</p>
                <p className="text-xl font-bold text-gray-800">
                  {formatDateForDisplay(payment.dueDate)}
                </p>
              </div>
              <PaymentActionsDropdown
                payment={payment}
                loading={isActionLoading}
                onOpenUrl={openUrl}
                onGenerateSlip={handleGenerateSlip}
                onRegister={(id) => {
                  setSelectedPaymentId(id);
                  setShowRegisterPaymentModal(true);
                }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500 ">Valor</p>{" "}
                <p className="text-base font-medium text-gray-700">
                  R$ {formatDecimalValue(payment.amountDue)}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold gap-1.5 border ${
                  statusMap[payment.status]?.color
                }`}
              >
                {statusMap[payment.status]?.icon}
                {statusMap[payment.status]?.label || payment.status}
              </span>
            </div>

            <WildcardPaymentButton
              payment={payment}
              loading={isActionLoading}
              onOpenUrl={openUrl}
              onGenerateSlip={handleGenerateSlip}
            />
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto ">
        <table className="min-w-full">
          <thead className="border-b border-border bg-gradient-to-t from-card/40 to-card">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vencimento
                <p className="text-xs font-medium text-gray-500"></p>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDateForDisplay(payment.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  R$ {formatDecimalValue(payment.amountDue)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1.5 border ${
                      statusMap[payment.status]?.color
                    }`}
                  >
                    {statusMap[payment.status]?.icon}
                    {statusMap[payment.status]?.label || payment.status}
                  </span>
                </td>

                <td className="px-6 py-4 items-center flex justify-center whitespace-nowrap text-right text-sm font-medium gap-2">
                  <Link target="_blank" href={`/faturas/${payment.id}`}>
                    <CustomButton
                      aria-label="Abrir página da fatura"
                      title="Abrir página da fatura"
                      ghost
                      className="h-9 w-9 p-2"
                      icon={<SquareArrowOutUpRight className="" size={16} />}
                    />
                  </Link>
                  <PaymentActionsDropdown
                    payment={payment}
                    loading={isActionLoading}
                    onOpenUrl={openUrl}
                    onGenerateSlip={handleGenerateSlip}
                    onRegister={(id) => {
                      setSelectedPaymentId(id);
                      setShowRegisterPaymentModal(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RegisterPaymentModal
        isOpen={showRegisterPaymentModal}
        onClose={() => {
          setShowRegisterPaymentModal(false);
          setSelectedPaymentId(null);
        }}
        onConfirm={handleRegisterPayment}
        isLoading={isActionLoading}
      />
    </div>
  );
}
