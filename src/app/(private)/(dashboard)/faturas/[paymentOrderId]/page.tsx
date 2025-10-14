"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Banknote,
  HelpCircle,
} from "lucide-react";

import { PaymentService } from "@/services/domains/paymentService";
import { ChargeService } from "@/services/domains/chargeService";
import { CustomButton } from "@/components/forms/CustomButton";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { PixPayment } from "@/components/common/PixPayment";
import { statusMap } from "@/constants/paymentStatusMap";
import { Charge } from "@/interfaces/charge";
import { Tooltip } from "@/components/common/Tooltip";
import { PixIcon } from "@/components/icons/PixIcon";

export default function PaymentOrderPage() {
  const router = useRouter();
  const params = useParams();
  const paymentOrderId = params.paymentOrderId as string;

  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [charge, setCharge] = useState<Charge | null>(null);

  const {
    data: payment,
    isLoading: isLoadingPayment,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paymentOrder", paymentOrderId],
    queryFn: async () => {
      const response = await PaymentService.findById(paymentOrderId);
      if (response.data.charge) {
        setCharge(response.data.charge);
      }
      return response.data;
    },
    enabled: !!paymentOrderId,
    retry: 1,
  });

  if (isError) {
    toast.error("Erro ao carregar fatura", {
      description: extractAxiosError(error),
    });
    router.back();
  }

  const handleGenerateCharge = async (billingType: "BOLETO" | "PIX") => {
    setIsLoadingAction(true);
    try {
      const response = await ChargeService.generate(
        paymentOrderId,
        billingType
      );
      setCharge(response.charge);
      toast.success(
        `${billingType === "PIX" ? "PIX" : "Boleto"} gerado com sucesso!`
      );
      await refetch();
    } catch (err) {
      toast.error(
        `Não foi possível gerar o ${billingType === "PIX" ? "PIX" : "Boleto"}.`,
        {
          description: extractAxiosError(err),
        }
      );
    } finally {
      setIsLoadingAction(false);
    }
  };

  const isPaid =
    payment && new Set(["PAGO", "RECEBIDO", "CONFIRMADO"]).has(payment.status);

  if (isLoadingPayment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Fatura não encontrada.</p>
      </div>
    );
  }

  const statusInfo = statusMap[payment.status];

  return (
    <div className="min-h-screen bg-gray-50 py-10 md:py-20">
      <div className="max-w-2xl mx-auto px-4">
        <header className="mb-6">
          <CustomButton onClick={() => router.back()} ghost>
            <ArrowLeft className="mr-2" />
            Voltar
          </CustomButton>
        </header>

        <main className="bg-white p-6 sm:p-8 rounded-xl shadow-md border border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Detalhes da Fatura
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Imóvel: {payment.contract.property.title}
              </p>
            </div>
            {statusInfo && (
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold gap-1.5 border ${statusInfo.color}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 my-6 text-sm">
            <div>
              <p className="text-gray-500">Inquilino</p>
              <p className="font-semibold text-gray-800">
                {payment.contract.tenant?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Vencimento</p>
              <p className="font-semibold text-gray-800">
                {formatDateForDisplay(payment.dueDate)}
              </p>
            </div>
          </div>

          <div className="text-center bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-primary-dark">Valor Total</p>
            <p className="text-4xl font-bold text-primary">
              R$ {formatDecimalValue(payment.amountDue)}
            </p>
          </div>

          {isPaid ? (
            <div className="text-center mt-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
              <p className="font-semibold">Pagamento confirmado!</p>
              {payment.charge?.transactionReceiptUrl && (
                <a
                  href={payment.charge.transactionReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline mt-2 inline-block"
                >
                  Visualizar comprovante
                </a>
              )}
            </div>
          ) : charge ? (
            <div className="mt-6 space-y-4">
              {charge.pixPayload && (
                <PixPayment
                  qrCodeData={charge.pixPayload}
                  qrCodeImageUrl={charge.pixQrCode}
                />
              )}
              {charge.bankSlipUrl && (
                <CustomButton
                  onClick={() => window.open(charge.bankSlipUrl, "_blank")}
                  className="w-full"
                  ghost
                >
                  <FileText className="mr-2" />
                  Visualizar Boleto
                </CustomButton>
              )}
            </div>
          ) : (
            <div className="mt-6 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <p>Escolha um método de pagamento para gerar a cobrança.</p>
                <Tooltip content="A baixa do pagamento é automática após a confirmação.">
                  <HelpCircle className="h-4 w-4 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <CustomButton
                  onClick={() => handleGenerateCharge("PIX")}
                  isLoading={isLoadingAction}
                  disabled={isLoadingAction}
                  className="w-full"
                  fontSize="text-lg"
                  color="bg-teal-500"
                  textColor="text-white"
                >
                  <PixIcon className="mr-2" width={24} height={24} />
                  Gerar PIX
                </CustomButton>
                <CustomButton
                  onClick={() => handleGenerateCharge("BOLETO")}
                  isLoading={isLoadingAction}
                  disabled={isLoadingAction}
                  className="w-full"
                  fontSize="text-lg"
                  ghost
                >
                  <Banknote className="mr-2" />
                  Gerar Boleto
                </CustomButton>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
