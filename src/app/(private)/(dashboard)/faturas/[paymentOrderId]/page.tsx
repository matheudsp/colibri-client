"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, ArrowLeft, HelpCircle, Hash } from "lucide-react";

import { PaymentService } from "@/services/domains/paymentService";
import {
  ChargeService,
  PixQrCodeResponse,
  IdentificationFieldResponse,
} from "@/services/domains/chargeService";
import { CustomButton } from "@/components/forms/CustomButton";
import { extractAxiosError } from "@/services/api";
import { formatDateForDisplay } from "@/utils/formatters/formatDate";
import { formatDecimalValue } from "@/utils/formatters/formatDecimal";
import { PixPaymentDisplay } from "@/components/financial/PixPaymentDisplay";
import { BoletoPaymentDisplay } from "@/components/financial/BoletoPaymentDisplay";
import { statusMap } from "@/constants/paymentStatusMap";
import { Tooltip } from "@/components/common/Tooltip";
import { PixIcon } from "@/components/icons/PixIcon";
import { CiBarcode } from "react-icons/ci";

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium text-gray-800">{value}</span>
  </div>
);

export default function PaymentOrderPage() {
  const router = useRouter();
  const params = useParams();
  const paymentOrderId = params.paymentOrderId as string;

  const [isLoadingAction, setIsLoadingAction] = useState<
    "PIX" | "BOLETO" | "CHARGE" | null
  >(null);
  const [view, setView] = useState<"PIX" | "BOLETO" | null>(null);
  const [pixData, setPixData] = useState<PixQrCodeResponse | null>(null);
  const [boletoData, setBoletoData] =
    useState<IdentificationFieldResponse | null>(null);

  const {
    data: payment,
    isLoading: isLoadingPayment,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paymentOrder", paymentOrderId],
    queryFn: async () =>
      PaymentService.findById(paymentOrderId).then((res) => res.data),
    enabled: !!paymentOrderId,
    retry: 1,
  });

  if (isError) {
    toast.error("Erro ao carregar fatura", {
      description: extractAxiosError(error),
    });
    router.back();
  }

  // --- Funções de Ação (sem alterações na lógica) ---
  const handleGenerateCharge = async () => {
    setIsLoadingAction("CHARGE");
    try {
      await ChargeService.generate(paymentOrderId, "BOLETO");
      toast.success("Opções de pagamento geradas!");
      await refetch();
    } catch (err) {
      toast.error("Não foi possível gerar as opções de pagamento.", {
        description: extractAxiosError(err),
      });
    } finally {
      setIsLoadingAction(null);
    }
  };

  const handleShowPix = async () => {
    setIsLoadingAction("PIX");
    try {
      const response = await ChargeService.getPixQrCode(paymentOrderId);
      setPixData(response.data);
      setView("PIX");
    } catch (err) {
      toast.error("Não foi possível obter os dados do PIX.", {
        description: extractAxiosError(err),
      });
    } finally {
      setIsLoadingAction(null);
    }
  };

  const handleShowBoleto = async () => {
    setIsLoadingAction("BOLETO");
    try {
      const response = await ChargeService.getBoletoIdentificationField(
        paymentOrderId
      );
      setBoletoData(response.data);
      setView("BOLETO");
    } catch (err) {
      toast.error("Não foi possível obter a linha digitável.", {
        description: extractAxiosError(err),
      });
    } finally {
      setIsLoadingAction(null);
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

  const PaymentActions = () => {
    // A lógica interna deste componente permanece a mesma que você já tinha.
    if (isPaid) {
      return (
        <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
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
      );
    }

    if (!payment.charge) {
      return (
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Clique abaixo para gerar as opções de pagamento.
          </p>
          <CustomButton
            onClick={handleGenerateCharge}
            isLoading={isLoadingAction === "CHARGE"}
            disabled={!!isLoadingAction}
            className="w-full"
            fontSize="text-lg"
          >
            <CiBarcode className="mr-2" />
            Ver Opções de Pagamento
          </CustomButton>
        </div>
      );
    }

    if (view === "PIX" && pixData) {
      return (
        <PixPaymentDisplay
          payload={pixData.payload}
          encodedImage={pixData.encodedImage}
        />
      );
    }

    if (view === "BOLETO" && boletoData && payment.charge.bankSlipUrl) {
      return (
        <BoletoPaymentDisplay
          identificationField={boletoData.identificationField}
          bankSlipUrl={payment.charge.bankSlipUrl}
        />
      );
    }

    return (
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <p>Escolha um método de pagamento.</p>
          <Tooltip content="A baixa do pagamento é automática. Você pode alternar entre os métodos.">
            <HelpCircle className="h-4 w-4 cursor-help" />
          </Tooltip>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <CustomButton
            onClick={handleShowPix}
            isLoading={isLoadingAction === "PIX"}
            disabled={!!isLoadingAction}
            className="w-full"
            fontSize="text-lg"
            color="bg-teal-500"
            textColor="text-white"
            icon={<PixIcon color="#FFFFFF" width={20} height={20} />}
          >
            Pagar com PIX
          </CustomButton>
          <CustomButton
            onClick={handleShowBoleto}
            isLoading={isLoadingAction === "BOLETO"}
            disabled={!!isLoadingAction}
            className="w-full"
            fontSize="text-lg"
            ghost
            icon={<CiBarcode size={20} />}
          >
            Pagar com Boleto
          </CustomButton>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background py-10 md:py-20">
      <div className="max-w-2xl mx-auto px-4">
        <header className="mb-6">
          <CustomButton
            onClick={() => (view ? setView(null) : router.back())}
            ghost
          >
            <ArrowLeft className="mr-2" />
            {view ? "Escolher outro método" : "Voltar"}
          </CustomButton>
        </header>

        <main className="bg-white p-6 sm:p-8 rounded-xl border border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {payment.isSecurityDeposit
                  ? "Pagamento da Garantia"
                  : "Fatura de Aluguel"}
              </h1>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <Hash size={14} />
                {payment.id}
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

          <div className="my-6 space-y-2">
            <h2 className="text-base font-semibold text-gray-700 mb-2">
              Resumo da Cobrança
            </h2>

            {!payment.isSecurityDeposit && (
              <>
                {payment.contract.rentAmount &&
                  parseFloat(payment.contract.rentAmount) > 0 && (
                    <DetailItem
                      label="Aluguel"
                      value={`R$ ${formatDecimalValue(
                        payment.contract.rentAmount
                      )}`}
                    />
                  )}
                {payment.contract.condoFee &&
                  parseFloat(payment.contract.condoFee) > 0 && (
                    <DetailItem
                      label="Condomínio"
                      value={`R$ ${formatDecimalValue(
                        payment.contract.condoFee
                      )}`}
                    />
                  )}
                {payment.contract.iptuFee &&
                  parseFloat(payment.contract.iptuFee) > 0 && (
                    <DetailItem
                      label="IPTU"
                      value={`R$ ${formatDecimalValue(
                        payment.contract.iptuFee
                      )}`}
                    />
                  )}
              </>
            )}

            {payment.isSecurityDeposit && (
              <DetailItem
                label="Depósito Caução"
                value={`R$ ${formatDecimalValue(payment.amountDue)}`}
              />
            )}

            <div className="border-t border-dashed border-border !my-3"></div>
            <div className="flex justify-between items-center py-2">
              <span className="text-base font-bold text-gray-800">
                Valor Total
              </span>
              <span className="text-xl font-bold text-primary">
                R$ {formatDecimalValue(payment.amountDue)}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-base font-semibold text-gray-700 mb-4">
              Informações
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Inquilino</p>
                <p className="font-semibold text-gray-800">
                  {payment.contract.tenant?.name || "Não informado"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Imóvel</p>
                <p className="font-semibold text-gray-800">
                  {payment.contract.property.title}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Vencimento</p>
                <p className="font-semibold text-gray-800">
                  {formatDateForDisplay(payment.dueDate, {
                    showRelative: true,
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <PaymentActions />
          </div>
        </main>
      </div>
    </div>
  );
}
